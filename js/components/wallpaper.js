// Lightweight wallpaper component for Bing daily image (optional)
// Usage:
//   import { initWallpaper } from './components/wallpaper.js'
//   const wp = initWallpaper(document.body, { enabled: true })
//   wp.setEnabled(false); wp.refresh();

const DEFAULTS = {
  enabled: true,
  source: 'bing', // or { url: 'https://...' }
  proxyURL: 'https://corsproxy.io/?',
  ttlHours: 24,
  overlay:
    'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.72) 20%, rgba(0,0,0,0.72) 80%, rgba(0,0,0,0.7) 100%)',
  blur: 7,
  storageKey: 'colorAnalyser.wallpaper.cache',
};

function now() { return Date.now(); }
function hours(ms) { return ms / 36e5; }

async function fetchBingUrl(proxyURL) {
  const endpoint = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US&uhd=1';
  const url = proxyURL ? proxyURL + encodeURIComponent(endpoint) : endpoint;
  const res = await fetch(url);
  const data = await res.json();
  return 'https://www.bing.com' + data.images[0].url;
}

function applyStyles(target, overlay, blur) {
  // background image is applied inline; overlay via body::before is in CSS already.
  target.style.backgroundSize = 'cover';
  target.style.backgroundPosition = 'center';
  target.style.backgroundAttachment = 'fixed';
  // Allow overriding the ::before overlay via CSS var if desired
  target.style.setProperty('--wallpaper-overlay', overlay);
  target.style.setProperty('--wallpaper-blur', String(blur));
}

function readCache(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
function writeCache(key, payload) {
  try { localStorage.setItem(key, JSON.stringify(payload)); } catch {}
}

export function initWallpaper(target = document.body, options = {}) {
  const opts = { ...DEFAULTS, ...options };
  let enabled = !!opts.enabled;
  let currentUrl = null;

  applyStyles(target, opts.overlay, opts.blur);

  async function setFromUrl(url) {
    if (!url) return;
    // Preload image to avoid flashes
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    currentUrl = url;
    if (enabled) target.style.backgroundImage = `url(${url})`;
  }

  async function refresh() {
    try {
      let url;
      if (opts.source === 'bing') {
        url = await fetchBingUrl(opts.proxyURL);
      } else if (opts.source && typeof opts.source === 'object' && opts.source.url) {
        url = opts.source.url;
      }
      if (url) {
        await setFromUrl(url);
        writeCache(opts.storageKey, { url, ts: now() });
      }
    } catch (err) {
      console.warn('Wallpaper refresh failed:', err);
    }
  }

  async function bootstrap() {
    if (!enabled) return;
    const cache = readCache(opts.storageKey);
    if (cache && cache.url && hours(now() - cache.ts) < opts.ttlHours) {
      setFromUrl(cache.url);
    } else {
      await refresh();
    }
  }

  function setEnabled(next) {
    enabled = !!next;
    if (!enabled) {
      target.style.backgroundImage = '';
    } else if (currentUrl) {
      target.style.backgroundImage = `url(${currentUrl})`;
    } else {
      bootstrap();
    }
  }

  function setOptions(patch) {
    Object.assign(opts, patch || {});
    applyStyles(target, opts.overlay, opts.blur);
  }

  function destroy() {
    target.style.backgroundImage = '';
  }

  // auto start
  bootstrap();

  return { setEnabled, setOptions, refresh, destroy };
}

