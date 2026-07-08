// ===========================================
// Space Miner
// Resource Building Base
// ===========================================

import { Building } from "./building.js";


export class ResourceBuilding extends Building {


    constructor(x, y, name) {

        super(x, y, name);

        this.level = 1;

        // Set inventory capacity
        this.inventory.capacity = 100;
        
        // Legacy properties for backward compatibility
        this.storage = 0;
        this.capacity = 100;

        this.production = 5;
    }



    update(delta) {
        // Produce ore and add to inventory
        const produced = this.production * delta;
        
        // Add to inventory (ore resource type)
        const added = this.inventory.add("ore", produced);
        
        // Update legacy storage property for backward compatibility
        this.storage = this.inventory.getTotal();
    }



    upgrade(){


        this.level++;


        this.production *= 1.5;


        this.capacity *= 1.5;


    }


}
