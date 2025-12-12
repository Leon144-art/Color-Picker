import { monitorTestTemplate } from '../templates/monitorTest.js';

const HEX_INPUT_PATTERN = /^#[0-9a-fA-F]{6}$/;

export class MonitorTestComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`MonitorTestComponent: container ${containerId} not found`);
    }

    this.container.innerHTML = monitorTestTemplate;
    this.cacheElements();
    this.bindEvents();
  }

  cacheElements() {
    this.testCards = this.container.querySelectorAll('.test-card');

    this.customTestColor = this.container.querySelector('#custom-test-color');
    this.customTestHex = this.container.querySelector('#custom-test-hex');
    this.launchCustomColor = this.container.querySelector('#launch-custom-color');

    this.gradientStart = this.container.querySelector('#gradient-start');
    this.gradientEnd = this.container.querySelector('#gradient-end');
    this.gradientDirection = this.container.querySelector('#gradient-direction');
    this.launchCustomGradient = this.container.querySelector('#launch-custom-gradient');

    this.testSolidView = document.getElementById('test-solid-color');
    this.testGradientView = document.getElementById('test-gradient');
    this.testPatternView = document.getElementById('test-pattern');
    this.testBlacklevelView = document.getElementById('test-blacklevel');
    this.testSolidContent = document.getElementById('test-solid-content');
    this.testGradientContent = document.getElementById('test-gradient-content');
    this.testPatternContent = document.getElementById('test-pattern-content');
    this.testBlacklevelContent = document.getElementById('test-blacklevel-content');

    this.activeTestView = null;
  }

  bindEvents() {
    this.testCards.forEach((card) => {
      card.addEventListener('click', () => this.startTest(card));
    });

    this.customTestColor?.addEventListener('input', (e) => {
      if (this.customTestHex) {
        this.customTestHex.value = e.target.value;
      }
    });

    this.customTestHex?.addEventListener('input', (e) => {
      const hex = e.target.value;
      if (HEX_INPUT_PATTERN.test(hex) && this.customTestColor) {
        this.customTestColor.value = hex;
      }
    });

    this.launchCustomColor?.addEventListener('click', () => {
      if (!this.customTestColor) return;
      const color = this.customTestColor.value;
      this.launchCustomTest('solid', { color });
    });

    this.launchCustomGradient?.addEventListener('click', () => {
      if (!this.gradientStart || !this.gradientEnd || !this.gradientDirection) return;
      this.launchCustomTest('gradient', {
        start: this.gradientStart.value,
        end: this.gradientEnd.value,
        direction: this.gradientDirection.value,
      });
    });

    [this.testSolidView, this.testGradientView, this.testPatternView, this.testBlacklevelView].forEach((view) => {
      view?.addEventListener('click', () => this.hideTestView());
    });

    this.handleEscape = (e) => {
      if (e.key === 'Escape' && this.activeTestView) {
        this.hideTestView();
      }
    };
    document.addEventListener('keydown', this.handleEscape);
  }

  startTest(card) {
    const testType = card.dataset.test;
    const color = card.dataset.color;

    if (testType === 'solid') {
      this.testSolidContent.style.background = color;
      this.showTestView(this.testSolidView);
    } else if (testType === 'blacklevel') {
      this.renderBlackLevel();
      this.showTestView(this.testBlacklevelView);
    } else if (testType === 'white-saturation') {
      this.renderWhiteSaturation();
      this.showTestView(this.testBlacklevelView);
    } else if (testType === 'gray-steps-32') {
      this.testGradientContent.style.background = 'linear-gradient(to right, #000 0%, #080808 3.125%, #101010 6.25%, #181818 9.375%, #202020 12.5%, #292929 15.625%, #313131 18.75%, #393939 21.875%, #414141 25%, #4a4a4a 28.125%, #525252 31.25%, #5a5a5a 34.375%, #626262 37.5%, #6b6b6b 40.625%, #737373 43.75%, #7b7b7b 46.875%, #838383 50%, #8c8c8c 53.125%, #949494 56.25%, #9c9c9c 59.375%, #a4a4a4 62.5%, #adadad 65.625%, #b5b5b5 68.75%, #bdbdbd 71.875%, #c5c5c5 75%, #cecece 78.125%, #d6d6d6 81.25%, #dedede 84.375%, #e6e6e6 87.5%, #efefef 90.625%, #f7f7f7 93.75%, #fff 100%)';
      this.showTestView(this.testGradientView);
    } else if (testType === 'grayscale-gradient') {
      this.testGradientContent.style.background = 'linear-gradient(to right, #000, #fff)';
      this.showTestView(this.testGradientView);
    } else if (testType === 'rgb-gradients') {
      this.testGradientContent.style.background = 'linear-gradient(to right, #f00 0%, #0f0 50%, #00f 100%)';
      this.showTestView(this.testGradientView);
    } else if (testType === 'sharpness-grid') {
      this.resetPatternContent('repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px');
      this.showTestView(this.testPatternView);
    } else if (testType === 'geometry-circles') {
      this.renderGeometryCircles();
      this.showTestView(this.testPatternView);
    } else if (testType === 'color-bars-smpte') {
      this.resetPatternContent('linear-gradient(to right, #c0c0c0 0% 14.28%, #c0c000 14.28% 28.56%, #00c0c0 28.56% 42.84%, #00c000 42.84% 57.12%, #c000c0 57.12% 71.4%, #c00000 71.4% 85.68%, #0000c0 85.68% 100%)');
      this.showTestView(this.testPatternView);
    } else if (testType === 'uniformity-gray') {
      this.testSolidContent.style.background = '#808080';
      this.showTestView(this.testSolidView);
    } else if (testType === 'dead-pixel-check') {
      this.renderDeadPixelCheck();
      this.showTestView(this.testSolidView);
    }
  }

  launchCustomTest(type, data) {
    if (type === 'solid') {
      this.testSolidContent.style.background = data.color;
      this.showTestView(this.testSolidView);
    } else if (type === 'gradient') {
      this.testGradientContent.style.background = `linear-gradient(${data.direction}, ${data.start}, ${data.end})`;
      this.showTestView(this.testGradientView);
    }
  }

  renderBlackLevel() {
    this.testBlacklevelContent.innerHTML = '';
    this.testBlacklevelContent.style.background = '#000';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; flex-direction: column; height: 100%; justify-content: center; padding: 40px; gap: 40px;';

    const gradient = document.createElement('div');
    gradient.style.cssText = 'height: 120px; background: linear-gradient(to right, #000, #fff); width: 100%; border: 1px solid #333;';

    const bars = document.createElement('div');
    bars.style.cssText = 'display: flex; height: 120px; width: 100%;';
    for (let i = 0; i <= 32; i += 2) {
      const bar = document.createElement('div');
      const level = i;
      bar.style.cssText = `flex: 1; background: rgb(${level}, ${level}, ${level}); border-right: 1px solid #111;`;
      bars.appendChild(bar);
    }

    wrapper.appendChild(gradient);
    wrapper.appendChild(bars);
    this.testBlacklevelContent.appendChild(wrapper);
  }

  renderWhiteSaturation() {
    this.testBlacklevelContent.innerHTML = '';
    this.testBlacklevelContent.style.background = '#fff';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; flex-direction: column; height: 100%; justify-content: center; padding: 40px; gap: 40px;';

    const gradient = document.createElement('div');
    gradient.style.cssText = 'height: 120px; background: linear-gradient(to right, #eee, #fff); width: 100%; border: 1px solid #ddd;';

    const bars = document.createElement('div');
    bars.style.cssText = 'display: flex; height: 120px; width: 100%;';
    // White saturation: 235-255 (20 levels, steps of 1)
    for (let i = 235; i <= 255; i += 1) {
      const bar = document.createElement('div');
      bar.style.cssText = `flex: 1; background: rgb(${i}, ${i}, ${i}); border-right: 1px solid #eee;`;
      bars.appendChild(bar);
    }

    wrapper.appendChild(gradient);
    wrapper.appendChild(bars);
    this.testBlacklevelContent.appendChild(wrapper);
  }

  resetPatternContent(background = '') {
    if (!this.testPatternContent) return;
    this.testPatternContent.innerHTML = '';
    this.testPatternContent.style.background = background;
  }

  renderGeometryCircles() {
    this.resetPatternContent('#fff');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';

    // Grid lines
    for (let i = 0; i <= 10; i++) {
      const lineV = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineV.setAttribute('x1', `${i * 10}%`);
      lineV.setAttribute('y1', '0');
      lineV.setAttribute('x2', `${i * 10}%`);
      lineV.setAttribute('y2', '100%');
      lineV.setAttribute('stroke', i === 5 ? '#000' : '#ccc');
      lineV.setAttribute('stroke-width', i === 5 ? '2' : '1');
      svg.appendChild(lineV);

      const lineH = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineH.setAttribute('x1', '0');
      lineH.setAttribute('y1', `${i * 10}%`);
      lineH.setAttribute('x2', '100%');
      lineH.setAttribute('y2', `${i * 10}%`);
      lineH.setAttribute('stroke', i === 5 ? '#000' : '#ccc');
      lineH.setAttribute('stroke-width', i === 5 ? '2' : '1');
      svg.appendChild(lineH);
    }

    // Circles at center and corners
    const circles = [
      { cx: '50%', cy: '50%', r: '15%' },
      { cx: '25%', cy: '25%', r: '10%' },
      { cx: '75%', cy: '25%', r: '10%' },
      { cx: '25%', cy: '75%', r: '10%' },
      { cx: '75%', cy: '75%', r: '10%' },
    ];

    circles.forEach(({ cx, cy, r }) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#000');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
    });

    this.testPatternContent.appendChild(svg);
  }

  renderDeadPixelCheck() {
    this.testSolidContent.innerHTML = '';
    const colors = [
      { bg: '#000000', name: 'Black' },
      { bg: '#ffffff', name: 'White' },
      { bg: '#ff0000', name: 'Red' },
      { bg: '#00ff00', name: 'Green' },
      { bg: '#0000ff', name: 'Blue' }
    ];
    let currentIndex = 0;

    // Create hint overlay
    const hintOverlay = document.createElement('div');
    hintOverlay.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      pointer-events: none;
      z-index: 100;
      backdrop-filter: blur(8px);
      transition: opacity 0.3s ease;
      text-align: center;
    `;

    const updateDisplay = () => {
      const { bg, name } = colors[currentIndex];
      this.testSolidContent.style.background = bg;
      hintOverlay.innerHTML = `<strong>${name}</strong><br><span style="font-size: 12px; opacity: 0.8;">Click to cycle · Press ESC to exit</span>`;
    };

    const cycleColor = (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % colors.length;
      updateDisplay();
      
      // Show hint briefly
      hintOverlay.style.opacity = '1';
      clearTimeout(this.deadPixelHintTimer);
      this.deadPixelHintTimer = setTimeout(() => {
        hintOverlay.style.opacity = '0';
      }, 2000);
    };

    // Initial setup
    updateDisplay();
    this.testSolidContent.appendChild(hintOverlay);
    
    // Show hint initially, then hide after 3 seconds
    hintOverlay.style.opacity = '1';
    this.deadPixelHintTimer = setTimeout(() => {
      hintOverlay.style.opacity = '0';
    }, 3000);

    // Add click listener
    this.testSolidContent.addEventListener('click', cycleColor);
    
    // Store references for cleanup
    this.deadPixelCycleHandler = cycleColor;
    this.deadPixelHintElement = hintOverlay;
  }

  showTestView(view) {
    [this.testSolidView, this.testGradientView, this.testPatternView, this.testBlacklevelView].forEach((v) => {
      if (v) v.dataset.active = 'false';
    });

    if (view) {
      view.dataset.active = 'true';
      this.activeTestView = view;
      this.enterFullscreen(view);
    }
  }

  hideTestView() {
    if (this.activeTestView) {
      this.activeTestView.dataset.active = 'false';
      this.activeTestView = null;
    }
    
    // Cleanup dead pixel check
    if (this.deadPixelCycleHandler) {
      this.testSolidContent.removeEventListener('click', this.deadPixelCycleHandler);
      this.deadPixelCycleHandler = null;
    }
    if (this.deadPixelHintTimer) {
      clearTimeout(this.deadPixelHintTimer);
      this.deadPixelHintTimer = null;
    }
    if (this.deadPixelHintElement) {
      this.deadPixelHintElement.remove();
      this.deadPixelHintElement = null;
    }
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  enterFullscreen(element) {
    if (element?.requestFullscreen) {
      element.requestFullscreen().catch(() => {});
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.handleEscape);
  }
}
