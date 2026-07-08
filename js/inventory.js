// ===========================================
// Space Miner
// Inventory System
// ===========================================
// Modular inventory system supporting multiple resource types with capacity limits.
// Generic enough to support Iron Ore, Copper Ore, Plates, Components, Fuel, etc.

export class Inventory {
    /**
     * Create a new Inventory
     * @param {number} capacity - Maximum total items this inventory can hold
     * @param {Array<string>} acceptedResources - List of resource types this inventory accepts (empty = accepts all)
     */
    constructor(capacity = 1000, acceptedResources = []) {
        this.capacity = capacity;
        this.items = new Map(); // Resource type -> amount
        this.acceptedResources = acceptedResources; // Empty array means accepts all resources
    }

    /**
     * Check if a resource type is accepted
     * @param {string} resourceType - Type of resource (e.g., "ore", "plate", "component")
     * @returns {boolean}
     */
    acceptsResource(resourceType) {
        if (this.acceptedResources.length === 0) return true; // Accepts all if list is empty
        return this.acceptedResources.includes(resourceType);
    }

    /**
     * Get current amount of a resource
     * @param {string} resourceType - Type of resource
     * @returns {number}
     */
    get(resourceType) {
        return this.items.get(resourceType) || 0;
    }

    /**
     * Get total items in inventory
     * @returns {number}
     */
    getTotal() {
        let total = 0;
        for (const amount of this.items.values()) {
            total += amount;
        }
        return total;
    }

    /**
     * Get available capacity
     * @returns {number}
     */
    getAvailable() {
        return Math.max(0, this.capacity - this.getTotal());
    }

    /**
     * Check if inventory has space
     * @returns {boolean}
     */
    hasSpace() {
        return this.getTotal() < this.capacity;
    }

    /**
     * Try to add items to inventory
     * @param {string} resourceType - Type of resource
     * @param {number} amount - Amount to add
     * @returns {number} - Actual amount added (may be less than requested due to capacity)
     */
    add(resourceType, amount) {
        if (!Number.isFinite(amount) || amount <= 0) return 0;
        if (!this.acceptsResource(resourceType)) return 0;

        const available = this.getAvailable();
        const toAdd = Math.min(amount, available);

        if (toAdd > 0) {
            const current = this.items.get(resourceType) || 0;
            this.items.set(resourceType, current + toAdd);
        }

        return toAdd;
    }

    /**
     * Try to remove items from inventory
     * @param {string} resourceType - Type of resource
     * @param {number} amount - Amount to remove
     * @returns {number} - Actual amount removed
     */
    remove(resourceType, amount) {
        if (!Number.isFinite(amount) || amount <= 0) return 0;

        const current = this.items.get(resourceType) || 0;
        const toRemove = Math.min(amount, current);

        if (toRemove > 0) {
            this.items.set(resourceType, current - toRemove);
            if (this.items.get(resourceType) === 0) {
                this.items.delete(resourceType);
            }
        }

        return toRemove;
    }

    /**
     * Transfer items from one inventory to another
     * @param {Inventory} targetInventory - Destination inventory
     * @param {string} resourceType - Type of resource to transfer
     * @param {number} amount - Amount to transfer
     * @returns {number} - Actual amount transferred
     */
    transferTo(targetInventory, resourceType, amount) {
        const removed = this.remove(resourceType, amount);
        const added = targetInventory.add(resourceType, removed);

        // If target couldn't accept all, put back what wasn't added
        if (added < removed) {
            this.add(resourceType, removed - added);
        }

        return added;
    }

    /**
     * Get list of all resources currently in inventory
     * @returns {Array<{type: string, amount: number}>}
     */
    getContents() {
        const contents = [];
        for (const [type, amount] of this.items.entries()) {
            if (amount > 0) {
                contents.push({ type, amount });
            }
        }
        return contents;
    }

    /**
     * Get fill percentage (0 to 1)
     * @returns {number}
     */
    getFillPercentage() {
        return this.getTotal() / this.capacity;
    }

    /**
     * Check if inventory is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.getTotal() === 0;
    }

    /**
     * Check if inventory is full
     * @returns {boolean}
     */
    isFull() {
        return this.getTotal() >= this.capacity;
    }

    /**
     * Clear all items from inventory
     */
    clear() {
        this.items.clear();
    }

    /**
     * Get state for saving/serialization
     * @returns {Object}
     */
    serialize() {
        return {
            capacity: this.capacity,
            items: Array.from(this.items.entries()),
            acceptedResources: this.acceptedResources
        };
    }

    /**
     * Restore state from saved data
     * @param {Object} data - Serialized inventory data
     * @static
     * @returns {Inventory}
     */
    static deserialize(data) {
        const inv = new Inventory(data.capacity, data.acceptedResources);
        inv.items = new Map(data.items);
        return inv;
    }
}
