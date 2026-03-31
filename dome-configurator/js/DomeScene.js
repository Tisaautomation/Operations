/**
 * DomeScene.js - Three.js scene setup with realistic lighting and environment
 */

import * as THREE from 'three';

export class DomeScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.lights = {};

        this._initRenderer();
        this._initCamera();
        this._initScene();
        this._initLights();
        this._initGround();
        this._initSky();
    }

    _initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    _initCamera() {
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(12, 6, 12);
        this.camera.lookAt(0, 2, 0);
    }

    _initScene() {
        this.scene = new THREE.Scene();
    }

    _initLights() {
        // Hemisphere light for ambient sky/ground
        this.lights.hemisphere = new THREE.HemisphereLight(0x87ceeb, 0x4a7a3a, 0.6);
        this.scene.add(this.lights.hemisphere);

        // Main directional light (sun)
        this.lights.sun = new THREE.DirectionalLight(0xfff5e6, 1.8);
        this.lights.sun.position.set(15, 20, 10);
        this.lights.sun.castShadow = true;
        this.lights.sun.shadow.mapSize.width = 2048;
        this.lights.sun.shadow.mapSize.height = 2048;
        this.lights.sun.shadow.camera.near = 0.5;
        this.lights.sun.shadow.camera.far = 60;
        this.lights.sun.shadow.camera.left = -15;
        this.lights.sun.shadow.camera.right = 15;
        this.lights.sun.shadow.camera.top = 15;
        this.lights.sun.shadow.camera.bottom = -15;
        this.lights.sun.shadow.bias = -0.0005;
        this.lights.sun.shadow.normalBias = 0.02;
        this.scene.add(this.lights.sun);

        // Fill light (softer, from opposite side)
        this.lights.fill = new THREE.DirectionalLight(0xc4d4f0, 0.5);
        this.lights.fill.position.set(-10, 8, -5);
        this.scene.add(this.lights.fill);

        // Ambient light for overall brightness
        this.lights.ambient = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(this.lights.ambient);
    }

    _initGround() {
        // Large ground plane
        const groundGeo = new THREE.PlaneGeometry(200, 200);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x5a8a4a,
            roughness: 0.95,
            metalness: 0.0,
        });
        this.groundPlane = new THREE.Mesh(groundGeo, groundMat);
        this.groundPlane.rotation.x = -Math.PI / 2;
        this.groundPlane.position.y = 0;
        this.groundPlane.receiveShadow = true;
        this.scene.add(this.groundPlane);
    }

    _initSky() {
        // Gradient sky using a large sphere
        const skyGeo = new THREE.SphereGeometry(100, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor:    { value: new THREE.Color(0x3a7ad5) },
                bottomColor: { value: new THREE.Color(0xc8dff0) },
                offset:      { value: 10 },
                exponent:    { value: 0.4 },
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide,
            depthWrite: false,
        });
        this.sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(this.sky);
    }

    /**
     * Generate a procedural environment map for reflections
     */
    createEnvironmentMap() {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();

        // Create a simple procedural environment
        const envScene = new THREE.Scene();

        // Sky gradient for environment
        const envSkyGeo = new THREE.SphereGeometry(50, 32, 16);
        const envSkyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor:    { value: new THREE.Color(0x5599dd) },
                bottomColor: { value: new THREE.Color(0x88bb88) },
                horizonColor: { value: new THREE.Color(0xddeeff) },
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform vec3 horizonColor;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition).y;
                    vec3 color;
                    if (h > 0.0) {
                        color = mix(horizonColor, topColor, pow(h, 0.5));
                    } else {
                        color = mix(horizonColor, bottomColor, pow(-h, 0.3));
                    }
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide,
        });
        envScene.add(new THREE.Mesh(envSkyGeo, envSkyMat));

        // Add sun glow to environment
        const sunGeo = new THREE.SphereGeometry(3, 16, 8);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffdd });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sun.position.set(15, 20, 10);
        envScene.add(sun);

        const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
        pmremGenerator.dispose();
        envScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });

        return envMap;
    }

    /**
     * Add interior lighting (warm point lights)
     */
    addInteriorLights(domeRadius) {
        // Central warm light
        this.lights.interiorMain = new THREE.PointLight(0xffe4b5, 1.5, domeRadius * 3);
        this.lights.interiorMain.position.set(0, domeRadius * 0.6, 0);
        this.lights.interiorMain.castShadow = false;
        this.scene.add(this.lights.interiorMain);

        // Secondary fill lights
        this.lights.interiorFill1 = new THREE.PointLight(0xffd4a0, 0.5, domeRadius * 2);
        this.lights.interiorFill1.position.set(domeRadius * 0.3, domeRadius * 0.3, domeRadius * 0.3);
        this.scene.add(this.lights.interiorFill1);

        this.lights.interiorFill2 = new THREE.PointLight(0xffd4a0, 0.5, domeRadius * 2);
        this.lights.interiorFill2.position.set(-domeRadius * 0.3, domeRadius * 0.3, -domeRadius * 0.3);
        this.scene.add(this.lights.interiorFill2);
    }

    removeInteriorLights() {
        ['interiorMain', 'interiorFill1', 'interiorFill2'].forEach(key => {
            if (this.lights[key]) {
                this.scene.remove(this.lights[key]);
                this.lights[key].dispose();
                delete this.lights[key];
            }
        });
    }

    handleResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.renderer.dispose();
        this.scene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}
