// ===========================================
// Space Miner
// Easing Functions
// ===========================================
// Smooth interpolation functions for animations

export const Easing = {

    // Linear (no easing)
    linear: (t) => t,

    // Smooth in/out
    inOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    inOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 + (t - 1) * (2 * (t - 2)) * (2 * (t - 2)),

    // Sine waves for pulsing
    sine: (t) => Math.sin(t * Math.PI * 2),
    
    // Elastic
    elastic: (t) => Math.sin(t * Math.PI * 3) * Math.pow(2, -10 * t),

};
