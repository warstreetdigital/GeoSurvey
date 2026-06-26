/**
 * GeoScanner Pro 9000 - Main Application Bootstrap
 * Strictly Static Web Architecture (HTML5 / CSS3 / ES6 JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize modular subsystems
  if (window.GeoUI) {
    window.GeoUI.init();
  }
  
  // Show Splash Screen on start
  if (window.GeoUI) {
    window.GeoUI.showScreen('splashScreen');
  }

  console.log("%c[GeoScanner Pro 9000] Pure Static Instrument Booted Successfully.", "color:#06b6d4; font-weight:bold; font-size:14px;");
  console.log("Strictly offline static files. Zero build processes, zero frameworks.");
});
