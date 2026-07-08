// ===========================================
// Space Miner
// Resource Building Base
// ===========================================

import { Building } from "./building.js";
import { RecipeDatabase } from "../systems/recipeDatabase.js";
import { ProductionEngine } from "../systems/productionEngine.js";


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
        
        // Initialize recipe-driven production engine
        const recipe = RecipeDatabase.getRecipe("Mine");
        if (recipe) {
            this.productionEngine = new ProductionEngine(recipe, this);
        } else {
            console.error("ResourceBuilding (Mine): Recipe not found in RecipeDatabase");
        }
    }



    update(delta) {
        if (!this.productionEngine) return;
        
        // Use recipe system for ore production
        this.productionEngine.update(delta);
        
        // Update legacy storage property for backward compatibility
        this.storage = this.inventory.getTotal();
    }



    upgrade(){


        this.level++;


        this.production *= 1.5;


        this.capacity *= 1.5;


    }


}
