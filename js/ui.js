/**
 * GeoScanner Pro 9000 - UI & Canvas Renderer Module
 * Strictly Static Web Architecture (HTML5 / CSS3 / ES6 JS)
 */

window.GeoUI = {
  elements: {},
  canvasCtx: null,

  /**
   * Cache DOM elements & initialize canvas
   */
  init() {
    this.elements = {
      splashScreen: document.getElementById('splashScreen'),
      scannerScreen: document.getElementById('scannerScreen'),
      reportScreen: document.getElementById('reportScreen'),
      
      initBtn: document.getElementById('initBtn'),
      rescanBtn: document.getElementById('rescanBtn'),
      printBtn: document.getElementById('printBtn'),
      backBtn: document.getElementById('backBtn'),
      soundToggleBtns: document.querySelectorAll('.sound-toggle-btn'),
      
      canvas: document.getElementById('subsurfaceCanvas'),
      radarSweep: document.getElementById('radarSweep'),
      probeBeam: document.getElementById('probeBeam'),
      probeReadout: document.getElementById('probeReadout'),
      
      progressBarFill: document.getElementById('progressBarFill'),
      progressPercent: document.getElementById('progressPercent'),
      progressStatusText: document.getElementById('progressStatusText'),
      terminalConsole: document.getElementById('terminalConsole'),
      
      liveDensity: document.getElementById('liveDensity'),
      liveResistivity: document.getElementById('liveResistivity'),
      liveStratumName: document.getElementById('liveStratumName'),
      
      modTransducer: document.getElementById('modTransducer'),
      modDSP: document.getElementById('modDSP'),
      modTele: document.getElementById('modTele'),
      modGrav: document.getElementById('modGrav'),
      
      // Report elements
      repProfileTitle: document.getElementById('repProfileTitle'),
      repInterpretation: document.getElementById('repInterpretation'),
      repConfidence: document.getElementById('repConfidence'),
      repDepth: document.getElementById('repDepth'),
      repThickness: document.getElementById('repThickness'),
      repLithology: document.getElementById('repLithology'),
      repTableBody: document.getElementById('repTableBody'),
      repTimestamp: document.getElementById('repTimestamp'),
      repRecommendationText: document.getElementById('repRecommendationText'),
      repAdvisoryTitle: document.getElementById('repAdvisoryTitle'),
      repAdvisoryText: document.getElementById('repAdvisoryText'),
      repDrillingSpecText: document.getElementById('repDrillingSpecText'),
      repAdvisorySpecText: document.getElementById('repAdvisorySpecText'),
      splashProfileBadge: document.getElementById('splashProfileBadge'),
      profileButtons: document.querySelectorAll('.profile-btn')
    };

    if (this.elements.canvas) {
      this.canvasCtx = this.elements.canvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => {
        this.resizeCanvas();
        if (window.GeoScanner && window.GeoScanner.currentDepth) {
          this.drawStratigraphyUpTo(window.GeoScanner.currentDepth);
        }
      });
    }

    this.bindEvents();
  },

  bindEvents() {
    if (this.elements.initBtn) {
      this.elements.initBtn.addEventListener('click', () => {
        window.GeoScanner.startScanSequence();
      });
    }

    if (this.elements.rescanBtn) {
      this.elements.rescanBtn.addEventListener('click', () => {
        this.showScreen('splashScreen');
        this.setActiveProfileUI(window.GeoGeology.currentProfileId);
      });
    }

    if (this.elements.backBtn) {
      this.elements.backBtn.addEventListener('click', () => {
        this.showScreen('splashScreen');
        this.setActiveProfileUI(window.GeoGeology.currentProfileId);
      });
    }

    if (this.elements.printBtn) {
      this.elements.printBtn.addEventListener('click', () => {
        this.downloadReportPDF();
      });
    }

    if (this.elements.soundToggleBtns) {
      this.elements.soundToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          window.GeoScanner.toggleAudio();
        });
      });
    }

    // Bind profile switcher buttons
    if (this.elements.profileButtons) {
      this.elements.profileButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (window.GeoScanner && window.GeoScanner.isScanning) {
            console.log("Cannot switch profile while active scan is in progress.");
            return;
          }
          const profId = btn.getAttribute('data-profile');
          this.setActiveProfileUI(profId);
        });
      });
    }
  },

  setActiveProfileUI(profId) {
    window.GeoGeology.currentProfileId = profId;
    
    if (this.elements.profileButtons) {
      this.elements.profileButtons.forEach(b => {
        if (b.getAttribute('data-profile') === profId) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    if (this.elements.splashProfileBadge) {
      this.elements.splashProfileBadge.textContent = `SELECT SURVEY TARGET: Profile ${profId}`;
    }
  },

  showScreen(screenId) {
    const screens = ['splashScreen', 'scannerScreen', 'reportScreen'];
    screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active', 'fade-in');
        el.style.display = 'none';
      }
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.style.display = 'flex';
      void target.offsetWidth; // Trigger CSS reflow
      target.classList.add('active', 'fade-in');
      window.scrollTo(0, 0);
    }
  },

  resizeCanvas() {
    const canvas = this.elements.canvas;
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  },

  clearTerminal() {
    if (this.elements.terminalConsole) {
      this.elements.terminalConsole.innerHTML = '';
    }
  },

  appendLog(msg, type = 'normal') {
    const term = this.elements.terminalConsole;
    if (!term) return;

    const timeStr = window.GeoUtils.getTimestamp(window.GeoScanner.scanStartTime || performance.now());
    const div = document.createElement('div');
    div.className = 'log-line';
    
    let colorClass = '';
    if (type === 'info') colorClass = 'info';
    else if (type === 'warn') colorClass = 'warn';
    else if (type === 'alert') colorClass = 'alert';
    else if (type === 'success') colorClass = 'success';

    div.innerHTML = `
      <span class="log-time">${timeStr}</span>
      <span class="log-msg ${colorClass}">${msg}</span>
    `;

    term.appendChild(div);
    term.scrollTop = term.scrollHeight;
  },

  setModuleStatus(modId, status) {
    const el = this.elements[modId];
    if (!el) return;
    const tag = el.querySelector('span:last-child');
    if (tag) {
      tag.textContent = status;
    }
    if (status === 'ONLINE' || status === 'CALIBRATED' || status === 'LOCKED') {
      el.classList.add('ready');
    }
  },

  resetModuleIndicators() {
    const mods = ['modTransducer', 'modDSP', 'modTele', 'modGrav'];
    mods.forEach(m => {
      const el = this.elements[m];
      if (el) {
        el.classList.remove('ready');
        const tag = el.querySelector('span:last-child');
        if (tag) tag.textContent = 'STANDBY';
      }
    });
  },

  updateProgress(percent, statusText) {
    if (this.elements.progressBarFill) {
      this.elements.progressBarFill.style.width = `${percent}%`;
    }
    if (this.elements.progressPercent) {
      this.elements.progressPercent.textContent = `${Math.round(percent)}%`;
    }
    if (statusText && this.elements.progressStatusText) {
      this.elements.progressStatusText.textContent = statusText;
    }
  },

  updateLiveHUD(readings, depth) {
    if (this.elements.liveDensity) this.elements.liveDensity.textContent = `${readings.density} g/cm³`;
    if (this.elements.liveResistivity) this.elements.liveResistivity.textContent = `${readings.resistivityNum} Ω⋅m`;
    if (this.elements.liveStratumName) {
      this.elements.liveStratumName.textContent = readings.stratum.name;
      this.elements.liveStratumName.style.color = readings.stratum.color;
    }

    // Position probe laser beam
    const maxD = window.GeoGeology.regionMetadata.maxScanDepth;
    const yPosPercent = (depth / maxD) * 100;
    if (this.elements.probeBeam) {
      this.elements.probeBeam.style.top = `${yPosPercent}%`;
      if (readings.stratum.isObstruction) {
        this.elements.probeBeam.classList.add('anomaly');
      } else {
        this.elements.probeBeam.classList.remove('anomaly');
      }
    }
    if (this.elements.probeReadout) {
      this.elements.probeReadout.textContent = `${depth.toFixed(1)}m`;
    }
  },

  setRadarActive(active, isAnomaly = false) {
    const radar = this.elements.radarSweep;
    if (!radar) return;
    if (active) {
      radar.classList.add('active');
      if (isAnomaly) radar.classList.add('anomaly');
      else radar.classList.remove('anomaly');
    } else {
      radar.classList.remove('active', 'anomaly');
    }
  },

  /**
   * Render simulated geological stratigraphy canvas up to explored depth
   */
  drawStratigraphyUpTo(currentDepth) {
    const ctx = this.canvasCtx;
    const canvas = this.elements.canvas;
    if (!ctx || !canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const maxD = window.GeoGeology.regionMetadata.maxScanDepth;

    ctx.clearRect(0, 0, w, h);

    const depthToY = (d) => (d / maxD) * h;
    const currentY = depthToY(currentDepth);

    // Draw explored layers
    const strata = window.GeoGeology.strata;
    for (const s of strata) {
      const yStart = depthToY(s.depthStart);
      const yEnd = depthToY(s.depthEnd);

      // Only draw if current exploration has reached this stratum
      if (currentDepth > s.depthStart) {
        const effectiveYEnd = Math.min(currentY, yEnd);
        const rectH = effectiveYEnd - yStart;

        const grad = ctx.createLinearGradient(0, yStart, 0, yEnd);
        grad.addColorStop(0, s.gradStart);
        grad.addColorStop(1, s.gradEnd);
        ctx.fillStyle = grad;
        ctx.fillRect(0, yStart, w, rectH);

        // Add special hatching pattern for hard stone layer
        if (s.isObstruction && currentDepth > s.depthStart) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let x = 0; x < w; x += 30) {
            ctx.moveTo(x, yStart);
            ctx.lineTo(x + 35, effectiveYEnd);
          }
          ctx.stroke();
        }

        // Draw stratum boundary label
        if (currentDepth >= s.depthEnd) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(0, yEnd);
          ctx.lineTo(w, yEnd);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = 'rgba(5, 8, 17, 0.8)';
          ctx.font = '10px Courier New';
          const tagText = `${s.depthEnd.toFixed(1)}m - ${s.shortCode}`;
          const tagW = ctx.measureText(tagText).width;
          ctx.fillRect(8, yEnd - 16, tagW + 10, 16);
          ctx.fillStyle = s.color;
          ctx.fillText(tagText, 13, yEnd - 4);
        }
      }
    }

    // Unexplored space below current depth remains dark
    if (currentY < h) {
      ctx.fillStyle = '#03060c';
      ctx.fillRect(0, currentY, w, h - currentY);
      
      // Draw gridlines in unexplored zone
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.beginPath();
      for (let yGrid = currentY; yGrid < h; yGrid += 40) {
        ctx.moveTo(0, yGrid);
        ctx.lineTo(w, yGrid);
      }
      ctx.stroke();
    }
  },

  populateReport() {
    const prof = window.GeoGeology.activeProfile;
    
    if (this.elements.repProfileTitle) {
      this.elements.repProfileTitle.textContent = `Profile ${prof.id}`;
    }
    if (this.elements.repInterpretation) {
      this.elements.repInterpretation.textContent = prof.advisoryTitle || "Confined Aquifer Cap";
    }
    if (this.elements.repConfidence) this.elements.repConfidence.textContent = prof.confidence;
    if (this.elements.repDepth) this.elements.repDepth.textContent = `${prof.stoneStart} m`;
    if (this.elements.repThickness) this.elements.repThickness.textContent = prof.thickness;
    if (this.elements.repLithology) this.elements.repLithology.textContent = prof.lithology;
    
    const now = new Date();
    if (this.elements.repTimestamp) {
      this.elements.repTimestamp.textContent = `Survey Target: Profile ${prof.id} (${prof.name}) • Lithology: ${prof.lithology}`;
    }

    if (this.elements.repRecommendationText) {
      this.elements.repRecommendationText.textContent = prof.recommendation;
    }

    if (this.elements.repAdvisoryTitle) {
      this.elements.repAdvisoryTitle.textContent = prof.advisoryTitle;
    }

    if (this.elements.repAdvisoryText) {
      this.elements.repAdvisoryText.textContent = prof.advisoryText;
    }

    if (this.elements.repDrillingSpecText) {
      this.elements.repDrillingSpecText.textContent = prof.drillingSpec;
    }

    if (this.elements.repAdvisorySpecText) {
      this.elements.repAdvisorySpecText.textContent = prof.advisorySpec;
    }

    const tbody = this.elements.repTableBody;
    if (tbody) {
      tbody.innerHTML = prof.strata.map(s => `
        <tr class="${s.isObstruction ? 'highlight-stone' : ''}">
          <td style="font-family:var(--font-tech); font-weight:bold; color:${s.color};">
            ${s.depthStart.toFixed(1)}m – ${s.depthEnd.toFixed(1)}m
          </td>
          <td>
            <span class="layer-badge" style="background:${s.color}; color:#000;">${s.shortCode}</span>
            <strong style="margin-left:8px;">${s.name}</strong>
          </td>
          <td style="font-family:var(--font-tech);">${s.avgDensity} g/cm³</td>
          <td style="font-family:var(--font-tech);">${s.resistivity}</td>
          <td>${s.desc}</td>
        </tr>
      `).join('');
    }
  },

  downloadReportPDF() {
    const prof = window.GeoGeology ? window.GeoGeology.activeProfile : { id: 'A', name: 'Profile A' };
    const filename = `GeoScanner_Inspection_Report_Profile_${prof.id}.pdf`;
    const reportEl = document.getElementById('reportScreen');
    if (!reportEl) return;

    const origText = this.elements.printBtn ? this.elements.printBtn.innerHTML : '';
    if (this.elements.printBtn) {
      this.elements.printBtn.innerHTML = `<span class="spin-icon">↻</span> Generating PDF...`;
      this.elements.printBtn.disabled = true;
    }

    const noPrintEls = reportEl.querySelectorAll('.results-nav-bar, .report-action-buttons');
    noPrintEls.forEach(el => el.style.display = 'none');

    if (window.html2pdf) {
      const opt = {
        margin:       0.4,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0b0f19', logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      window.html2pdf().set(opt).from(reportEl).save().then(() => {
        noPrintEls.forEach(el => el.style.display = '');
        if (this.elements.printBtn) {
          this.elements.printBtn.innerHTML = origText;
          this.elements.printBtn.disabled = false;
        }
      }).catch(err => {
        console.error("html2pdf generation failed, falling back to standalone download + print:", err);
        noPrintEls.forEach(el => el.style.display = '');
        if (this.elements.printBtn) {
          this.elements.printBtn.innerHTML = origText;
          this.elements.printBtn.disabled = false;
        }
        window.print();
      });
    } else {
      // Offline mode fallback (if CDN script not loaded due to no internet):
      // Generate clean standalone HTML report file Blob download + window.print()
      const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Geological Inspection Report - Profile ${prof.id}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 2.5rem; max-width: 900px; margin: 0 auto; line-height: 1.5; }
        h1, h2, h3, h4 { color: #06b6d4; margin-top: 1.5rem; }
        .tag { background: rgba(16,185,129,0.2); color: #10b981; padding: 0.3rem 0.8rem; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 0.85rem; margin-bottom: 1rem; }
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0; }
        .stat-box { background: #111827; border: 1px solid #374151; padding: 1.25rem; border-radius: 10px; }
        .stat-label { font-size: 0.85rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-val { font-size: 1.75rem; font-weight: 800; color: #fff; margin: 0.3rem 0; }
        table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; background: #111827; }
        th, td { border: 1px solid #374151; padding: 0.75rem; text-align: left; font-size: 0.9rem; }
        th { background: #1f2937; color: #06b6d4; font-weight: 700; }
        .advisory { background: rgba(6,182,212,0.1); border: 1px solid #06b6d4; padding: 1.25rem; border-radius: 10px; margin: 1.5rem 0; }
        footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #1f2937; text-align: center; color: #6b7280; font-size: 0.8rem; }
      </style></head><body>
        <div class="tag">✓ OFFICIAL GEOLOGICAL INSPECTION REPORT</div>
        <h2>Profile ${prof.id} (${prof.name})</h2>
        <p style="color:#9ca3af;">Lithology: ${prof.lithology} &bull; Confidence Score: ${prof.confidence}</p>
        <div class="stat-grid">
          <div class="stat-box"><div class="stat-label">Stone Depth</div><div class="stat-val" style="color:#f87171;">${prof.stoneStart} m</div><div style="font-size:0.8rem;color:#9ca3af;">Top of Hard Basement Rock</div></div>
          <div class="stat-box"><div class="stat-label">Stone Thickness</div><div class="stat-val">${prof.thickness}</div><div style="font-size:0.8rem;color:#9ca3af;">Obstruction Slab Thickness</div></div>
          <div class="stat-box"><div class="stat-label">Geological Summary</div><div class="stat-val" style="font-size:1.3rem;">${prof.lithology}</div></div>
          <div class="stat-box"><div class="stat-label">Interpretation</div><div class="stat-val" style="color:#38bdf8;font-size:1.3rem;">${prof.advisoryTitle || "Confined Aquifer Cap"}</div></div>
        </div>
        <h3>📋 Layer Visualization (Subsurface Stratigraphy)</h3>
        <table>
          <thead><tr><th>Depth Interval</th><th>Horizon / Stratum</th><th>Est. Density</th><th>Resistivity</th><th>Properties</th></tr></thead>
          <tbody>` + prof.strata.map(s => `<tr><td>${s.depthStart.toFixed(1)}m – ${s.depthEnd.toFixed(1)}m</td><td><strong>${s.name}</strong> (${s.shortCode})</td><td>${s.avgDensity} g/cm³</td><td>${s.resistivity}</td><td>${s.desc}</td></tr>`).join('') + `</tbody>
        </table>
        <div class="advisory">
          <strong style="color:#06b6d4;">💡 PRIMARY RECOMMENDATION:</strong>
          <p style="margin-top:0.5rem;color:#fff;">${prof.recommendation}</p>
        </div>
        <h4>🛠️ Technical Survey Specifications</h4>
        <p><strong>Drilling Equipment:</strong> ${prof.drillingSpec}</p>
        <p><strong>Casing & Screening:</strong> ${prof.advisorySpec}</p>
        <footer>Generated offline by GeoScanner Pro 9000 &bull; Subsurface Stone Detector Prototype</footer>
      </body></html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GeoScanner_Report_Profile_${prof.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      noPrintEls.forEach(el => el.style.display = '');
      if (this.elements.printBtn) {
        this.elements.printBtn.innerHTML = origText;
        this.elements.printBtn.disabled = false;
      }
      window.print();
    }
  }
};
