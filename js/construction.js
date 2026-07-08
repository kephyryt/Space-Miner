// ===========================================
// Space Miner
// Construction System
// ===========================================

import { BuildingRegistry } from "./buildingRegistry.js";
import { globalAudioSystem } from "./systems/audioSystem.js";
import { globalParticleSystem } from "./systems/particleSystem.js";

export class Construction {
    constructor(world) {
        this.world = world;
        this.mode = null;
    }

    select(type) {
        this.mode = type;
    }

    cancel() {
        this.mode = null;
    }

    place(x, y) {
        if (!this.mode) return;

        const cost = BuildingRegistry.getCost(this.mode);
        if (this.world.money < cost) return;

        this.world.money -= cost;

        const building = BuildingRegistry.create(this.mode, x, y, this.world);
        if (building) {
            this.world.objects.push(building);

            if (this.mode === "mine") {
                this.world.mines.push(building);
            } else if (this.mode === "warehouse") {
                this.world.warehouses.push(building);
            }

            // Trigger audio event
            globalAudioSystem.play("build", { volume: 0.7 });

            // Emit dust particles for construction effect
            globalParticleSystem.emitBurst(x, y, 8, 80, 0.8, "dust", "#cccccc");
        }

        this.cancel();
    }
}
