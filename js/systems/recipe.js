// ===========================================
// Space Miner
// Recipe System
// ===========================================

/**
 * Recipe represents a production transformation
 * - Consumes input resources
 * - Produces output resources
 * - Takes a specified duration to complete
 */
export class Recipe {
    /**
     * Create a recipe
     * @param {Object} data
     *   - name: string (e.g., "Ore Smelting")
     *   - inputs: Array of {resourceType, amount}
     *   - outputs: Array of {resourceType, amount}
     *   - duration: seconds to complete one cycle
     */
    constructor(data = {}) {
        this.name = data.name || "Unknown Recipe";
        this.inputs = data.inputs || [];
        this.outputs = data.outputs || [];
        this.duration = data.duration || 1;
    }

    /**
     * Factory method to create recipe from data object
     */
    static fromData(data) {
        return new Recipe(data);
    }

    /**
     * Check if recipe can consume all required inputs
     * from an inventory
     */
    canConsume(inventory) {
        if (!inventory) return false;
        
        for (const input of this.inputs) {
            if (inventory.get(input.resourceType) < input.amount) {
                return false;
            }
        }
        return true;
    }

    /**
     * Consume all inputs from inventory
     * Returns true if successful, false if not enough resources
     */
    consumeInputs(inventory) {
        if (!this.canConsume(inventory)) return false;

        for (const input of this.inputs) {
            const removed = inventory.remove(input.resourceType, input.amount);
            if (removed < input.amount) {
                // Rollback: restore all consumed inputs
                for (const inp of this.inputs) {
                    if (inp.resourceType === input.resourceType) {
                        break; // Stop before this one
                    }
                    inventory.add(inp.resourceType, inp.amount);
                }
                return false;
            }
        }
        return true;
    }

    /**
     * Produce all outputs to inventory
     * Returns true if all outputs fit, false otherwise
     */
    produceOutputs(inventory) {
        if (!inventory) return false;

        // Check if all outputs will fit
        for (const output of this.outputs) {
            const current = inventory.get(output.resourceType);
            const space = inventory.capacity - current;
            if (space < output.amount) {
                return false; // Not enough space
            }
        }

        // All fit, produce them
        for (const output of this.outputs) {
            inventory.add(output.resourceType, output.amount);
        }
        return true;
    }
}
