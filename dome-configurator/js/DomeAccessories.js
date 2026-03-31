/**
 * DomeAccessories.js - Glass doors, panoramic windows, wood stove
 */

import * as THREE from 'three';

/**
 * Creates a rectangular glass door (single or double)
 */
export function createGlassDoor(radius, isDouble, materials) {
    const group = new THREE.Group();
    group.name = 'glassDoor';

    const doorHeight = radius * 0.52;
    const singleWidth = radius * 0.28;
    const doorWidth = isDouble ? singleWidth * 2 + 0.08 : singleWidth;
    const frameThickness = 0.04;
    const frameDepth = 0.06;

    // Door frame - outer rectangle
    const frameColor = materials.doorFrame;

    // Bottom threshold
    const thresholdGeo = new THREE.BoxGeometry(doorWidth + frameThickness * 2, frameThickness, frameDepth);
    const threshold = new THREE.Mesh(thresholdGeo, frameColor);
    threshold.position.set(0, frameThickness / 2, 0);
    threshold.castShadow = true;
    group.add(threshold);

    // Top header
    const headerGeo = new THREE.BoxGeometry(doorWidth + frameThickness * 2, frameThickness, frameDepth);
    const header = new THREE.Mesh(headerGeo, frameColor);
    header.position.set(0, doorHeight + frameThickness / 2, 0);
    header.castShadow = true;
    group.add(header);

    // Left frame post
    const postGeo = new THREE.BoxGeometry(frameThickness, doorHeight, frameDepth);
    const leftPost = new THREE.Mesh(postGeo, frameColor);
    leftPost.position.set(-doorWidth / 2 - frameThickness / 2, doorHeight / 2 + frameThickness, 0);
    leftPost.castShadow = true;
    group.add(leftPost);

    // Right frame post
    const rightPost = new THREE.Mesh(postGeo, frameColor);
    rightPost.position.set(doorWidth / 2 + frameThickness / 2, doorHeight / 2 + frameThickness, 0);
    rightPost.castShadow = true;
    group.add(rightPost);

    if (isDouble) {
        // Center divider
        const dividerGeo = new THREE.BoxGeometry(frameThickness * 0.6, doorHeight, frameDepth);
        const divider = new THREE.Mesh(dividerGeo, frameColor);
        divider.position.set(0, doorHeight / 2 + frameThickness, 0);
        divider.castShadow = true;
        group.add(divider);

        // Two glass panels
        const panelWidth = (doorWidth - frameThickness * 0.6) / 2 - 0.01;
        const glassGeo = new THREE.PlaneGeometry(panelWidth, doorHeight - 0.02);

        const leftGlass = new THREE.Mesh(glassGeo, materials.glassDoor);
        leftGlass.position.set(-doorWidth / 4 - 0.01, doorHeight / 2 + frameThickness, 0.001);
        group.add(leftGlass);

        const rightGlass = new THREE.Mesh(glassGeo, materials.glassDoor);
        rightGlass.position.set(doorWidth / 4 + 0.01, doorHeight / 2 + frameThickness, 0.001);
        group.add(rightGlass);

        // Door handles
        addDoorHandle(group, -0.06, doorHeight * 0.5 + frameThickness, 0.035, frameColor);
        addDoorHandle(group, 0.06, doorHeight * 0.5 + frameThickness, 0.035, frameColor);
    } else {
        // Single glass panel
        const glassGeo = new THREE.PlaneGeometry(doorWidth - 0.02, doorHeight - 0.02);
        const glass = new THREE.Mesh(glassGeo, materials.glassDoor);
        glass.position.set(0, doorHeight / 2 + frameThickness, 0.001);
        group.add(glass);

        // Single handle
        addDoorHandle(group, doorWidth * 0.3, doorHeight * 0.5 + frameThickness, 0.035, frameColor);
    }

    // Position door at front of dome
    const doorZ = Math.sqrt(radius * radius - (doorHeight * 0.3) * (doorHeight * 0.3)) * 0.92;
    group.position.set(0, 0, doorZ);

    return group;
}

function addDoorHandle(group, x, y, z, material) {
    const handleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
    handleGeo.rotateZ(Math.PI / 2);
    const handle = new THREE.Mesh(handleGeo, material);
    handle.position.set(x, y, z);
    group.add(handle);

    // Handle base plates
    const plateGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.005, 8);
    plateGeo.rotateX(Math.PI / 2);
    const plate1 = new THREE.Mesh(plateGeo, material);
    plate1.position.set(x - 0.05, y, z);
    group.add(plate1);
    const plate2 = new THREE.Mesh(plateGeo, material);
    plate2.position.set(x + 0.05, y, z);
    group.add(plate2);
}

