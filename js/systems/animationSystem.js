// ===========================================
// Space Miner
// Animation System
// ===========================================
// Simple animation manager for entity properties
// Allows smooth transitions and time-based effects

import { Easing } from "../utils/easing.js";

export { Easing };

export class Animation {
    constructor(target, property, from, to, duration, easing = "linear", callback = null) {
        this.target = target;
        this.property = property;
        this.from = from;
        this.to = to;
        this.duration = duration;
        this.elapsed = 0;
        this.easing = typeof easing === "string" ? Easing[easing] : easing;
        this.callback = callback;
        this.finished = false;
    }

    update(delta) {
        if (this.finished) return false;

        this.elapsed += delta;
        const progress = Math.min(this.elapsed / this.duration, 1);
        const easedProgress = this.easing(progress);

        this.target[this.property] = this.from + (this.to - this.from) * easedProgress;

        if (progress >= 1) {
            this.finished = true;
            if (this.callback) this.callback();
            return false;
        }

        return true;
    }
}

export class AnimationSystem {
    constructor() {
        this.animations = [];
    }

    // Add a single animation
    add(target, property, from, to, duration, easing = "linear", callback = null) {
        const anim = new Animation(target, property, from, to, duration, easing, callback);
        this.animations.push(anim);
        return anim;
    }

    // Add a looping animation (returns self after duration)
    addLoop(target, property, from, to, duration, easing = "linear") {
        const loop = () => {
            this.add(target, property, to, from, duration, easing, loop);
        };
        this.add(target, property, from, to, duration, easing, loop);
    }

    // Update all active animations
    update(delta) {
        this.animations = this.animations.filter(anim => anim.update(delta));
    }

    // Clear all animations for a specific target
    clear(target) {
        this.animations = this.animations.filter(anim => anim.target !== target);
    }

    // Clear all animations
    clearAll() {
        this.animations = [];
    }
}

// Global animation system instance
export const globalAnimationSystem = new AnimationSystem();
