/**
 * UIController.js - Configurator UI panel with step-by-step workflow
 */

import { COVER_COLORS, FLOOR_OPTIONS } from './DomeMaterials.js';
import { CAMERA_PRESETS } from './CameraController.js';

const DOME_SIZES = [
    { diameter: 5,  label: '5m',  area: 19.6,  height: 3.2 },
    { diameter: 6,  label: '6m',  area: 28.3,  height: 3.8 },
    { diameter: 7,  label: '7m',  area: 38.5,  height: 4.5 },
    { diameter: 8,  label: '8m',  area: 50.3,  height: 5.1 },
    { diameter: 9,  label: '9m',  area: 63.6,  height: 5.7 },
    { diameter: 10, label: '10m', area: 78.5,  height: 6.4 },
    { diameter: 11, label: '11m', area: 95.0,  height: 7.0 },
    { diameter: 12, label: '12m', area: 113.1, height: 7.6 },
];

const PANORAMIC_PRESETS = [
    { id: 'solid',      label: 'Opaco Completo',        icon: '◼' },
    { id: 'front_half', label: 'Panorámica Frontal 50%', icon: '◧' },
    { id: 'front_full', label: 'Panorámica Frontal 100%',icon: '◨' },
    { id: 'full_360',   label: 'Panorámica 360°',        icon: '○' },
];

const ACCESSORY_OPTIONS = [
    { id: 'stove',      label: 'Estufa a Leña',     icon: '🔥', default: false },
    { id: 'ac',         label: 'Aire Acondicionado', icon: '❄',  default: false },
    { id: 'ventilation',label: 'Ventilación',        icon: '💨', default: false },
    { id: 'lighting',   label: 'Iluminación LED',    icon: '💡', default: false },
];

export class UIController {
    constructor(configurator) {
        this.configurator = configurator;
        this.currentStep = 0;
        this.config = {
            diameter: 7,
            coverColor: 'white',
            panoramic: 'front_half',
            doorType: 'single', // auto-determined by size
            floorType: 'lightWood',
            accessories: { stove: false, ac: false, ventilation: false, lighting: false },
        };

        this._buildUI();
        this._bindEvents();
    }

