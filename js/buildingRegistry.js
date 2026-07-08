// ===========================================
// Space Miner
// Building Registry
// ===========================================

import { Mine } from "./entities/mine.js";
import { Warehouse } from "./entities/warehouse.js";
import { Smelter } from "./entities/smelter.js";
import { Assembler } from "./entities/assembler.js";
import { ResearchLab } from "./entities/researchLab.js";

export class BuildingRegistry {
    static buildings = {
        mine: {
            name: "Mine",
            cost: 250,
            icon: "⛏",
            color: "#555",
            class: Mine,
            description: "Extracts ore from the ground. Produces 5 ore/sec."
        },
        warehouse: {
            name: "Warehouse",
            cost: 400,
            icon: "📦",
            color: "#1f5d8f",
            class: Warehouse,
            description: "Stores ore and converts it to money automatically. Sells ore at $10/unit."
        },
        smelter: {
            name: "Smelter",
            cost: 650,
            icon: "🔥",
            color: "#8c6d3f",
            class: Smelter,
            description: "Smelts ore into metal plates. Converts 1 ore → 1 plate at 1 plate/sec."
        },
        assembler: {
            name: "Assembler",
            cost: 900,
            icon: "⚙",
            color: "#4b6b2f",
            class: Assembler,
            description: "Assembles plates into advanced components. Produces 0.5 components/sec."
        },
        researchLab: {
            name: "Research Lab",
            cost: 700,
            icon: "🔬",
            color: "#7a3fcf",
            class: ResearchLab,
            description: "Generates research points to unlock new technologies. Produces 1 point/sec."
        }
    };

    static create(type, x, y, world) {
        const def = this.buildings[type];
        if (!def) return null;

        const building = new def.class(x, y, def.name);
        building.world = world;
        building.icon = def.icon;
        return building;
    }

    static getCost(type) {
        return this.buildings[type]?.cost || 0;
    }

    static getDefinition(type) {
        return this.buildings[type];
    }
}
