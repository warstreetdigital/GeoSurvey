/**
 * GeoScanner Pro 9000 - Scanner Engine Module
 * Strictly Static Web Architecture (HTML5 / CSS3 / ES6 JS)
 * Orchestrates the realistic multi-profile instrument scan sequence
 */

window.GeoScanner = {
  isScanning: false,
  currentDepth: 0.0,
  scanStartTime: 0,
  audioEnabled: true,

  /**
   * Start the full simulation scan sequence
   */
  async startScanSequence() {
    if (this.isScanning) return;
    this.isScanning = true;
    this.currentDepth = 0.0;
    this.scanStartTime = performance.now();

    const ui = window.GeoUI;
    const vib = window.GeoVibration;
    const utils = window.GeoUtils;
    const prof = window.GeoGeology.activeProfile;
    const stoneStart = prof.stoneStart;
    const stoneEnd = prof.stoneEnd;

    // Switch to Scanner View
    ui.showScreen('scannerScreen');
    ui.clearTerminal();
    ui.resetModuleIndicators();
    ui.updateProgress(0, "Initializing Scanner...");
    ui.drawStratigraphyUpTo(0);
    
    vib.onInit();
    if (this.audioEnabled) utils.playTone(520, 'sine', 0.15);

    // Step 1: Initializing Scanner...
    ui.appendLog("Initializing Scanner...", "info");
    ui.updateProgress(5, "Initializing Scanner...");
    await utils.sleep(700);

    // Step 2: Loading Detection Engine...
    ui.appendLog("Loading Detection Engine...", "normal");
    ui.setModuleStatus('modTransducer', 'ONLINE');
    ui.updateProgress(15, "Loading Detection Engine...");
    if (this.audioEnabled) utils.playTone(660, 'sine', 0.1);
    await utils.sleep(800);

    // Step 3: Calibrating...
    ui.appendLog("Calibrating...", "normal");
    ui.setModuleStatus('modDSP', 'ONLINE');
    ui.updateProgress(28, "Calibrating...");
    await utils.sleep(700);

    // Step 4: Virtual Sensor Stability
    ui.appendLog("Virtual Sensor Channels Locked (Signal Ratio: 99.8%)...", "success");
    ui.setModuleStatus('modTele', 'LOCKED');
    ui.updateProgress(38, "Calibrating...");
    await utils.sleep(750);

    // Step 5: Ground Density Analysis...
    ui.appendLog("Ground Density Analysis...", "normal");
    ui.setModuleStatus('modGrav', 'CALIBRATED');
    ui.updateProgress(48, "Ground Density Analysis...");
    if (this.audioEnabled) utils.playTone(880, 'triangle', 0.15);
    await utils.sleep(850);

    // Step 6: Commence Active Scan
    ui.appendLog(`Scanning Underground (${prof.name})...`, "info");
    ui.setRadarActive(true, false);
    
    // Animate downward scanning loop to top of stone formation
    await this.runDownwardDrillLoop(0.0, stoneStart, 0.12, 48, 78, "Scanning Underground...");

    // Step 7: Detecting High Density Layer...
    ui.appendLog(`⚠️ Detecting High Density Layer at ${stoneStart.toFixed(1)}m`, "warn");
    ui.setRadarActive(true, true); // Red anomaly sweep
    vib.onStoneDetect();
    if (this.audioEnabled) utils.playTone(220, 'sawtooth', 0.45);
    ui.updateProgress(80, "Detecting High Density Layer...");
    await utils.sleep(1050);

    // Step 8: Analysing Stone Layer...
    ui.appendLog("Analysing Stone Layer...", "warn");
    await this.runDownwardDrillLoop(stoneStart, stoneEnd, 0.04, 80, 92, "Analysing Stone Layer...");

    // Step 9: Verifying Results
    ui.appendLog("Verifying Results...", "alert");
    if (this.audioEnabled) utils.playTone(440, 'square', 0.3);
    await utils.sleep(800);

    ui.setRadarActive(true, false);
    await this.runDownwardDrillLoop(stoneEnd, 15.0, 0.15, 92, 100, "Verifying Results...");

    // Step 10: Generating Geological Report...
    ui.setRadarActive(false);
    ui.updateProgress(100, "Generating Geological Report...");
    ui.appendLog("Generating Geological Report...", "success");
    vib.onComplete();
    if (this.audioEnabled) {
      utils.playTone(784, 'sine', 0.12);
      setTimeout(() => utils.playTone(1046, 'sine', 0.25), 150);
    }
    await utils.sleep(1350);

    // Transition to Report Screen
    this.isScanning = false;
    ui.populateReport();
    ui.showScreen('reportScreen');
  },

  /**
   * Helper loop to simulate downward penetration animation
   */
  async runDownwardDrillLoop(startM, endM, stepM, startPct, endPct, statusMsg) {
    const ui = window.GeoUI;
    const vib = window.GeoVibration;
    const utils = window.GeoUtils;
    
    let current = startM;
    const totalDist = endM - startM;

    while (current < endM && this.isScanning) {
      current += stepM;
      if (current > endM) current = endM;
      this.currentDepth = current;

      const progressRatio = (current - startM) / totalDist;
      const curPct = startPct + progressRatio * (endPct - startPct);

      ui.updateProgress(curPct, statusMsg);
      
      const readings = window.GeoGeology.generateLiveReadings(current);
      ui.updateLiveHUD(readings, current);
      ui.drawStratigraphyUpTo(current);

      // Subtle haptic tick every half meter
      if (Math.round(current * 10) % 5 === 0) {
        vib.onScanTick();
      }

      await utils.sleep(30);
    }
  },

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    const btns = document.querySelectorAll('.sound-toggle-btn');
    btns.forEach(btn => {
      btn.innerHTML = this.audioEnabled ? 
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Sonic Audio: ON` :
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Sonic Audio: MUTED`;
      btn.style.borderColor = this.audioEnabled ? 'var(--emerald-safe)' : 'var(--border-subtle)';
      btn.style.color = this.audioEnabled ? 'var(--emerald-safe)' : 'var(--text-secondary)';
    });
  }
};