    _buildUI() {
        const panel = document.getElementById('config-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="config-header">
                <h1 class="config-title">The Dome Shop</h1>
                <p class="config-subtitle">Configurador 3D</p>
            </div>

            <div class="config-steps">
                ${this._buildStepIndicator()}
            </div>

            <div class="config-content">
                ${this._buildStep0_Size()}
                ${this._buildStep1_Cover()}
                ${this._buildStep2_Panoramic()}
                ${this._buildStep3_Accessories()}
                ${this._buildStep4_Floor()}
                ${this._buildStep5_Summary()}
            </div>

            <div class="config-nav">
                <button id="btn-prev" class="btn btn-secondary" disabled>← Anterior</button>
                <button id="btn-next" class="btn btn-primary">Siguiente →</button>
            </div>

            <div class="camera-controls">
                <span class="camera-label">Vistas:</span>
                ${Object.entries(CAMERA_PRESETS).map(([key, preset]) =>
                    `<button class="btn-camera" data-preset="${key}">${preset.label}</button>`
                ).join('')}
            </div>
        `;

        this._showStep(0);
    }

    _buildStepIndicator() {
        const steps = ['Tamaño', 'Cubierta', 'Panorámica', 'Accesorios', 'Piso', 'Resumen'];
        return `<div class="steps-row">
            ${steps.map((s, i) => `
                <div class="step-dot ${i === 0 ? 'active' : ''}" data-step="${i}">
                    <span class="step-number">${i + 1}</span>
                    <span class="step-label">${s}</span>
                </div>
            `).join('')}
        </div>`;
    }

    _buildStep0_Size() {
        return `<div class="step-panel" data-step="0">
            <h2>Selecciona el Tamaño</h2>
            <div class="size-grid">
                ${DOME_SIZES.map(s => `
                    <button class="size-btn ${s.diameter === this.config.diameter ? 'selected' : ''}"
                            data-diameter="${s.diameter}">
                        <span class="size-value">${s.label}</span>
                        <span class="size-detail">${s.area.toFixed(0)} m² · ${s.height.toFixed(1)}m alto</span>
                        <span class="size-door">${s.diameter >= 11 ? 'Puerta Doble' : 'Puerta Simple'}</span>
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

    _buildStep1_Cover() {
        return `<div class="step-panel" data-step="1" style="display:none">
            <h2>Color de Cubierta</h2>
            <div class="color-grid">
                ${Object.entries(COVER_COLORS).map(([key, c]) => `
                    <button class="color-btn ${key === this.config.coverColor ? 'selected' : ''}"
                            data-color="${key}">
                        <span class="color-swatch" style="background:${c.preview}"></span>
                        <span class="color-name">${c.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

    _buildStep2_Panoramic() {
        return `<div class="step-panel" data-step="2" style="display:none">
            <h2>Vistas Panorámicas</h2>
            <p class="step-desc">Define qué paneles serán transparentes</p>
            <div class="panoramic-grid">
                ${PANORAMIC_PRESETS.map(p => `
                    <button class="panoramic-btn ${p.id === this.config.panoramic ? 'selected' : ''}"
                            data-panoramic="${p.id}">
                        <span class="panoramic-icon">${p.icon}</span>
                        <span class="panoramic-label">${p.label}</span>
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

    _buildStep3_Accessories() {
        return `<div class="step-panel" data-step="3" style="display:none">
            <h2>Accesorios</h2>
            <div class="accessory-list">
                ${ACCESSORY_OPTIONS.map(a => `
                    <label class="accessory-item">
                        <input type="checkbox" data-accessory="${a.id}"
                               ${this.config.accessories[a.id] ? 'checked' : ''}>
                        <span class="accessory-icon">${a.icon}</span>
                        <span class="accessory-label">${a.label}</span>
                    </label>
                `).join('')}
            </div>
            <div class="door-info">
                <h3>Puerta de Vidrio</h3>
                <p id="door-type-display">
                    ${this.config.diameter >= 11 ? 'Puerta Doble de Vidrio (auto)' : 'Puerta Simple de Vidrio (auto)'}
                </p>
            </div>
        </div>`;
    }

    _buildStep4_Floor() {
        return `<div class="step-panel" data-step="4" style="display:none">
            <h2>Piso Interior</h2>
            <div class="floor-grid">
                ${Object.entries(FLOOR_OPTIONS).map(([key, f]) => `
                    <button class="floor-btn ${key === this.config.floorType ? 'selected' : ''}"
                            data-floor="${key}">
                        <span class="floor-swatch" style="background:${f.hex}"></span>
                        <span class="floor-name">${f.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

    _buildStep5_Summary() {
        return `<div class="step-panel" data-step="5" style="display:none">
            <h2>Resumen de Configuración</h2>
            <div id="summary-content" class="summary-content"></div>
            <div class="summary-actions">
                <button id="btn-screenshot" class="btn btn-secondary">📷 Captura</button>
                <button id="btn-contact" class="btn btn-primary">📩 Solicitar Cotización</button>
            </div>
        </div>`;
    }

    _showStep(step) {
        this.currentStep = step;
        const panels = document.querySelectorAll('.step-panel');
        panels.forEach(p => p.style.display = 'none');
        const active = document.querySelector(`.step-panel[data-step="${step}"]`);
        if (active) active.style.display = '';

        // Update step dots
        document.querySelectorAll('.step-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === step);
            dot.classList.toggle('completed', i < step);
        });

        // Nav buttons
        const prev = document.getElementById('btn-prev');
        const next = document.getElementById('btn-next');
        if (prev) prev.disabled = step === 0;
        if (next) next.textContent = step === 5 ? 'Finalizar' : 'Siguiente →';

        // Update summary when reaching last step
        if (step === 5) this._updateSummary();
    }

    _updateSummary() {
        const el = document.getElementById('summary-content');
        if (!el) return;

        const sizeInfo = DOME_SIZES.find(s => s.diameter === this.config.diameter);
        const colorInfo = COVER_COLORS[this.config.coverColor];
        const floorInfo = FLOOR_OPTIONS[this.config.floorType];
        const panoramicInfo = PANORAMIC_PRESETS.find(p => p.id === this.config.panoramic);
        const activeAccessories = ACCESSORY_OPTIONS.filter(a => this.config.accessories[a.id]);

        el.innerHTML = `
            <div class="summary-row">
                <span class="summary-label">Diámetro</span>
                <span class="summary-value">${sizeInfo.label}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Área</span>
                <span class="summary-value">${sizeInfo.area.toFixed(1)} m²</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Altura</span>
                <span class="summary-value">${sizeInfo.height.toFixed(1)} m</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Cubierta</span>
                <span class="summary-value">${colorInfo.name}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Panorámica</span>
                <span class="summary-value">${panoramicInfo.label}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Puerta</span>
                <span class="summary-value">${this.config.diameter >= 11 ? 'Doble Vidrio' : 'Simple Vidrio'}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Piso</span>
                <span class="summary-value">${floorInfo.name}</span>
            </div>
            ${activeAccessories.length > 0 ? `
            <div class="summary-row">
                <span class="summary-label">Accesorios</span>
                <span class="summary-value">${activeAccessories.map(a => a.label).join(', ')}</span>
            </div>` : ''}
        `;
    }

    _bindEvents() {
        // Navigation
        document.getElementById('btn-next')?.addEventListener('click', () => {
            if (this.currentStep < 5) this._showStep(this.currentStep + 1);
        });
        document.getElementById('btn-prev')?.addEventListener('click', () => {
            if (this.currentStep > 0) this._showStep(this.currentStep - 1);
        });

        // Step dots clickable
        document.querySelectorAll('.step-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this._showStep(parseInt(dot.dataset.step));
            });
        });

        // Size selection
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const diameter = parseInt(btn.dataset.diameter);
                this.config.diameter = diameter;
                this.config.doorType = diameter >= 11 ? 'double' : 'single';
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                // Update door display
                const doorDisplay = document.getElementById('door-type-display');
                if (doorDisplay) {
                    doorDisplay.textContent = diameter >= 11
                        ? 'Puerta Doble de Vidrio (auto)'
                        : 'Puerta Simple de Vidrio (auto)';
                }
                this.configurator.updateDome(this.config);
            });
        });

        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.config.coverColor = btn.dataset.color;
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.configurator.updateDome(this.config);
            });
        });

        // Panoramic selection
        document.querySelectorAll('.panoramic-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.config.panoramic = btn.dataset.panoramic;
                document.querySelectorAll('.panoramic-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.configurator.updateDome(this.config);
            });
        });

        // Accessories
        document.querySelectorAll('[data-accessory]').forEach(cb => {
            cb.addEventListener('change', () => {
                this.config.accessories[cb.dataset.accessory] = cb.checked;
                this.configurator.updateDome(this.config);
            });
        });

        // Floor selection
        document.querySelectorAll('.floor-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.config.floorType = btn.dataset.floor;
                document.querySelectorAll('.floor-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.configurator.updateDome(this.config);
            });
        });

        // Camera presets
        document.querySelectorAll('.btn-camera').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                this.configurator.cameraController.goToPreset(preset, () => {
                    if (preset === 'interior') {
                        this.configurator.scene.addInteriorLights(this.config.diameter / 2);
                    } else {
                        this.configurator.scene.removeInteriorLights();
                    }
                });
            });
        });

        // Screenshot
        document.getElementById('btn-screenshot')?.addEventListener('click', () => {
            this.configurator.takeScreenshot();
        });

        // Contact
        document.getElementById('btn-contact')?.addEventListener('click', () => {
            const subject = `Cotización Domo ${this.config.diameter}m - ${COVER_COLORS[this.config.coverColor].name}`;
            const body = `Configuración solicitada:%0A` +
                `Diámetro: ${this.config.diameter}m%0A` +
                `Color: ${COVER_COLORS[this.config.coverColor].name}%0A` +
                `Panorámica: ${PANORAMIC_PRESETS.find(p => p.id === this.config.panoramic).label}%0A` +
                `Puerta: ${this.config.diameter >= 11 ? 'Doble' : 'Simple'}%0A` +
                `Piso: ${FLOOR_OPTIONS[this.config.floorType].name}`;
            window.open(`mailto:info@thedomeshop.com?subject=${subject}&body=${body}`);
        });
    }

    getConfig() {
        return { ...this.config };
    }
}
