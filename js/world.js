// ===========================================
// Space Miner
// World
// ===========================================


import { Mine } from "./entities/mine.js";
import { Truck } from "./entities/truck.js";
import { Building } from "./entities/building.js";
import { ResourceManager } from "./resources.js";
import { Warehouse } from "./entities/warehouse.js";
import { Smelter } from "./entities/smelter.js";
import { Assembler } from "./entities/assembler.js";
import { ResearchLab } from "./entities/researchLab.js";
import { Planet } from "./entities/planet.js";
import { globalParticleSystem } from "./systems/particleSystem.js";

export class World {

    constructor() {
        this.money = 1000;
        this.ore = 0;
        this.research = 0;
        this.resources = new ResourceManager();
        this.resources.add("ironOre", 0);
        this.resources.add("ironPlate", 0);
        this.resources.add("component", 0);

        this.hq = new Building(0, 0, "Mining HQ");
        this.hq.storage = 0;
        this.hq.capacity = 1000;

        this.mines = [];
        this.warehouses = [];
        this.trucks = [];
        this.objects = [this.hq];
        this.planets = [new Planet(1, "Earth", "iron")];

        const startingMine = new Mine(500, 100);
        this.mines.push(startingMine);
        this.objects.push(startingMine);

        const warehouse = new Warehouse(300, 100, "Warehouse");
        warehouse.world = this;
        this.warehouses.push(warehouse);
        this.objects.push(warehouse);

        this.truck = new Truck(0, 0, startingMine, warehouse, this);
        this.trucks.push(this.truck);

        const smelter = new Smelter(200, 250, "Smelter");
        smelter.world = this;
        this.objects.push(smelter);

        const assembler = new Assembler(400, 250, "Assembler");
        assembler.world = this;
        this.objects.push(assembler);

        const lab = new ResearchLab(300, 350, "Research Lab");
        lab.world = this;
        this.objects.push(lab);

        // Establish connections for visual network
        startingMine.connectTo(warehouse);
        warehouse.connectTo(smelter);
        smelter.connectTo(assembler);
        assembler.connectTo(lab);
        
        // Set connection colors based on resource type
        startingMine.connectionColor = "#ffdd44"; // Ore - yellow
        warehouse.connectionColor = "#ffaa44"; // Money - orange
        smelter.connectionColor = "#cccccc"; // Plates - gray
        assembler.connectionColor = "#4488ff"; // Components - blue
    }





    update(delta) {
        for (const mine of this.mines) {
            mine.update(delta);
        }

        for (const truck of this.trucks) {
            truck.update(delta);
        }

        for (const warehouse of this.warehouses) {
            warehouse.update(delta);
        }

        for (const object of this.objects) {
            if (object.update) {
                object.update(delta);
            }
        }

        globalParticleSystem.update(delta);

        this.ore = this.resources.get("ironOre");
    }





    draw(renderer) {
        // Draw all connections first (behind buildings)
        for (const object of this.objects) {
            if (object.drawConnections) {
                object.drawConnections(renderer);
            }
        }

        // Draw buildings and other objects
        for (const object of this.objects) {
            object.draw(renderer);
        }

        for (const truck of this.trucks) {
            truck.draw(renderer);
        }
    }





    saveState() {
        return {
            money: this.money,
            ore: this.ore,
            research: this.research,
            resources: {
                ironOre: this.resources.get("ironOre"),
                ironPlate: this.resources.get("ironPlate"),
                component: this.resources.get("component")
            }
        };
    }

    loadState(state) {
        if (!state) return;
        this.money = state.money || 0;
        this.ore = state.ore || 0;
        this.research = state.research || 0;
        this.resources.set("ironOre", state.resources?.ironOre || 0);
        this.resources.set("ironPlate", state.resources?.ironPlate || 0);
        this.resources.set("component", state.resources?.component || 0);
    }

    getObjectAt(x,y){



        for(
            const object of this.objects
        ){



            if(
                Math.hypot(
                    object.x-x,
                    object.y-y
                )
                <
                80
            ){

                return object;

            }


        }


        return null;


    }


}
