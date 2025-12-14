
import { ColorPickerComponent } from './components/colorPicker.js';
import { MonitorTestComponent } from './components/monitorTest.js';
import { initWallpaper } from './components/wallpaper.js';

const navPicker = document.getElementById('nav-picker');
const navMonitor = document.getElementById('nav-monitor');
const viewPicker = document.getElementById('view-picker');
const viewMonitor = document.getElementById('view-monitor-test');
const transitionShell = document.getElementById('view-transition-shell');
const navIndicator = document.querySelector('.nav-indicator');
const navContainer = document.querySelector('.main-nav');

const picker = new ColorPickerComponent('view-picker');
const monitor = new MonitorTestComponent('view-monitor-test');

const views = {
  picker: viewPicker,
  monitor: viewMonitor,
};
const navButtons = {
  picker: navPicker,
  monitor: navMonitor,
};

// Parse animation duration from CSS variable
const VIEW_ANIM_MS = (() => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--anim-duration-normal') || '0.38s';
  const num = parseFloat(raw);
  return raw.trim().endsWith('ms') ? num : num * 1000;
})();

let activeView = 'picker';
let isTransitioning = false;
let transitionTimer = null;

/**
 * Calculate the bounding box that encompasses all panels in a view
 * Used primarily for positioning (top)
 */
function getViewBoundingBox(viewEl) {
  const panels = viewEl.querySelectorAll('.panel');
  if (!panels.length) return { top: 0, height: 0 };
  
  const mainEl = document.querySelector('main');
  const mainRect = mainEl.getBoundingClientRect();
  
  let minTop = Infinity;
  let maxBottom = -Infinity;
  
  panels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    // Calculate relative to main container
    const relativeTop = rect.top - mainRect.top;
    const relativeBottom = rect.bottom - mainRect.top;
    minTop = Math.min(minTop, relativeTop);
    maxBottom = Math.max(maxBottom, relativeBottom);
  });
  
  return {
    top: minTop,
    height: maxBottom - minTop
  };
}

/**
 * Calculates the final expected height of a view when fully expanded.
 * Sums up panel heights, their individual margins, and the flex-container gaps.
 */
function getExpandedHeight(viewEl) {
  const panels = viewEl.querySelectorAll('.panel');
  if (!panels.length) return 0;

  let totalHeight = 0;
  
  panels.forEach(panel => {
    // 1. Element Layout Height (Border + Padding + Content)
    totalHeight += panel.offsetHeight;

    // 2. Individual Panel Margins (e.g. .wheel-section has margin-top: 16px)
    // Note: In a flex column, margins do not collapse; they add to the space.
    // We read computed styles to catch any class-specific margins.
    const style = getComputedStyle(panel);
    const marginTop = parseFloat(style.marginTop) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    totalHeight += marginTop + marginBottom;
  });

  // 3. Flex Container Gaps (16px)
  // We hardcode 16 here to match CSS --stack-gap.
  const GAP_SIZE = 16;
  const totalGaps = Math.max(0, panels.length - 1) * GAP_SIZE;

  return totalHeight + totalGaps;
}

/**
 * Show the unified transition shell with smooth animation
 */
function showTransitionShell(leavingView) {
  if (!transitionShell) return;
  
  const bbox = getViewBoundingBox(leavingView);
  
  // Set initial size to match current view's panels
  transitionShell.style.top = `${Math.round(bbox.top)}px`;
  transitionShell.style.height = `${Math.max(0, Math.round(bbox.height))}px`;
  
  // Trigger display and animate in
  transitionShell.style.display = 'block';
  requestAnimationFrame(() => {
    transitionShell.classList.add('is-active');
    document.body.classList.add('view-transitioning');
  });
}

/**
 * Hide the transition shell with animation
 */
function hideTransitionShell() {
  if (!transitionShell) return;
  
  transitionShell.classList.remove('is-active');
  document.body.classList.remove('view-transitioning');
  
  // Hide after animation completes
  setTimeout(() => {
    if (!transitionShell.classList.contains('is-active')) {
      transitionShell.style.display = 'none';
    }
  }, VIEW_ANIM_MS);
}

function setViewGap(viewName, gap) {
  const view = views[viewName];
  if (!view || gap === undefined) return;
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;
  view.style.setProperty('--stack-gap', gapValue);
}

function setViewCollapsedGap(viewName, gap) {
  const view = views[viewName];
  if (!view || gap === undefined) return;
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;
  view.style.setProperty('--stack-gap-collapsed', gapValue);
}

function updateNavIndicator(targetView = activeView) {
  if (!navIndicator || !navContainer) return;
  const btn = navButtons[targetView];
  if (!btn) return;
  const navRect = navContainer.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const width = btnRect.width;
  const offset = btnRect.left - navRect.left;
  navIndicator.style.width = `${width}px`;
  navIndicator.style.transform = `translateX(${offset}px)`;
}

function setActiveNav(viewName) {
  Object.entries(navButtons).forEach(([name, btn]) => {
    if (!btn) return;
    btn.classList.toggle('active', name === viewName);
  });
  updateNavIndicator(viewName);
}

/**
 * Main view switching function with smooth panel merge/unmerge animation
 */
function switchView(target) {
  if (target === activeView || isTransitioning) return;
  
  const leaving = views[activeView];
  const entering = views[target];
  if (!entering || !leaving) return;
  
  isTransitioning = true;
  
  // Clear any pending transition
  if (transitionTimer) {
    clearTimeout(transitionTimer);
    transitionTimer = null;
  }
  
  // Scroll to top smoothly before transition to ensure all panels are visible
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Small delay to let scroll start
  const scrollDelay = window.scrollY > 100 ? 150 : 0;
  
  setTimeout(() => {
    // Phase 1: Show shell and start leaving animation
    showTransitionShell(leaving);
    leaving.classList.add('is-leaving');
    
    // Phase 2: After a short delay, prepare entering view
    setTimeout(() => {
      // Prepare entering view
      entering.classList.remove('hidden');
      entering.classList.add('is-entering');
      
      // Calculate the TRUE final height (summing heights + margins + gaps)
      const trueHeight = getExpandedHeight(entering);
      
      if (transitionShell) {
        transitionShell.style.height = `${trueHeight}px`;
        // Keep 'top' anchored to the leaving view's position to prevent jumping
      }
      
      // Phase 3: Start entering animation
      requestAnimationFrame(() => {
        entering.classList.remove('is-entering');
        
        // Hide leaving view
        leaving.classList.remove('is-leaving');
        leaving.classList.add('hidden');
      });
    }, VIEW_ANIM_MS * 0.4);
    
    // Phase 4: Cleanup
    transitionTimer = setTimeout(() => {
      hideTransitionShell();
      isTransitioning = false;
    }, VIEW_ANIM_MS * 1.2);
  }, scrollDelay);
  
  activeView = target;
  setActiveNav(target);
}

navPicker?.addEventListener('click', () => switchView('picker'));
navMonitor?.addEventListener('click', () => switchView('monitor'));

// Initial state
viewMonitor?.classList.add('hidden');
viewPicker?.classList.remove('hidden');
setActiveNav(activeView);
requestAnimationFrame(() => updateNavIndicator(activeView));
window.addEventListener('resize', () => updateNavIndicator(activeView));

// Expose spacing controls
window.viewSpacing = {
  setGap: setViewGap,
  setCollapsedGap: setViewCollapsedGap,
};

initWallpaper(document.body, {
  enabled: true,
  ttlHours: 24,
  blur: 7,
});
