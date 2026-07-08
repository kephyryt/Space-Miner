// ===========================================
// Space Miner
// Recipe Database
// ===========================================

import { Recipe } from "./recipe.js";

/**
 * RecipeDatabase - Static collection of all defined recipes
 * Used by buildings to determine production behavior
 */
export class RecipeDatabase {
    /**
     * Get recipe for a specific building type
     * @param {string} buildingType - e.g., "Smelter", "Assembler", "Mine"
     * @returns {Recipe|null}
     */
    static getRecipe(buildingType) {
        const recipes = RecipeDatabase.ALL_RECIPES;
        return recipes[buildingType] || null;
    }

    /**
     * Get all defined recipes
     */
    static getAllRecipes() {
        return { ...RecipeDatabase.ALL_RECIPES };
    }
}

/**
 * Defined recipes for each production building
 * Format: buildingType → Recipe
 */
RecipeDatabase.ALL_RECIPES = {
    "Smelter": new Recipe({
        name: "Iron Smelting",
        inputs: [
            { resourceType: "ore", amount: 1 }
        ],
        outputs: [
            { resourceType: "plate", amount: 1 }
        ],
        duration: 1.0 // 1 second per cycle
    }),

    "Assembler": new Recipe({
        name: "Component Assembly",
        inputs: [
            { resourceType: "plate", amount: 2 }
        ],
        outputs: [
            { resourceType: "component", amount: 1 }
        ],
        duration: 2.0 // 2 seconds per cycle (slower, requires 2 plates)
    }),

    "Warehouse": new Recipe({
        name: "Ore Conversion to Money",
        inputs: [
            { resourceType: "ore", amount: 1 }
        ],
        outputs: [
            { resourceType: "money", amount: 10 } // 10 money per ore
        ],
        duration: 1.0 // 1 second per cycle
    }),

    "Research Lab": new Recipe({
        name: "Research Point Generation",
        inputs: [], // No inputs, research labs generate knowledge
        outputs: [
            { resourceType: "researchPoint", amount: 1 }
        ],
        duration: 1.0
    })

    // Future recipes:
    // "Electronics Lab": ore + plate → circuit board
    // "Power Plant": coal → energy
    // "Rocket Factory": multiple components → rocket
};
