/**
 * main.js - Dome Configurator entry point
 * Orchestrates scene, geometry, materials, accessories, camera, and UI
 */

import * as THREE from 'three';
import { DomeScene } from './DomeScene.js';
import { GeodesicDomeBuilder } from './DomeGeometry.js';
import { DomeMaterialLibrary } from './DomeMaterials.js';
import { CameraController } from './CameraController.js';
import { UIController } from './UIController.js';
import {
    createGlassDoor,
    createWoodStove,
    createDeck,
    createInteriorFloor
} from './DomeAccessories.js';

class DomeConfigurator {
    constructor() {
        this.canvas = document.getElementById('dome-canvas');
        if (!this.canvas) {
            console.error('Canvas element #dome-canvas not found');
            return;
        }

        // Core systems
        this.scene = new DomeScene(this.canvas);
        this.materialLib = new DomeMaterialLibrary();
        this.cameraController = new CameraController(
            this.scene.camera, this.canvas, this.scene.renderer
        );

        // Dome state
        this.domeGroup = new THREE.Group();
        this.domeGroup.name = 'domeGroup';
        this.scene.scene.add(this.domeGroup);

        // Current config
        this.currentConfig = null;

        // Setup environment map
        this._setupEnvironment();

        // UI (pass this as configurator reference)
        this.ui = new UIController(this);

        // Initial dome build
        this.updateDome(this.ui.getConfig());

        // Start render loop
        this._animate();

        // Handle resize
        window.addEventListener('resize', () => this._onResize());
        this._onResize();

        // Loading screen
        this._hideLoading();
    }

    _setupEnvironment() {
        const envMap = this.scene.createEnvironmentMap();
        this.scene.scene.environment = envMap;
        this.materialLib.setEnvironmentMap(envMap);
    }

    /**
     * Rebuild the dome based on current configuration
     */
    updateDome(config) {
        this.currentConfig = config;
        const radius = config.diameter / 2;

        // Clear previous dome
        this._clearDome();

        // Build geometry
        const builder = new GeodesicDomeBuilder(radius, -0.15);

        // Determine transparent panel faces
        const transparentFaces = this._getTransparentFaces(builder, config.panoramic);

        // Door faces to exclude from panels
        const doorFaces = builder.doorFaceIndices;

        // All excluded faces (door + transparent handled separately)
        const excludedFromOpaque = [...doorFaces, ...transparentFaces];

        // --- Opaque panels ---
        const opaquePanelGeo = builder.buildPanelGeometry(excludedFromOpaque);
        const opaquePanels = new THREE.Mesh(opaquePanelGeo, this.materialLib.materials.cover);
        opaquePanels.castShadow = true;
        opaquePanels.receiveShadow = true;
        opaquePanels.name = 'opaquePanels';
        this.domeGroup.add(opaquePanels);

        // --- Transparent panels ---
        if (transparentFaces.length > 0) {
            const allExceptTransparent = [];
            for (let i = 0; i < builder.faces.length; i++) {
                if (!transparentFaces.includes(i)) {
                    allExceptTransparent.push(i);
                }
            }
            const transparentPanelGeo = builder.buildPanelGeometry(allExceptTransparent);
            const transparentPanels = new THREE.Mesh(
                transparentPanelGeo,
                this.materialLib.materials.transparentPanel
            );
            transparentPanels.castShadow = false;
            transparentPanels.renderOrder = 1;
            transparentPanels.name = 'transparentPanels';
            this.domeGroup.add(transparentPanels);
        }

        // --- Frame (struts) ---
        const frameGeo = builder.buildFrameGeometry(0.018);
        if (frameGeo.getAttribute('position')) {
            const frame = new THREE.Mesh(frameGeo, this.materialLib.materials.frame);
            frame.castShadow = true;
            frame.name = 'frame';
            this.domeGroup.add(frame);
        }

        // --- Hubs ---
        const hubGeo = builder.buildHubGeometry(0.028);
        if (hubGeo.getAttribute('position')) {
            const hubs = new THREE.Mesh(hubGeo, this.materialLib.materials.hub);
            hubs.castShadow = true;
            hubs.name = 'hubs';
            this.domeGroup.add(hubs);
        }

        // --- Glass Door ---
        const isDoubleDoor = config.diameter >= 11;
        const door = createGlassDoor(radius, isDoubleDoor, this.materialLib.materials);
        this.domeGroup.add(door);

        // --- Deck ---
        const deck = createDeck(radius, this.materialLib.materials.deck);
        this.domeGroup.add(deck);

        // --- Interior Floor ---
        const floorMat = this.materialLib.getFloorMaterial(config.floorType);
        const floor = createInteriorFloor(radius, floorMat);
        this.domeGroup.add(floor);

        // --- Wood Stove (if enabled) ---
        if (config.accessories.stove) {
            const stove = createWoodStove(radius);
            this.domeGroup.add(stove);
        }

        // Update material colors
        this.materialLib.setCoverColor(config.coverColor);

        // Update camera presets for this size
        this.cameraController.setDomeRadius(radius);
    }

    _getTransparentFaces(builder, panoramicPreset) {
        switch (panoramicPreset) {
            case 'solid':
                return [];
            case 'front_half':
                return builder.getFacesInRegion(45, 135, -0.1, 0.5);
            case 'front_full':
                return builder.getPanoramicFrontFaces();
            case 'full_360':
                return builder.getFacesInRegion(-180, 180, -0.1, 0.5);
            default:
                return [];
        }
    }

    _clearDome() {
        while (this.domeGroup.children.length > 0) {
            const child = this.domeGroup.children[0];
            if (child.geometry) child.geometry.dispose();
            this.domeGroup.remove(child);
        }
        this.scene.removeInteriorLights();
    }

    _animate() {
        requestAnimationFrame(() => this._animate());
        this.cameraController.update();
        this.scene.handleResize();
        this.scene.render();
    }

    _onResize() {
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
        }
    }

    _hideLoading() {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 800);
        }
    }

    /**
     * Take a screenshot of the current view
     */
    takeScreenshot() {
        this.scene.renderer.render(this.scene.scene, this.scene.camera);
        const dataUrl = this.scene.renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `dome-${this.currentConfig.diameter}m-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.domeConfigurator = new DomeConfigurator();
});
