// ===========================================
// Space Miner
// Save System
// ===========================================

export class SaveSystem {
    constructor(world) {
        this.world = world;
    }

    save() {
        const state = this.world.saveState();
        localStorage.setItem("spaceMinerSave", JSON.stringify(state));
        return state;
    }

    load() {
        const raw = localStorage.getItem("spaceMinerSave");
        if (!raw) return null;
        try {
            const state = JSON.parse(raw);
            this.world.loadState(state);
            return state;
        } catch (error) {
            return null;
        }
    }
}
