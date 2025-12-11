import { ColorWheel } from './wheel.js';
import { colorPickerTemplate } from '../templates/colorPicker.js';
import { hexToRgb } from '../utils/color_convert.js';

const LAST_COLOR_KEY = 'colorAnalyser.lastColor';
const HEX_PATTERN = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3,4}|[0-9a-fA-F]{8})$/;

export class ColorPickerComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`ColorPickerComponent: container ${containerId} not found`);
    }

    this.container.innerHTML = colorPickerTemplate;
    this.cacheElements();
    this.bindEvents();
    this.initWheels();

    const initialHex = this.restoreColor();
    this.setFromHex(initialHex);
  }

  cacheElements() {
    this.nativeColor = this.container.querySelector('#native-color');
    this.swatch = this.container.querySelector('#swatch');
    this.colorText = this.container.querySelector('#color-text');
    this.copyBtn = this.container.querySelector('#copy');

    this.rgbReadout = this.container.querySelector('#rgb-text');
    this.swatchR = this.container.querySelector('.swatch-r');
    this.swatchG = this.container.querySelector('.swatch-g');
    this.swatchB = this.container.querySelector('.swatch-b');

    this.hsvValueSlider = this.container.querySelector('#hsv-value');
    this.hsvVText = this.container.querySelector('#hsv-v-text');
    this.hsvHsvText = this.container.querySelector('#hsv-hsv-text');

    this.hslLightnessSlider = this.container.querySelector('#hsl-lightness');
    this.hslLText = this.container.querySelector('#hsl-l-text');
    this.hslHslText = this.container.querySelector('#hsl-hsl-text');
  }

  bindEvents() {
    this.nativeColor?.addEventListener('input', (e) => {
      this.setFromHex(e.target.value, 'native');
    });

    this.copyBtn?.addEventListener('click', () => this.copyCurrentHex());
  }

  initWheels() {
    this.hsvWheel = new ColorWheel(
      'hsv-wheel',
      'HSV',
      this.hsvValueSlider,
      {
        hsvText: this.hsvHsvText,
        vText: this.hsvVText,
      },
      {
        onHexChange: (hex, source) => this.setFromHex(hex, source),
        colorInput: this.nativeColor,
      }
    );

    this.hslWheel = new ColorWheel(
      'hsl-wheel',
      'HSL',
      this.hslLightnessSlider,
      {
        hslText: this.hslHslText,
        lText: this.hslLText,
      },
      {
        onHexChange: (hex, source) => this.setFromHex(hex, source),
        colorInput: this.nativeColor,
      }
    );
  }

  restoreColor() {
    const fallback = this.nativeColor?.value || '#4f8cff';
    try {
      const saved = localStorage.getItem(LAST_COLOR_KEY);
      if (saved && HEX_PATTERN.test(saved)) {
        return saved;
      }
    } catch (_) {
      // ignore
    }
    return fallback;
  }

  setFromHex(hex, excludeSource = null) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    this.currentHex = hex;
    this.applyHex(hex, excludeSource);
    this.updateRgbReadout(rgb);

    if (this.hsvWheel && excludeSource !== 'HSV') {
      this.hsvWheel.setFromHex(hex);
    }
    if (this.hslWheel && excludeSource !== 'HSL') {
      this.hslWheel.setFromHex(hex);
    }
  }

  applyHex(hex, origin) {
    if (origin !== 'native' && this.nativeColor) {
      this.nativeColor.value = hex;
    }
    if (this.swatch) this.swatch.style.background = hex;
    if (this.colorText) this.colorText.textContent = hex;
    document.body?.style.setProperty('--accent', hex);
    try {
      localStorage.setItem(LAST_COLOR_KEY, hex);
    } catch (_) {
      // ignore storage failures
    }
  }

  updateRgbReadout({ r, g, b }) {
    if (this.rgbReadout) this.rgbReadout.textContent = `RGB(${r}, ${g}, ${b})`;
    if (this.swatchR) this.swatchR.style.background = `rgb(${r}, 0, 0)`;
    if (this.swatchG) this.swatchG.style.background = `rgb(0, ${g}, 0)`;
    if (this.swatchB) this.swatchB.style.background = `rgb(0, 0, ${b})`;
  }

  async copyCurrentHex() {
    const hex = this.colorText?.textContent || '';
    if (!hex) return;
    try {
      await navigator.clipboard.writeText(hex);
      const original = this.copyBtn.textContent;
      this.copyBtn.textContent = 'Copied';
      setTimeout(() => (this.copyBtn.textContent = original), 900);
    } catch (_) {
      // fallback selection copy
      const sel = window.getSelection();
      const range = document.createRange();
      const temp = document.createTextNode(hex);
      document.body.appendChild(temp);
      range.selectNode(temp);
      sel.removeAllRanges();
      sel.addRange(range);
      try { document.execCommand('copy'); } catch (_) { }
      sel.removeAllRanges();
      document.body.removeChild(temp);
    }
  }

  getColor() {
    return this.currentHex;
  }
}
