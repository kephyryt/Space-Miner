// ===========================================
// Space Miner
// Production Engine
// ===========================================

/**
 * ProductionEngine manages production progress for a building
 * Handles:
 * - Recipe progress (0 to 1)
 * - Resource consumption when recipe starts
 * - Resource production when recipe completes
 * - Fractional accumulation (production *= delta)
 */
export class ProductionEngine {
    /**
     * Create production engine for a building
     * @param {Recipe} recipe - Production recipe
     * @param {Building} building - Building that uses this recipe
     */
    constructor(recipe, building) {
        this.recipe = recipe;
        this.building = building;
        
        // Progress from 0 to 1 (represents completion of current cycle)
        this.progress = 0;
        
        // Whether resources have been consumed for current cycle
        this.inputsConsumed = false;
    }

    /**
     * Update production progress
     * @param {number} delta - Time elapsed in seconds
     * @returns {boolean} true if recipe completed this frame
     */
    update(delta) {
        if (!this.building || !this.building.inventory) {
            return false;
        }

        // Can't start if inputs can't be consumed
        if (this.progress === 0 && !this.inputsConsumed) {
            if (!this.recipe.canConsume(this.building.inventory)) {
                return false;
            }
        }

        // Consume inputs at start of cycle
        if (this.progress === 0 && !this.inputsConsumed) {
            if (!this.recipe.consumeInputs(this.building.inventory)) {
                return false;
            }
            this.inputsConsumed = true;
        }

        // Advance progress based on delta and recipe duration
        const progressDelta = (delta / this.recipe.duration);
        this.progress += progressDelta;

        // Recipe completed!
        if (this.progress >= 1.0) {
            const completed = this.progress >= 1.0;

            if (completed) {
                // Try to produce outputs
                if (this.recipe.produceOutputs(this.building.inventory)) {
                    // Successfully produced - reset for next cycle
                    this.progress = 0;
                    this.inputsConsumed = false;
                    return true;
                } else {
                    // Can't produce (inventory full) - pause progress
                    this.progress = 1.0;
                    return false;
                }
            }
        }

        return false;
    }

    /**
     * Get current progress as percentage (0 to 100)
     */
    getProgressPercent() {
        return Math.min(100, this.progress * 100);
    }

    /**
     * Reset production state (used when switching recipes or resetting)
     */
    reset() {
        this.progress = 0;
        this.inputsConsumed = false;
    }

    /**
     * Serialize for save/load
     */
    serialize() {
        return {
            progress: this.progress,
            inputsConsumed: this.inputsConsumed
        };
    }

    /**
     * Deserialize from saved state
     */
    static deserialize(data, recipe, building) {
        const engine = new ProductionEngine(recipe, building);
        engine.progress = data.progress || 0;
        engine.inputsConsumed = data.inputsConsumed || false;
        return engine;
    }
}
