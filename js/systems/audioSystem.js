// ===========================================
// Space Miner
// Audio System
// ===========================================
// Sound event system with hooks
// No actual audio loaded yet, but framework ready for future implementation

export class AudioSystem {
    constructor() {
        this.sounds = {};
        this.volume = 1.0;
        this.muted = false;
        this.enabled = false; // Set to true once audio assets are loaded
        
        // Define all game events that can trigger sounds
        this.eventHooks = {
            "build": { name: "Building placed", volume: 0.6 },
            "mine": { name: "Mining", volume: 0.4 },
            "truck.load": { name: "Truck loading cargo", volume: 0.5 },
            "truck.unload": { name: "Truck unloading", volume: 0.5 },
            "truck.move": { name: "Truck engine", volume: 0.3 },
            "upgrade": { name: "Building upgraded", volume: 0.7 },
            "resource.sell": { name: "Resource sold", volume: 0.5 },
            "research.complete": { name: "Research complete", volume: 0.8 },
            "ui.click": { name: "UI click", volume: 0.3 },
            "particle.burst": { name: "Particle effect", volume: 0.2 }
        };
    }

    // Register a sound file (to be loaded when audio is implemented)
    registerSound(eventKey, filePath) {
        this.sounds[eventKey] = {
            path: filePath,
            loaded: false,
            audio: null
        };
    }

    // Trigger a sound event
    play(eventKey, options = {}) {
        if (this.muted || !this.enabled) return;

        if (!this.eventHooks[eventKey]) {
            console.warn(`Unknown audio event: ${eventKey}`);
            return;
        }

        // Placeholder - actual audio would play here when implemented
        // Example future implementation:
        // if (this.sounds[eventKey] && this.sounds[eventKey].audio) {
        //     this.sounds[eventKey].audio.volume = (options.volume || this.eventHooks[eventKey].volume) * this.volume;
        //     this.sounds[eventKey].audio.play();
        // }
    }

    // Batch play multiple sounds (with delays)
    playSequence(events, delayMs = 100) {
        events.forEach((event, index) => {
            setTimeout(() => this.play(event), delayMs * index);
        });
    }

    // Set master volume (0 to 1)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    // Toggle mute
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // Get all registered events
    getEvents() {
        return Object.keys(this.eventHooks);
    }

    // Debug: log available sounds
    debugLog() {
        console.log("Audio System Status:");
        console.log("  Enabled:", this.enabled);
        console.log("  Muted:", this.muted);
        console.log("  Master Volume:", this.volume);
        console.log("  Event Hooks:", Object.keys(this.eventHooks).length);
    }
}

// Global audio system instance
export const globalAudioSystem = new AudioSystem();
