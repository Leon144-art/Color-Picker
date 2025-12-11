import{ rgbToHex, hexToRgb, hsvToRgb, rgbToHsv, rgbToHsl, hslToRgb } from './utils/color_convert.js';
import { ColorWheel } from './components/wheel.js';
import { initWallpaper } from './components/wallpaper.js';
// Element references
const nativeColor = document.getElementById('native-color');
const swatch = document.getElementById('swatch');
const colorText = document.getElementById('color-text');
const copyBtn = document.getElementById('copy');

// HSV wheel elements
const hsvValueSlider = document.getElementById('hsv-value');
const hsvVText = document.getElementById('hsv-v-text');
const hsvHsvText = document.getElementById('hsv-hsv-text');
const hsvRgbText = document.getElementById('hsv-rgb-text');

// HSL wheel elements
const hslLightnessSlider = document.getElementById('hsl-lightness');
const hslLText = document.getElementById('hsl-l-text');
const hslHslText = document.getElementById('hsl-hsl-text');
const hslRgbText = document.getElementById('hsl-rgb-text');

const rgbReadout = document.getElementById('rgb-text');
const swatchR = document.querySelector('.swatch-r');
const swatchG = document.querySelector('.swatch-g');
const swatchB = document.querySelector('.swatch-b');  

// Navigation Elements
const navPicker = document.getElementById('nav-picker');
const navMonitor = document.getElementById('nav-monitor');
const viewPicker = document.getElementById('view-picker');
const viewMonitor = document.getElementById('view-monitor-test');

// Monitor Test Elements
const testCards = document.querySelectorAll('.test-card');
const testSolidView = document.getElementById('test-solid-color');
const testGradientView = document.getElementById('test-gradient');
const testPatternView = document.getElementById('test-pattern');
const testBlacklevelView = document.getElementById('test-blacklevel');
const testSolidContent = document.getElementById('test-solid-content');
const testGradientContent = document.getElementById('test-gradient-content');
const testPatternContent = document.getElementById('test-pattern-content');
const testBlacklevelContent = document.getElementById('test-blacklevel-content');
const customTestColor = document.getElementById('custom-test-color');
const customTestHex = document.getElementById('custom-test-hex');
const launchCustomColor = document.getElementById('launch-custom-color');
const gradientStart = document.getElementById('gradient-start');
const gradientEnd = document.getElementById('gradient-end');
const gradientDirection = document.getElementById('gradient-direction');
const launchCustomGradient = document.getElementById('launch-custom-gradient');

let currentHex = nativeColor?.value || '#4f8cff';
let activeTestView = null;

// --- Navigation Logic ---
function switchView(viewName) {
    if (viewName === 'picker') {
        navPicker.classList.add('active');
        navMonitor.classList.remove('active');
        viewPicker.classList.add('active');
        viewMonitor.classList.remove('active');
    } else if (viewName === 'monitor') {
        navPicker.classList.remove('active');
        navMonitor.classList.add('active');
        viewPicker.classList.remove('active');
        viewMonitor.classList.add('active');
    }
}

navPicker?.addEventListener('click', () => switchView('picker'));
navMonitor?.addEventListener('click', () => switchView('monitor'));

// --- Monitor Test Logic ---
function showTestView(view) {
    // Hide all test views
    [testSolidView, testGradientView, testPatternView, testBlacklevelView].forEach(v => {
        if (v) v.dataset.active = 'false';
    });
    
    // Show selected view
    if (view) {
        view.dataset.active = 'true';
        activeTestView = view;
        enterFullscreen(view);
    }
}

function hideTestView() {
    if (activeTestView) {
        activeTestView.dataset.active = 'false';
        activeTestView = null;
    }
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
}

