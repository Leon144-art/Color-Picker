import { rgbToHex, hexToRgb, hsvToRgb, rgbToHsv, rgbToHsl, hslToRgb } from '../utils/color_convert.js';
export class ColorWheel {
    constructor(canvasId, mode, slider, textElements, callbacks = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.mode = mode;
        this.slider = slider;
        this.textElements = textElements;
        this.onHexChange = callbacks.onHexChange;
        this.colorInput = callbacks.colorInput;

        this.size = this.canvas.width;
        this.centerX = this.size / 2;
        this.centerY = this.size / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 1;

        this.currentH = 0;
        this.currentS = 0;
        this.currentV = 1;
        this.currentL = 0.5;

        this.dragging = false;

        this.bindEvents();

        this.draw();
    }

    bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.dragging = true;
            this.handleWheelEvent(e);
        });

        window.addEventListener('mousemove', (e) => {
            if (this.dragging) this.handleWheelEvent(e);
        });

        window.addEventListener('mouseup', () => {
            this.dragging = false;
        });

        this.canvas.addEventListener('touchstart', (e) => {
            this.dragging = true;
            this.handleWheelEvent(e.touches[0]);
            e.preventDefault();
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.dragging) {
                this.handleWheelEvent(e.touches[0]);
                e.preventDefault();
            }
        });

        window.addEventListener('touchend', () => {
            this.dragging = false;
        });

        this.slider.addEventListener('input', (e) => {
            const value = Math.min(1, Math.max(0, Number(e.target.value) / 100));
            if (this.mode === 'HSV') {
                this.currentV = value;
            } else {
                this.currentL = value;
            }
            this.updateFromWheel();
        });
    }

    handleWheelEvent(evt) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (evt.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (evt.clientY - rect.top) * (this.canvas.height / rect.height);

        const dx = x - this.centerX;
        const dy = y - this.centerY;
        let r = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        angle = (angle + 90) % 360;

        let s = Math.min(1, r / this.radius);
        if (r > this.radius) {
            r = this.radius;
            s = 1;
        }

        this.currentH = angle;
        this.currentS = s;
        this.updateFromWheel();
    }

    draw() {
        const image = this.ctx.createImageData(this.size, this.size);
        const data = image.data;

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const dx = x - this.centerX;
                const dy = y - this.centerY;
                const r = Math.sqrt(dx * dx + dy * dy);
                const idx = (y * this.size + x) * 4;

                if (r <= this.radius) {
                    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    if (angle < 0) angle += 360;
                    angle = (angle + 90) % 360;
                    const s = Math.min(1, r / this.radius);

                    let rgb;
                    if (this.mode === 'HSV') {
                        rgb = hsvToRgb(angle, s, this.currentV);
                    } else {
                        rgb = hslToRgb(angle, s, this.currentL);
                    }

                    let alpha = 255;
                    if (r > this.radius - 1.8) {
                        alpha = Math.round(255 * (this.radius - r) / 2);
                    }

                    data[idx] = rgb.r;
                    data[idx + 1] = rgb.g;
                    data[idx + 2] = rgb.b;
                    data[idx + 3] = alpha;
                } else {
                    data[idx] = data[idx + 1] = data[idx + 2] = 0;
                    data[idx + 3] = 0;
                }
            }
        }

        this.ctx.putImageData(image, 0, 0);

        this.drawIndicator();
    }

    drawIndicator() {
        const adjustedAngle = (this.currentH - 90) % 360;
        const px = this.centerX + this.currentS * this.radius * Math.cos(adjustedAngle * Math.PI / 180);
        const py = this.centerY + this.currentS * this.radius * Math.sin(adjustedAngle * Math.PI / 180);

        this.ctx.beginPath();
        this.ctx.arc(px, py, 6, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(px, py, 3, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    updateReadouts() {
        if (this.mode === 'HSV') {
            const { r, g, b } = hsvToRgb(this.currentH, this.currentS, this.currentV);
            this.textElements.hsvText.textContent =
                `HSV(${Math.round(this.currentH)}, ${Math.round(this.currentS * 100)}%, ${Math.round(this.currentV * 100)}%)`;
            // this.textElements.rgbText.textContent = `RGB(${r}, ${g}, ${b})`;
            this.textElements.vText.textContent = `V=${Math.round(this.currentV * 100)}%`;
        } else {
            const { r, g, b } = hslToRgb(this.currentH, this.currentS, this.currentL);
            this.textElements.hslText.textContent =
                `HSL(${Math.round(this.currentH)}, ${Math.round(this.currentS * 100)}%, ${Math.round(this.currentL * 100)}%)`;
            //   this.textElements.rgbText.textContent = `RGB(${r}, ${g}, ${b})`;
            this.textElements.lText.textContent = `L=${Math.round(this.currentL * 100)}%`;
        }
    }

    updateFromWheel() {
        let rgb, hex;
        if (this.mode === 'HSV') {
            rgb = hsvToRgb(this.currentH, this.currentS, this.currentV);  
        } else {
            rgb = hslToRgb(this.currentH, this.currentS, this.currentL);  
        }

        hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        if (typeof this.onHexChange === 'function') {
            this.onHexChange(hex, this.mode);
        }

        if (this.colorInput) {
            this.colorInput.value = hex;
        }

        this.updateReadouts();
        this.draw();
    }

    setFromHex(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return;

        if (this.mode === 'HSV') {
            const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);
            this.currentH = h;
            this.currentS = s;
            this.currentV = v;
            this.slider.value = String(Math.round(v * 100));
        } else {
            const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
            this.currentH = h;
            this.currentS = s;
            this.currentL = l;
            this.slider.value = String(Math.round(l * 100));
        }

        this.updateReadouts();
        this.draw();
    }
}
