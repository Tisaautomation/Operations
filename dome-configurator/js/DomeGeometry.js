/**
 * DomeGeometry.js - Geodesic V3 (3-frequency) dome geometry generator
 *
 * Generates a geodesic dome by subdividing an icosahedron 3 times,
 * projecting vertices onto a sphere, and truncating to a dome shape.
 */

import * as THREE from 'three';

// Golden ratio for icosahedron vertices
const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Creates the 12 vertices of a regular icosahedron
 */
function createIcosahedronVertices() {
    const verts = [
        [-1,  PHI, 0], [ 1,  PHI, 0], [-1, -PHI, 0], [ 1, -PHI, 0],
        [ 0, -1,  PHI], [ 0,  1,  PHI], [ 0, -1, -PHI], [ 0,  1, -PHI],
        [ PHI, 0, -1], [ PHI, 0,  1], [-PHI, 0, -1], [-PHI, 0,  1]
    ];
    return verts.map(v => {
        const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        return new THREE.Vector3(v[0]/len, v[1]/len, v[2]/len);
    });
}

/**
 * Creates the 20 triangular faces of the icosahedron
 */
function createIcosahedronFaces() {
    return [
        [0,11,5], [0,5,1], [0,1,7], [0,7,10], [0,10,11],
        [1,5,9], [5,11,4], [11,10,2], [10,7,6], [7,1,8],
        [3,9,4], [3,4,2], [3,2,6], [3,6,8], [3,8,9],
        [4,9,5], [2,4,11], [6,2,10], [8,6,7], [9,8,1]
    ];
}

/**
 * Generate a unique key for a vertex pair (edge midpoint caching)
 */
function edgeKey(i, j) {
    return i < j ? `${i}_${j}` : `${j}_${i}`;
}

/**
 * Subdivide a triangle into smaller triangles (frequency subdivision)
 * For V3: each edge is divided into 3 segments, creating 9 sub-triangles per face
 */
function subdivideTriangleV3(vertices, triIndices) {
    const newFaces = [];
    const vertexCache = {};

    function getOrCreateVertex(p) {
        const key = `${p.x.toFixed(10)}_${p.y.toFixed(10)}_${p.z.toFixed(10)}`;
        if (vertexCache[key] !== undefined) {
            return vertexCache[key];
        }
        // Project onto unit sphere
        const normalized = p.clone().normalize();
        const idx = vertices.length;
        vertices.push(normalized);
        vertexCache[key] = idx;
        return idx;
    }

    // Register existing vertices
    for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        const key = `${v.x.toFixed(10)}_${v.y.toFixed(10)}_${v.z.toFixed(10)}`;
        vertexCache[key] = i;
    }

    const freq = 3; // V3 frequency

    for (const [ai, bi, ci] of triIndices) {
        const a = vertices[ai];
        const b = vertices[bi];
        const c = vertices[ci];

        // Create grid of vertices within the triangle
        const grid = [];
        for (let i = 0; i <= freq; i++) {
            grid[i] = [];
            for (let j = 0; j <= freq - i; j++) {
                const k = freq - i - j;
                // Barycentric interpolation
                const point = new THREE.Vector3(
                    (a.x * i + b.x * j + c.x * k) / freq,
                    (a.y * i + b.y * j + c.y * k) / freq,
                    (a.z * i + b.z * j + c.z * k) / freq
                );
                grid[i][j] = getOrCreateVertex(point);
            }
        }

        // Create triangles from grid
        for (let i = 0; i < freq; i++) {
            for (let j = 0; j < freq - i; j++) {
                // Upward triangle
                newFaces.push([grid[i][j], grid[i][j+1], grid[i+1][j]]);
                // Downward triangle (if exists)
                if (j + 1 <= freq - i - 1) {
                    newFaces.push([grid[i][j+1], grid[i+1][j+1], grid[i+1][j]]);
                }
            }
        }
    }

    return newFaces;
}

/**
 * Identifies unique edges from faces for frame generation
 */
function extractEdges(faces) {
    const edgeSet = new Set();
    const edges = [];
    for (const [a, b, c] of faces) {
        const pairs = [[a,b], [b,c], [c,a]];
        for (const [i, j] of pairs) {
            const key = edgeKey(i, j);
            if (!edgeSet.has(key)) {
                edgeSet.add(key);
                edges.push([i, j]);
            }
        }
    }
    return edges;
}