function startTest(card) {
    const testType = card.dataset.test;
    const color = card.dataset.color;
    
    if (testType === 'solid') {
        testSolidContent.style.background = color;
        showTestView(testSolidView);
    } else if (testType === 'grayscale') {
        testGradientContent.style.background = 'linear-gradient(to right, #000, #fff)';
        showTestView(testGradientView);
    } else if (testType === 'blacklevel') {
        testBlacklevelContent.innerHTML = '';
        testBlacklevelContent.style.background = '#000';
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: flex; flex-direction: column; height: 100%; justify-content: center; padding: 40px; gap: 40px;';
        
        const gradient = document.createElement('div');
        gradient.style.cssText = 'height: 120px; background: linear-gradient(to right, #000, #fff); width: 100%; border: 1px solid #333;';
        
        const bars = document.createElement('div');
        bars.style.cssText = 'display: flex; height: 120px; width: 100%;';
        for(let i=0; i<=32; i+=2) {
            const bar = document.createElement('div');
            const level = i; 
            bar.style.cssText = `flex: 1; background: rgb(${level}, ${level}, ${level}); border-right: 1px solid #111;`;
            bars.appendChild(bar);
        }
        
        wrapper.appendChild(gradient);
        wrapper.appendChild(bars);
        testBlacklevelContent.appendChild(wrapper);
        showTestView(testBlacklevelView);
    } else if (testType === 'rgb-gradient') {
        testGradientContent.style.background = 'linear-gradient(to right, #f00 0%, #0f0 50%, #00f 100%)';
        showTestView(testGradientView);
    } else if (testType === 'checkerboard') {
        testPatternContent.style.background = 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 40px 40px';
        showTestView(testPatternView);
    } else if (testType === 'grid') {
        testPatternContent.style.background = 'repeating-linear-gradient(#000 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, #000 0 1px, #fff 1px 20px)';
        showTestView(testPatternView);
    } else if (testType === 'color-bars') {
        testPatternContent.style.background = 'linear-gradient(to right, #fff 0% 14.28%, #ff0 14.28% 28.56%, #0ff 28.56% 42.84%, #0f0 42.84% 57.12%, #f0f 57.12% 71.4%, #f00 71.4% 85.68%, #00f 85.68% 100%)';
        showTestView(testPatternView);
    } else if (testType === 'crosshatch') {
        testPatternContent.style.background = 'repeating-linear-gradient(45deg, transparent, transparent 10px, #666 10px, #666 11px), repeating-linear-gradient(-45deg, transparent, transparent 10px, #666 10px, #666 11px), #000';
        showTestView(testPatternView);
    } else if (testType === 'gray-steps-5') {
        testGradientContent.style.background = 'linear-gradient(to right, #000 0% 20%, #404040 20% 40%, #808080 40% 60%, #bfbfbf 60% 80%, #fff 80% 100%)';
        showTestView(testGradientView);
    } else if (testType === 'gray-steps-10') {
        testGradientContent.style.background = 'linear-gradient(to right, #000 0% 10%, #1c1c1c 10% 20%, #383838 20% 30%, #555 30% 40%, #717171 40% 50%, #8e8e8e 50% 60%, #aaa 60% 70%, #c7c7c7 70% 80%, #e3e3e3 80% 90%, #fff 90% 100%)';
        showTestView(testGradientView);
    } else if (testType === 'near-black-steps') {
        testGradientContent.style.background = 'linear-gradient(to right, #000 0% 12.5%, #020202 12.5% 25%, #040404 25% 37.5%, #080808 37.5% 50%, #101010 50% 62.5%, #181818 62.5% 75%, #202020 75% 87.5%, #282828 87.5% 100%)';
        showTestView(testGradientView);
    }
}

function launchCustomTest(type, data) {
    if (type === 'solid') {
        testSolidContent.style.background = data.color;
        showTestView(testSolidView);
    } else if (type === 'gradient') {
        testGradientContent.style.background = `linear-gradient(${data.direction}, ${data.start}, ${data.end})`;
        showTestView(testGradientView);
    }
}

function enterFullscreen(element) {
    if (element && element.requestFullscreen) {
        element.requestFullscreen().catch(() => {});
    }
}

testCards.forEach(card => {
    card.addEventListener('click', () => startTest(card));
});

// Custom color test
customTestColor?.addEventListener('input', (e) => {
    customTestHex.value = e.target.value;
});

