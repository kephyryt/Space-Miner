// ===========================================
// Space Miner
// Research Lab
// ===========================================

import { Building } from "./building.js";
import { Inventory } from "../inventory.js";
import { globalAnimationSystem } from "../systems/animationSystem.js";
import { RecipeDatabase } from "../systems/recipeDatabase.js";
import { ProductionEngine } from "../systems/productionEngine.js";

export class ResearchLab extends Building {
    constructor(x, y, name = "Research Lab") {
        super(x, y, name);
        this.capacity = 50;
        this.storage = 0;
        this.production = 1;
        this.description = "Generates research points for future upgrades and expansion.";
        
        // Create a temporary inventory for recipe outputs (research points)
        this.recipeOutputInventory = new Inventory(1000, []);
        
        // Initialize recipe-driven production engine
        const recipe = RecipeDatabase.getRecipe("Research Lab");
        if (recipe) {
            // Pass output inventory so recipe produces research points into separate inventory
            this.productionEngine = new ProductionEngine(recipe, this, this.recipeOutputInventory);
        } else {
            console.error("ResearchLab: Recipe not found in RecipeDatabase");
        }
        
        // Animation properties
        this.scanRotation = 0;
        this.scanIntensity = 0.5;
        this.setupAnimations();
    }

    setupAnimations() {
        // Scanning beam rotation
        const scanLoop = setInterval(() => {
            this.scanRotation += 0.08;
            if (this.scanRotation > Math.PI * 2) {
                this.scanRotation -= Math.PI * 2;
            }
        }, 20);
        
        // Scan intensity pulsing
        const intensityLoop = () => {
            globalAnimationSystem.add(this, "scanIntensity", 0.3, 1, 1.2, "sine", intensityLoop);
        };
        intensityLoop();
    }

    update(delta) {
        if (!this.world || !this.productionEngine) return;
        
        // Use recipe system for research point generation
        this.productionEngine.update(delta);
        
        // Check if recipe produced research points
        if (this.recipeOutputInventory) {
            const researchProduced = this.recipeOutputInventory.remove("researchPoint", 100); // Remove all produced points
            if (researchProduced > 0) {
                this.world.research = (this.world.research || 0) + researchProduced;
            }
        }
    }

    draw(renderer) {
        const ctx = renderer.ctx;
        const pos = renderer.camera.worldToScreen(this.x, this.y);
        const size = 70 * renderer.camera.zoom;
        const scale = renderer.camera.zoom;

        // Draw domed building base
        ctx.fillStyle = "#7a3fcf";
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + size * 0.15, size * 0.45, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw transparent dome
        ctx.strokeStyle = `rgba(221, 136, 255, ${this.scanIntensity * 0.6})`;
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - size * 0.1, size * 0.5, 0, Math.PI);
        ctx.stroke();

        // Draw satellite dish structure
        ctx.save();
        ctx.translate(pos.x, pos.y - size * 0.35);

        // Dish support arm
        ctx.strokeStyle = "#5a2faf";
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.3, -size * 0.25);
        ctx.stroke();

        // Satellite dish (rotating)
        ctx.save();
        ctx.translate(-size * 0.3, -size * 0.25);
        ctx.rotate(this.scanRotation * 0.5);
        
        ctx.strokeStyle = `rgba(221, 136, 255, ${this.scanIntensity * 0.8})`;
        ctx.lineWidth = Math.max(1, 2 * scale);
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.08 * (i + 1), 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Dish center
        ctx.fillStyle = `rgba(221, 136, 255, ${this.scanIntensity})`;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        ctx.restore();

        // Draw scanning beam (rotating)
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.scanRotation);
        
        ctx.strokeStyle = `rgba(221, 136, 255, ${this.scanIntensity})`;
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.35, 0);
        ctx.stroke();
        
        // Scan line endpoint glow
        ctx.fillStyle = `rgba(221, 136, 255, ${this.scanIntensity})`;
        ctx.beginPath();
        ctx.arc(size * 0.35, 0, Math.max(2, 4 * scale), 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        // Status indicator
        ctx.fillStyle = this.storage > 0 ? "#dd88ff" : "#665588";
        ctx.beginPath();
        ctx.arc(pos.x - size * 0.3, pos.y - size * 0.2, Math.max(3, 4 * scale), 0, Math.PI * 2);
        ctx.fill();

        renderer.drawWorldText("🔬", this.x, this.y + 25, 16, "#dd88ff");
    }
}