/**
 * Main class for generating geodesic dome geometry
 */
export class GeodesicDomeBuilder {
    constructor(radius = 4, truncationY = -0.15) {
        this.radius = radius;
        this.truncationY = truncationY; // Y threshold for dome cut (normalized, -1 to 1)
        this.vertices = [];
        this.faces = [];
        this.edges = [];
        this.panelGroups = { opaque: [], transparent: [] };
        this.doorFaceIndices = [];

        this._generate();
    }

    _generate() {
        // Step 1: Create icosahedron
        this.vertices = createIcosahedronVertices();
        const icoFaces = createIcosahedronFaces();

        // Step 2: V3 subdivision
        this.faces = subdivideTriangleV3(this.vertices, icoFaces);

        // Step 3: Truncate to dome (keep faces above truncation line)
        this._truncate();

        // Step 4: Extract edges for frame
        this.edges = extractEdges(this.faces);

        // Step 5: Identify door region faces (front-bottom)
        this._identifyDoorFaces();
    }

    _truncate() {
        const kept = [];
        for (const face of this.faces) {
            const [a, b, c] = face;
            const va = this.vertices[a];
            const vb = this.vertices[b];
            const vc = this.vertices[c];
            // Keep face if centroid is above truncation line
            const centroidY = (va.y + vb.y + vc.y) / 3;
            if (centroidY > this.truncationY) {
                kept.push(face);
            }
        }
        this.faces = kept;
        // Re-extract edges after truncation
        this.edges = extractEdges(this.faces);
    }

    _identifyDoorFaces() {
        // Door faces: lowest triangles at the front (positive Z, low Y)
        this.doorFaceIndices = [];
        const candidates = [];

        for (let i = 0; i < this.faces.length; i++) {
            const [a, b, c] = this.faces[i];
            const va = this.vertices[a];
            const vb = this.vertices[b];
            const vc = this.vertices[c];
            const centroidY = (va.y + vb.y + vc.y) / 3;
            const centroidZ = (va.z + vb.z + vc.z) / 3;

            // Front-facing, lower portion
            if (centroidZ > 0.3 && centroidY < 0.35) {
                candidates.push({ index: i, y: centroidY, z: centroidZ });
            }
        }

        // Sort by Z (frontmost) then Y (lowest)
        candidates.sort((a, b) => (b.z - a.z) + (a.y - b.y) * 0.5);

        // Take the front-bottom triangles for door opening
        this.doorFaceIndices = candidates.slice(0, 6).map(c => c.index);
    }

