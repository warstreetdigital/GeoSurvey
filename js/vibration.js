/**
 * GeoScanner Pro 9000 - Haptic Vibration Module
 * Strictly Static Web Architecture (HTML5 / CSS3 / ES6 JS)
 */

window.GeoVibration = {
  /**
   * Check if device supports navigator.vibrate
   */
  isSupported() {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  },

  /**
   * Safe execution wrapper for navigator.vibrate
   */
  vibrate(pattern) {
    if (this.isSupported()) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Silently catch permission or browser policy blocks
      }
    }
  },

  /**
   * Instrument initialization buzz
   */
  onInit() {
    this.vibrate([100, 50, 100]);
  },

  /**
   * Gentle tick during downward scanning
   */
  onScanTick() {
    this.vibrate(12);
  },

  /**
   * Intense vibration when hitting hard stone layer
   */
  onStoneDetect() {
    this.vibrate([200, 100, 200, 100, 450]);
  },

  /**
   * Scan completion & report readiness pulse
   */
  onComplete() {
    this.vibrate([120, 60, 120, 60, 300]);
  }
};
