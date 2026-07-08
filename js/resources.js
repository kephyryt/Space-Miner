// ===========================================
// Space Miner
// Resource Manager
// ===========================================

export class ResourceManager {
    constructor() {
        this.resources = new Map();
    }

    add(resourceName, amount) {
        if (!Number.isFinite(amount)) return;
        const current = this.resources.get(resourceName) || 0;
        const next = current + amount;
        this.resources.set(resourceName, next < 0 ? 0 : next);
    }

    get(resourceName) {
        return this.resources.get(resourceName) || 0;
    }

    spend(resourceName, amount) {
        if (!Number.isFinite(amount) || amount <= 0) return false;
        const current = this.resources.get(resourceName) || 0;
        if (current < amount) return false;
        this.resources.set(resourceName, current - amount);
        return true;
    }

    set(resourceName, amount) {
        if (!Number.isFinite(amount) || amount < 0) return;
        this.resources.set(resourceName, amount);
    }
}
