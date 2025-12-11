import { ColorPickerComponent } from './components/colorPicker.js';
import { MonitorTestComponent } from './components/monitorTest.js';
import { initWallpaper } from './components/wallpaper.js';

const navPicker = document.getElementById('nav-picker');
const navMonitor = document.getElementById('nav-monitor');
const viewPicker = document.getElementById('view-picker');
const viewMonitor = document.getElementById('view-monitor-test');

const picker = new ColorPickerComponent('view-picker');
const monitor = new MonitorTestComponent('view-monitor-test');

function switchView(viewName) {
  if (viewName === 'picker') {
    navPicker?.classList.add('active');
    navMonitor?.classList.remove('active');
    viewPicker?.classList.add('active');
    viewMonitor?.classList.remove('active');
  } else {
    navPicker?.classList.remove('active');
    navMonitor?.classList.add('active');
    viewPicker?.classList.remove('active');
    viewMonitor?.classList.add('active');
  }
}

navPicker?.addEventListener('click', () => switchView('picker'));
navMonitor?.addEventListener('click', () => switchView('monitor'));
switchView('picker');

initWallpaper(document.body, {
  enabled: true,
  ttlHours: 24,
  blur: 7,
});
