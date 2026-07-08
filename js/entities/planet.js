// ===========================================
// Space Miner
// Planet
// ===========================================

export class Planet {
    constructor(seed, name, resourceBias) {
        this.seed = seed;
        this.name = name;
        this.resourceBias = resourceBias;
        this.discovered = false;
        this.level = 1;
    }

    discover() {
        this.discovered = true;
    }
}
