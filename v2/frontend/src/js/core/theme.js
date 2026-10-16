/**
 * theme.js — Instant Theme Execution Engine (Zero-FOUC)
 * Part of Luxottica BigQuery Training Hub Architecture.
 *
 * Runs synchronously in <head> to prevent white/dark flashes on page reload.
 * Modern Web Guidance: Zero-FOUC Early Theme Resolver (Strict Default: Light).
 */

(function() {
  try {
    const theme = localStorage.getItem('lux_theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // LocalStorage might be disabled in strict sandboxes
  }
})();