customTestHex?.addEventListener('input', (e) => {
    const hex = e.target.value;
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
        customTestColor.value = hex;
    }
});

launchCustomColor?.addEventListener('click', () => {
    const color = customTestColor.value;
    launchCustomTest('solid', { color });
});

// Custom gradient test
launchCustomGradient?.addEventListener('click', () => {
    launchCustomTest('gradient', {
        start: gradientStart.value,
        end: gradientEnd.value,
        direction: gradientDirection.value
    });
});

// Click to exit test views
[testSolidView, testGradientView, testPatternView, testBlacklevelView].forEach(view => {
    view?.addEventListener('click', hideTestView);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeTestView) {
        hideTestView();
    }
});


// Centralized apply function (updates UI + storage)
function setHex(hex, origin = 'unknown') {
    if (origin !== 'native') {
        try { nativeColor.value = hex; } catch (_) { }
    }
    swatch.style.background = hex;
    colorText.textContent = hex;
    document.body.style.setProperty('--accent', hex);
    try { localStorage.setItem('colorAnalyser.lastColor', hex); } catch (_) { }
}

// Restore last color, else use current input default
(function restore() {
    try {
        const saved = localStorage.getItem('colorAnalyser.lastColor');
        if (saved && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3,4}|[0-9a-fA-F]{8})$/.test(saved)) {
            setHex(saved, 'restore');
        } else {
            setHex(nativeColor.value, 'restore');
        }
    } catch (_) { setHex(nativeColor.value, 'restore'); }
})();

// Copy current hex to clipboard (with fallback)
copyBtn.addEventListener('click', async () => {
    const hex = colorText.textContent || '';
    try {
        await navigator.clipboard.writeText(hex);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(() => (copyBtn.textContent = original), 900);
    } catch (_) {
        const sel = window.getSelection();
        const range = document.createRange();
        const tempTextNode = document.createTextNode(hex);
        document.body.appendChild(tempTextNode);
        range.selectNode(tempTextNode);
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand('copy'); } catch (_) { }
        sel.removeAllRanges();
        document.body.removeChild(tempTextNode);
    }
});

// 全局颜色同步函数
function setFromHex(hex, exclude = null) {
    setHex(hex, 'sync')
    const { r, g, b } = hexToRgb(hex);
    rgbReadout.textContent = `RGB(${r}, ${g}, ${b})`;
    swatchR.style.background = `rgb(${r}, 0, 0)`;
    swatchG.style.background = `rgb(0, ${g}, 0)`;
    swatchB.style.background = `rgb(0, 0, ${b})`;
    if (typeof hsvWheel !== 'undefined' && exclude != 'HSV') {
        hsvWheel.setFromHex(hex);
    }
    if (typeof hslWheel !== 'undefined' && exclude != 'HSL') {
        hslWheel.setFromHex(hex);
    }
}


// Keep wheel in sync when native color changes
nativeColor.addEventListener('input', (e) => setFromHex(e.target.value));

// Removed old overlay event listeners

// 创建 HSV 色轮实例
const hsvWheel = new ColorWheel('hsv-wheel', 'HSV', hsvValueSlider, {
    hsvText: hsvHsvText,
    rgbText: hsvRgbText,
    vText: hsvVText
}, { onHexChange: setFromHex });

// 创建 HSL 色轮实例
const hslWheel = new ColorWheel('hsl-wheel', 'HSL', hslLightnessSlider, {
    hslText: hslHslText,     
    rgbText: hslRgbText,
    lText: hslLText
}, { onHexChange: setFromHex });

// 初始化轮盘
const initialHex = colorText.textContent || nativeColor.value;
hsvWheel.setFromHex(initialHex);
hslWheel.setFromHex(initialHex);

// 初始化壁纸（可配置与可禁用）
const wallpaper = initWallpaper(document.body, {
  enabled: true,
  // proxyURL: 'https://corsproxy.io/?', // 可按需替换或置空
  ttlHours: 24,
  blur: 7,
});

// Advanced picker (Pickr) reference removed for release build; see docs if needed.
