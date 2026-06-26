/**
 * GeoScanner Pro 9000 - Utilities Module
 * Strictly Static Web Architecture (HTML5 / CSS3 / ES6 JS)
 */

window.GeoUtils = {
  /**
   * Format depth value in meters
   */
  formatDepth(meters) {
    return `${meters.toFixed(1)} m`;
  },

  /**
   * Format timestamp for live terminal logs
   */
  getTimestamp(startTime) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
    return `[${elapsed < 10 ? '0' : ''}${elapsed}s]`;
  },

  /**
   * Generate random float within range
   */
  randomRange(min, max) {
    return min + Math.random() * (max - min);
  },

  /**
   * Promise-based delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Play simple sonic feedback beep using HTML5 AudioContext (safe fallback)
   */
  playTone(freq = 440, type = 'sine', duration = 0.1) {
    try {
      if (!window.geoAudioCtx) {
        window.geoAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = window.geoAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio sandbox restricted or unsupported
    }
  }
};
