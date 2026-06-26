/**
 * GeoScanner Pro 9000 - Geological Stratigraphy Module
 * Strictly Static Web Architecture (HTML5 / CSS3 / ES6 JS)
 * Multi-Profile Geological Models (Profile A, Profile B, Profile C)
 */

window.GeoGeology = {
  currentProfileId: "A",

  regionMetadata: {
    location: "Subsurface Geophysical Survey Benchmark",
    surveyMethod: "Multi-Channel Geoelectric & Acoustic Impedance Radar",
    instrumentElevation: "Standard Elevation Datum",
    maxScanDepth: 15.0 // meters
  },

  profiles: {
    A: {
      id: "A",
      name: "Profile A",
      stoneStart: 9.0,
      stoneEnd: 12.0,
      thickness: "3.0 m",
      confidence: "High (98.7% Signal Clarity)",
      lithology: "Crystalline Granitic Gneiss",
      recommendation: "Hard rock layer detected. Continue below the rock layer to investigate deeper formations.",
      advisoryTitle: "Thick Basement Rock Cap (9.0m - 12.0m)",
      advisoryText: "Profile A indicates a robust 3.0-metre hard basement rock formation starting at 9.0 metres. Standard manual augers stall upon striking this stratum. Penetrating this dense roof is essential to reach the underlying confined aquifer structure.",
      drillingSpec: "Heavy Pneumatic Rotary DTH Hammer with tungsten carbide button bits required to penetrate the 3.0m hard rock formation.",
      advisorySpec: "Install solid protective steel casing from surface (0.0m) down to 9.0m and grout into the rock collar to prevent upper moisture seepage.",
      strata: [
        {
          id: "topsoil", depthStart: 0.0, depthEnd: 2.0, name: "Topsoil", shortCode: "TOPSOIL", color: "#854d0e", gradStart: "#92400e", gradEnd: "#78350f", avgDensity: 1.45, resistivity: "140 Ω⋅m", velocity: "450 m/s", desc: "Loose unconsolidated surface soil layer. High surface permeability."
        },
        {
          id: "w_soil", depthStart: 2.0, depthEnd: 6.0, name: "Weathered soil", shortCode: "W_SOIL", color: "#a855f7", gradStart: "#9333ea", gradEnd: "#64748b", avgDensity: 1.88, resistivity: "65 Ω⋅m", velocity: "880 m/s", desc: "Decomposed mineral clay matrix. Acts as a low-yield moisture zone."
        },
        {
          id: "w_rock", depthStart: 6.0, depthEnd: 9.0, name: "Weathered rock", shortCode: "W_ROCK", color: "#475569", gradStart: "#64748b", gradEnd: "#334155", avgDensity: 2.25, resistivity: "420 Ω⋅m", velocity: "1,850 m/s", desc: "Transition horizon. Semi-consolidated gravel and fractured rock."
        },
        {
          id: "stone_cap", depthStart: 9.0, depthEnd: 12.0, name: "Hard basement rock", shortCode: "HARD_ROCK", color: "#ef4444", gradStart: "#dc2626", gradEnd: "#991b1b", avgDensity: 2.88, resistivity: "3,450 Ω⋅m", velocity: "5,600 m/s", isObstruction: true, desc: "🚨 PRIMARY OBSTRUCTION: High-density unweathered crystalline basement rock (3.0m thick)."
        },
        {
          id: "aquifer", depthStart: 12.0, depthEnd: 15.0, name: "Sub-Stone Confined Formation", shortCode: "DEEP_ZONE", color: "#3b82f6", gradStart: "#2563eb", gradEnd: "#0e7490", avgDensity: 2.42, resistivity: "190 Ω⋅m", velocity: "3,400 m/s", isWater: true, desc: "💦 TARGET FORMATION: Permeable fissured basement rock zone below 12.0m."
        }
      ]
    },

    B: {
      id: "B",
      name: "Profile B",
      stoneStart: 9.2,
      stoneEnd: 10.6,
      thickness: "1.4 m",
      confidence: "High (98.9% Signal Clarity)",
      lithology: "Granodiorite Basement Rock",
      recommendation: "A thinner hard rock layer has been identified compared to Profile A. Continue exploration below the rock layer to assess deeper formations.",
      advisoryTitle: "Thinner Basement Rock Cap (9.2m - 10.6m)",
      advisoryText: "Profile B reveals a relatively narrow 1.4-metre hard rock slab beginning at 9.2 metres. Hammering duration through this obstruction is significantly reduced compared to Profile A before encountering deeper formations.",
      drillingSpec: "Pneumatic DTH Rock Hammer required to grind through the 1.4m hard rock obstruction between 9.2m and 10.6m.",
      advisorySpec: "Secure upper unconsolidated soil by installing casing from surface down to 9.2m. Place factory slotted screens below 10.6m.",
      strata: [
        {
          id: "topsoil", depthStart: 0.0, depthEnd: 2.2, name: "Topsoil", shortCode: "TOPSOIL", color: "#854d0e", gradStart: "#92400e", gradEnd: "#78350f", avgDensity: 1.42, resistivity: "135 Ω⋅m", velocity: "440 m/s", desc: "Surface organic loam with fine particulates."
        },
        {
          id: "w_soil", depthStart: 2.2, depthEnd: 6.4, name: "Weathered soil", shortCode: "W_SOIL", color: "#a855f7", gradStart: "#9333ea", gradEnd: "#64748b", avgDensity: 1.85, resistivity: "70 Ω⋅m", velocity: "860 m/s", desc: "Weathered clay and soil horizon."
        },
        {
          id: "w_rock", depthStart: 6.4, depthEnd: 9.2, name: "Weathered rock", shortCode: "W_ROCK", color: "#475569", gradStart: "#64748b", gradEnd: "#334155", avgDensity: 2.20, resistivity: "410 Ω⋅m", velocity: "1,800 m/s", desc: "Fractured weathered stone transition horizon."
        },
        {
          id: "stone_cap", depthStart: 9.2, depthEnd: 10.6, name: "Hard basement rock", shortCode: "HARD_ROCK", color: "#ef4444", gradStart: "#dc2626", gradEnd: "#991b1b", avgDensity: 2.85, resistivity: "3,300 Ω⋅m", velocity: "5,500 m/s", isObstruction: true, desc: "🚨 PRIMARY OBSTRUCTION: Dense basement rock slab measuring 1.4 metres thick."
        },
        {
          id: "aquifer", depthStart: 10.6, depthEnd: 15.0, name: "Sub-Stone Confined Formation", shortCode: "DEEP_ZONE", color: "#3b82f6", gradStart: "#2563eb", gradEnd: "#0e7490", avgDensity: 2.40, resistivity: "185 Ω⋅m", velocity: "3,350 m/s", isWater: true, desc: "💦 TARGET FORMATION: Extensive permeable zone below 10.6m."
        }
      ]
    },

    C: {
      id: "C",
      name: "Profile C",
      stoneStart: 7.5,
      stoneEnd: 10.0,
      thickness: "2.5 m",
      confidence: "High (99.1% Signal Clarity)",
      lithology: "Crystalline Basement Gneiss",
      recommendation: "Intermediate hard rock formation encountered at shallower depth interval. Continue drilling penetration past 10.0 metres to reach potential water-bearing fissure zone.",
      advisoryTitle: "Shallower Basement Rock Cap (7.5m - 10.0m)",
      advisoryText: "Profile C demonstrates a shallower unweathered hard rock obstruction starting at 7.5 metres and terminating at 10.0 metres (2.5m thickness). Overburden depth is reduced compared to Profiles A and B.",
      drillingSpec: "Pneumatic DTH Rock Hammer required starting at 7.5 metres depth to penetrate the 2.5m crystalline hard rock formation.",
      advisorySpec: "Install casing from surface (0.0m) to 7.5m to secure upper weathered horizons. Install slotted screening from 10.0m to 15.0m.",
      strata: [
        {
          id: "topsoil", depthStart: 0.0, depthEnd: 1.8, name: "Topsoil", shortCode: "TOPSOIL", color: "#854d0e", gradStart: "#92400e", gradEnd: "#78350f", avgDensity: 1.48, resistivity: "145 Ω⋅m", velocity: "460 m/s", desc: "Compact dry surface soil horizon."
        },
        {
          id: "w_soil", depthStart: 1.8, depthEnd: 4.8, name: "Weathered soil", shortCode: "W_SOIL", color: "#a855f7", gradStart: "#9333ea", gradEnd: "#64748b", avgDensity: 1.90, resistivity: "60 Ω⋅m", velocity: "900 m/s", desc: "Weathered clay and mineral matrix."
        },
        {
          id: "w_rock", depthStart: 4.8, depthEnd: 7.5, name: "Weathered rock", shortCode: "W_ROCK", color: "#475569", gradStart: "#64748b", gradEnd: "#334155", avgDensity: 2.28, resistivity: "430 Ω⋅m", velocity: "1,900 m/s", desc: "Fragmented rock and gravel transition zone."
        },
        {
          id: "stone_cap", depthStart: 7.5, depthEnd: 10.0, name: "Hard basement rock", shortCode: "HARD_ROCK", color: "#ef4444", gradStart: "#dc2626", gradEnd: "#991b1b", avgDensity: 2.92, resistivity: "3,600 Ω⋅m", velocity: "5,700 m/s", isObstruction: true, desc: "🚨 PRIMARY OBSTRUCTION: Dense unweathered crystalline rock beginning at 7.5m."
        },
        {
          id: "aquifer", depthStart: 10.0, depthEnd: 15.0, name: "Sub-Stone Confined Formation", shortCode: "DEEP_ZONE", color: "#3b82f6", gradStart: "#2563eb", gradEnd: "#0e7490", avgDensity: 2.44, resistivity: "195 Ω⋅m", velocity: "3,450 m/s", isWater: true, desc: "💦 TARGET FORMATION: Deep permeable fractured formation below 10.0m."
        }
      ]
    }
  },

  /**
   * Get active profile object
   */
  get activeProfile() {
    return this.profiles[this.currentProfileId] || this.profiles.A;
  },

  /**
   * Get active strata array
   */
  get strata() {
    return this.activeProfile.strata;
  },

  /**
   * Retrieve active stratum object for a specific depth
   */
  getStratumAtDepth(depth) {
    const activeStrata = this.strata;
    for (const s of activeStrata) {
      if (depth >= s.depthStart && depth <= s.depthEnd) {
        return s;
      }
    }
    return activeStrata[activeStrata.length - 1];
  },

  /**
   * Generate simulated telemetry readout for current probe depth
   */
  generateLiveReadings(depth) {
    const s = this.getStratumAtDepth(depth);
    const jitter = window.GeoUtils.randomRange(-0.04, 0.04);
    
    let resNum = 140;
    if (s.id === 'topsoil') resNum = 140 + Math.sin(depth) * 12;
    else if (s.id === 'w_soil') resNum = 65 + Math.cos(depth) * 8;
    else if (s.id === 'w_rock') resNum = 420 + Math.sin(depth) * 35;
    else if (s.id === 'stone_cap') resNum = 3450 + window.GeoUtils.randomRange(-80, 120);
    else if (s.id === 'aquifer') resNum = 190 + Math.cos(depth) * 15;

    return {
      stratum: s,
      density: (s.avgDensity + jitter).toFixed(2),
      resistivityNum: Math.round(resNum),
      velocity: s.velocity
    };
  }
};