/**
 * Creates a wood burning stove with chimney
 */
export function createWoodStove(radius) {
    const group = new THREE.Group();
    group.name = 'woodStove';

    const stoveMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.85,
        roughness: 0.4,
    });

    const stoveBodyMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.5,
    });

    // Stove body
    const bodyGeo = new THREE.BoxGeometry(0.5, 0.55, 0.4);
    const body = new THREE.Mesh(bodyGeo, stoveBodyMat);
    body.position.y = 0.45;
    body.castShadow = true;
    group.add(body);

    // Stove legs
    const legGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.18, 8);
    const legPositions = [
        [-0.2, 0.09, -0.15], [0.2, 0.09, -0.15],
        [-0.2, 0.09, 0.15],  [0.2, 0.09, 0.15]
    ];
    for (const [x, y, z] of legPositions) {
        const leg = new THREE.Mesh(legGeo, stoveMat);
        leg.position.set(x, y, z);
        leg.castShadow = true;
        group.add(leg);
    }

    // Glass front (fire viewing window)
    const windowGeo = new THREE.PlaneGeometry(0.35, 0.3);
    const windowMat = new THREE.MeshPhysicalMaterial({
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 0.3,
        metalness: 0.0,
        roughness: 0.2,
        transmission: 0.3,
        transparent: true,
        opacity: 0.85,
    });
    const stoveWindow = new THREE.Mesh(windowGeo, windowMat);
    stoveWindow.position.set(0, 0.45, 0.201);
    group.add(stoveWindow);

    // Chimney pipe
    const chimneyRadius = 0.06;
    const chimneyHeight = radius * 1.1;

    // Vertical chimney section
    const chimneyGeo = new THREE.CylinderGeometry(chimneyRadius, chimneyRadius, chimneyHeight, 12);
    const chimney = new THREE.Mesh(chimneyGeo, stoveMat);
    chimney.position.set(0, 0.72 + chimneyHeight / 2, -0.1);
    chimney.castShadow = true;
    group.add(chimney);

    // Chimney cap (rain guard)
    const capGeo = new THREE.CylinderGeometry(chimneyRadius * 1.8, chimneyRadius * 1.8, 0.02, 12);
    const cap = new THREE.Mesh(capGeo, stoveMat);
    cap.position.set(0, 0.72 + chimneyHeight + 0.04, -0.1);
    group.add(cap);

    // Support disk
    const supportGeo = new THREE.CylinderGeometry(chimneyRadius * 1.5, chimneyRadius * 1.5, 0.015, 12);
    const support = new THREE.Mesh(supportGeo, stoveMat);
    support.position.set(0, 0.72 + chimneyHeight + 0.06, -0.1);
    group.add(support);

    // Fire glow light
    const fireLight = new THREE.PointLight(0xff6600, 0.8, radius * 0.8);
    fireLight.position.set(0, 0.5, 0.3);
    group.add(fireLight);

    // Position stove inside dome (back-center)
    group.position.set(0, 0, -radius * 0.4);

    return group;
}

/**
 * Creates the wooden deck platform beneath the dome
 */
export function createDeck(radius, material) {
    const group = new THREE.Group();
    group.name = 'deck';

    // Main deck - slightly larger than dome footprint
    const deckSize = radius * 2.4;
    const deckGeo = new THREE.BoxGeometry(deckSize, 0.15, deckSize);
    const deck = new THREE.Mesh(deckGeo, material);
    deck.position.y = -0.075;
    deck.receiveShadow = true;
    deck.castShadow = true;
    group.add(deck);

    // Deck planking lines (visual detail)
    const linesMat = new THREE.MeshStandardMaterial({
        color: 0x8a6a3a,
        roughness: 0.9,
        metalness: 0,
    });

    const plankWidth = 0.15;
    const numPlanks = Math.floor(deckSize / plankWidth);
    for (let i = 0; i < numPlanks; i++) {
        const lineGeo = new THREE.BoxGeometry(0.005, 0.002, deckSize);
        const line = new THREE.Mesh(lineGeo, linesMat);
        line.position.set(-deckSize / 2 + i * plankWidth + plankWidth / 2, 0.001, 0);
        group.add(line);
    }

    return group;
}

/**
 * Creates the interior floor (can be different from deck)
 */
export function createInteriorFloor(radius, material) {
    const floorGeo = new THREE.CircleGeometry(radius * 0.98, 64);
    const floor = new THREE.Mesh(floorGeo, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.002;
    floor.receiveShadow = true;
    floor.name = 'interiorFloor';
    return floor;
}
