/**
 * CameraController.js - Camera presets and orbit controls for dome viewing
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const CAMERA_PRESETS = {
    front:     { pos: [0, 3, 14],    target: [0, 2, 0],   label: 'Frontal' },
    back:      { pos: [0, 3, -14],   target: [0, 2, 0],   label: 'Trasera' },
    side:      { pos: [14, 3, 0],    target: [0, 2, 0],   label: 'Lateral' },
    top:       { pos: [0, 18, 0.1],  target: [0, 0, 0],   label: 'Superior' },
    overview:  { pos: [12, 6, 12],   target: [0, 2, 0],   label: 'General' },
    interior:  { pos: [0, 1.6, 0.5], target: [0, 1.6, 3], label: 'Interior' },
};

export class CameraController {
    constructor(camera, canvas, renderer) {
        this.camera = camera;
        this.canvas = canvas;
        this.controls = new OrbitControls(camera, canvas);
        this.isInterior = false;
        this.domeRadius = 4;
        this.animating = false;

        this._setupControls();
    }

    _setupControls() {
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 30;
        this.controls.maxPolarAngle = Math.PI * 0.85;
        this.controls.target.set(0, 2, 0);
        this.controls.update();
    }

    setDomeRadius(radius) {
        this.domeRadius = radius;
        // Update presets based on dome size
        const scale = radius / 4;
        CAMERA_PRESETS.front.pos = [0, radius * 0.75, radius * 3.5];
        CAMERA_PRESETS.back.pos = [0, radius * 0.75, -radius * 3.5];
        CAMERA_PRESETS.side.pos = [radius * 3.5, radius * 0.75, 0];
        CAMERA_PRESETS.top.pos = [0, radius * 4.5, 0.1];
        CAMERA_PRESETS.overview.pos = [radius * 3, radius * 1.5, radius * 3];
        CAMERA_PRESETS.interior.pos = [0, 1.6, 0.5];
        CAMERA_PRESETS.interior.target = [0, 1.6, radius * 0.7];

        for (const key of ['front', 'back', 'side', 'top', 'overview']) {
            CAMERA_PRESETS[key].target = [0, radius * 0.5, 0];
        }
    }

    goToPreset(presetName, onComplete) {
        const preset = CAMERA_PRESETS[presetName];
        if (!preset) return;

        this.isInterior = (presetName === 'interior');

        if (this.isInterior) {
            // Constrain orbit to inside dome
            this.controls.minDistance = 0.1;
            this.controls.maxDistance = this.domeRadius * 0.8;
            this.controls.maxPolarAngle = Math.PI * 0.95;
        } else {
            this.controls.minDistance = 2;
            this.controls.maxDistance = 30;
            this.controls.maxPolarAngle = Math.PI * 0.85;
        }

        this._animateCamera(
            new THREE.Vector3(...preset.pos),
            new THREE.Vector3(...preset.target),
            onComplete
        );
    }

    _animateCamera(targetPos, targetLookAt, onComplete) {
        if (this.animating) return;
        this.animating = true;

        const startPos = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const duration = 1200; // ms
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Smooth easing
            const ease = t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

            this.camera.position.lerpVectors(startPos, targetPos, ease);
            this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
            this.controls.update();

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                this.animating = false;
                if (onComplete) onComplete();
            }
        };

        requestAnimationFrame(animate);
    }

    update() {
        if (!this.animating) {
            this.controls.update();
        }
    }

    dispose() {
        this.controls.dispose();
    }
}