    /**
     * Build the panel mesh (triangular panels covering the dome)
     */
    buildPanelGeometry(excludeFaceIndices = []) {
        const excludeSet = new Set(excludeFaceIndices);
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        let vertCount = 0;

        for (let i = 0; i < this.faces.length; i++) {
            if (excludeSet.has(i)) continue;

            const [ai, bi, ci] = this.faces[i];
            const a = this.vertices[ai].clone().multiplyScalar(this.radius);
            const b = this.vertices[bi].clone().multiplyScalar(this.radius);
            const c = this.vertices[ci].clone().multiplyScalar(this.radius);

            // Compute face normal
            const ab = new THREE.Vector3().subVectors(b, a);
            const ac = new THREE.Vector3().subVectors(c, a);
            const normal = new THREE.Vector3().crossVectors(ab, ac).normalize();

            // Add vertices for this face (non-indexed for flat shading control)
            positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
            normals.push(normal.x, normal.y, normal.z, normal.x, normal.y, normal.z, normal.x, normal.y, normal.z);

            // Simple UV mapping
            uvs.push(0, 0, 1, 0, 0.5, 1);

            indices.push(vertCount, vertCount + 1, vertCount + 2);
            vertCount += 3;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals(); // Smooth normals for better look

        return geometry;
    }

    /**
     * Build the frame geometry (tubes along edges)
     */
    buildFrameGeometry(tubeRadius = 0.025) {
        const group = new THREE.Group();
        const frameGeometries = [];

        for (const [ai, bi] of this.edges) {
            const a = this.vertices[ai].clone().multiplyScalar(this.radius);
            const b = this.vertices[bi].clone().multiplyScalar(this.radius);

            const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
            const direction = new THREE.Vector3().subVectors(b, a);
            const length = direction.length();
            direction.normalize();

            const tubeGeo = new THREE.CylinderGeometry(
                tubeRadius * this.radius,
                tubeRadius * this.radius,
                length,
                8, 1
            );

            // Rotate cylinder to align with edge direction
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            tubeGeo.applyQuaternion(quaternion);
            tubeGeo.translate(mid.x, mid.y, mid.z);

            frameGeometries.push(tubeGeo);
        }

        // Merge all frame geometries for performance
        const mergedGeo = mergeGeometries(frameGeometries);
        return mergedGeo;
    }

    /**
     * Build hub geometry at vertices (connector nodes)
     */
    buildHubGeometry(hubRadius = 0.04) {
        const geometries = [];
        const usedVertices = new Set();

        for (const face of this.faces) {
            for (const idx of face) {
                usedVertices.add(idx);
            }
        }

        for (const idx of usedVertices) {
            const v = this.vertices[idx].clone().multiplyScalar(this.radius);
            const hubGeo = new THREE.SphereGeometry(hubRadius * this.radius, 8, 6);
            hubGeo.translate(v.x, v.y, v.z);
            geometries.push(hubGeo);
        }

        return mergeGeometries(geometries);
    }

    /**
     * Get faces in a specific region (for transparent panel selection)
     */
    getFacesInRegion(minAngle, maxAngle, minY = -1, maxY = 1) {
        const indices = [];
        for (let i = 0; i < this.faces.length; i++) {
            const [a, b, c] = this.faces[i];
            const va = this.vertices[a];
            const vb = this.vertices[b];
            const vc = this.vertices[c];
            const centroid = new THREE.Vector3(
                (va.x + vb.x + vc.x) / 3,
                (va.y + vb.y + vc.y) / 3,
                (va.z + vb.z + vc.z) / 3
            );

            const angle = Math.atan2(centroid.z, centroid.x) * (180 / Math.PI);
            const normY = centroid.y;

            if (angle >= minAngle && angle <= maxAngle && normY >= minY && normY <= maxY) {
                indices.push(i);
            }
        }
        return indices;
    }

    /**
     * Get front-facing face indices for panoramic windows
     */
    getPanoramicFrontFaces() {
        return this.getFacesInRegion(30, 150, -0.2, 0.7);
    }

    /**
     * Get statistics about the dome
     */
    getStats() {
        const usedVertices = new Set();
        for (const face of this.faces) {
            for (const idx of face) {
                usedVertices.add(idx);
            }
        }
        return {
            totalFaces: this.faces.length,
            totalEdges: this.edges.length,
            totalVertices: usedVertices.size,
            radius: this.radius,
            diameter: this.radius * 2,
            height: this.radius * (1 - this.truncationY) * 0.5 + this.radius * 0.5,
            floorArea: Math.PI * this.radius * this.radius,
            surfaceArea: 2 * Math.PI * this.radius * this.radius
        };
    }
}

/**
 * Merge multiple BufferGeometries into one (manual implementation)
 */
function mergeGeometries(geometries) {
    if (geometries.length === 0) return new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    let indexOffset = 0;
    const indices = [];

    for (const geo of geometries) {
        const pos = geo.getAttribute('position');
        const norm = geo.getAttribute('normal');
        const idx = geo.getIndex();

        for (let i = 0; i < pos.count; i++) {
            positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
            if (norm) {
                normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
            }
        }

        if (idx) {
            for (let i = 0; i < idx.count; i++) {
                indices.push(idx.getComponent(i) + indexOffset);
            }
        } else {
            for (let i = 0; i < pos.count; i++) {
                indices.push(i + indexOffset);
            }
        }

        indexOffset += pos.count;
        geo.dispose();
    }

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    if (normals.length > 0) {
        merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    }
    merged.setIndex(indices);
    if (normals.length === 0) {
        merged.computeVertexNormals();
    }

    return merged;
}
