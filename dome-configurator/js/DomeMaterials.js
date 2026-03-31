/**
 * DomeMaterials.js - PBR materials for realistic dome rendering
 */

import * as THREE from 'three';

export const COVER_COLORS = {
    white:  { name: 'Blanco',  hex: '#f5f0e8', preview: '#f5f0e8' },
    beige:  { name: 'Beige',   hex: '#d4c5a9', preview: '#d4c5a9' },
    green:  { name: 'Verde',   hex: '#5a7a5a', preview: '#5a7a5a' },
    grey:   { name: 'Gris',    hex: '#8a8a8a', preview: '#8a8a8a' },
    blue:   { name: 'Azul',    hex: '#4a6a8a', preview: '#4a6a8a' },
    brown:  { name: 'Marron',  hex: '#7a5a3a', preview: '#7a5a3a' },
};

export const FLOOR_OPTIONS = {
    lightWood:  { name: 'Madera Clara',   hex: '#c4a46a' },
    darkWood:   { name: 'Madera Oscura',  hex: '#6a4a2a' },
    concrete:   { name: 'Concreto',       hex: '#a0a0a0' },
};

export class DomeMaterialLibrary {
    constructor() {
        this.envMap = null;
        this.materials = {};
        this._createMaterials();
    }

    setEnvironmentMap(envMap) {
        this.envMap = envMap;
        // Update all materials with environment map
        Object.values(this.materials).forEach(mat => {
            if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                mat.envMap = envMap;
                mat.envMapIntensity = mat.userData.envIntensity || 0.8;
                mat.needsUpdate = true;
            }
        });
    }

    _createMaterials() {
        // Frame material - metallic aluminum
        this.materials.frame = new THREE.MeshStandardMaterial({
            color: 0xd0d0d0,
            metalness: 0.85,
            roughness: 0.25,
            envMapIntensity: 1.0,
        });
        this.materials.frame.userData.envIntensity = 1.0;

        // Hub material - slightly darker metal
        this.materials.hub = new THREE.MeshStandardMaterial({
            color: 0xb8b8b8,
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 1.0,
        });
        this.materials.hub.userData.envIntensity = 1.0;

        // Default cover - white PVC/canvas
        this.materials.cover = new THREE.MeshPhysicalMaterial({
            color: 0xf5f0e8,
            roughness: 0.65,
            metalness: 0.0,
            clearcoat: 0.1,
            clearcoatRoughness: 0.8,
            side: THREE.DoubleSide,
            envMapIntensity: 0.5,
        });
        this.materials.cover.userData.envIntensity = 0.5;

        // Transparent panel - glass-like
        this.materials.transparentPanel = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 0.05,
            transmission: 0.88,
            thickness: 0.02,
            ior: 1.45,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide,
            envMapIntensity: 0.6,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
        });
        this.materials.transparentPanel.userData.envIntensity = 0.6;

        // Glass door material
        this.materials.glassDoor = new THREE.MeshPhysicalMaterial({
            color: 0xe8f4f8,
            metalness: 0.0,
            roughness: 0.02,
            transmission: 0.92,
            thickness: 0.01,
            ior: 1.52,
            transparent: true,
            opacity: 0.97,
            envMapIntensity: 0.8,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
        });
        this.materials.glassDoor.userData.envIntensity = 0.8;

        // Door frame material
        this.materials.doorFrame = new THREE.MeshStandardMaterial({
            color: 0xe0e0e0,
            metalness: 0.9,
            roughness: 0.15,
            envMapIntensity: 1.0,
        });
        this.materials.doorFrame.userData.envIntensity = 1.0;

        // Wooden deck material
        this.materials.deck = new THREE.MeshStandardMaterial({
            color: 0xc4a46a,
            roughness: 0.75,
            metalness: 0.0,
            envMapIntensity: 0.3,
        });
        this.materials.deck.userData.envIntensity = 0.3;

        // Floor materials
        this.materials.floorLightWood = new THREE.MeshStandardMaterial({
            color: 0xc4a46a,
            roughness: 0.7,
            metalness: 0.0,
            side: THREE.DoubleSide,
            envMapIntensity: 0.3,
        });
        this.materials.floorLightWood.userData.envIntensity = 0.3;

        this.materials.floorDarkWood = new THREE.MeshStandardMaterial({
            color: 0x6a4a2a,
            roughness: 0.65,
            metalness: 0.0,
            side: THREE.DoubleSide,
            envMapIntensity: 0.3,
        });
        this.materials.floorDarkWood.userData.envIntensity = 0.3;

        this.materials.floorConcrete = new THREE.MeshStandardMaterial({
            color: 0xa0a0a0,
            roughness: 0.85,
            metalness: 0.0,
            side: THREE.DoubleSide,
            envMapIntensity: 0.2,
        });
        this.materials.floorConcrete.userData.envIntensity = 0.2;

        // Ground plane - grass
        this.materials.ground = new THREE.MeshStandardMaterial({
            color: 0x4a7a3a,
            roughness: 0.95,
            metalness: 0.0,
            envMapIntensity: 0.2,
        });
        this.materials.ground.userData.envIntensity = 0.2;

        // Interior panel (backside of cover)
        this.materials.interiorCover = new THREE.MeshStandardMaterial({
            color: 0xf0ece0,
            roughness: 0.8,
            metalness: 0.0,
            side: THREE.BackSide,
            envMapIntensity: 0.2,
        });
        this.materials.interiorCover.userData.envIntensity = 0.2;
    }

    setCoverColor(colorKey) {
        const colorDef = COVER_COLORS[colorKey];
        if (!colorDef) return;
        this.materials.cover.color.set(colorDef.hex);
        this.materials.interiorCover.color.set(
            new THREE.Color(colorDef.hex).lerp(new THREE.Color(0xf0ece0), 0.5)
        );
        this.materials.cover.needsUpdate = true;
        this.materials.interiorCover.needsUpdate = true;
    }

    getFloorMaterial(floorKey) {
        const map = {
            lightWood: this.materials.floorLightWood,
            darkWood: this.materials.floorDarkWood,
            concrete: this.materials.floorConcrete,
        };
        return map[floorKey] || this.materials.floorLightWood;
    }

    dispose() {
        Object.values(this.materials).forEach(mat => mat.dispose());
    }
}
