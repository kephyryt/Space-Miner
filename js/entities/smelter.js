// ===========================================
// Space Miner
// Smelter
// ===========================================

import { Building } from "./building.js";
import { globalAnimationSystem } from "../systems/animationSystem.js";
import { globalParticleSystem } from "../systems/particleSystem.js";
import { RecipeDatabase } from "../systems/recipeDatabase.js";
import { ProductionEngine } from "../systems/productionEngine.js";

export class Smelter extends Building {
    constructor(x, y, name = "Smelter") {
        super(x, y, name);
        this.capacity = 100;
        this.storage = 0;
        this.outputStorage = 0;
        this.production = 1;
        this.description = "Turns mined ore into iron plates for later processing.";
        
        // Set inventory capacity for production building
        this.inventory.capacity = 100;
        
        // Initialize recipe-driven production engine
        const recipe = RecipeDatabase.getRecipe("Smelter");
        if (recipe) {
            this.productionEngine = new ProductionEngine(recipe, this);
        } else {
            console.error("Smelter: Recipe not found in RecipeDatabase");
        }
        
        // Animation properties
        this.furnaceGlow = 0.3;
        this.smokeTimer = 0;
        this.setupAnimations();
    }

    setupAnimations() {
        // Furnace glow pulsing
        const glowLoop = () => {
            globalAnimationSystem.add(this, "furnaceGlow", 0.3, 1, 1.5, "inOutQuad", () => {
                globalAnimationSystem.add(this, "furnaceGlow", 1, 0.3, 1.5, "inOutQuad", glowLoop);
            });
        };
        glowLoop();
    }

    update(delta) {
        if (!this.world || !this.productionEngine) return;
        
        // Use recipe system for production
        const recipeCompleted = this.productionEngine.update(delta);
        
        // Emit smoke particles when producing
        this.smokeTimer += delta;
        if (this.smokeTimer > 0.2) {
            globalParticleSystem.emitBurst(
                this.x + (Math.random() - 0.5) * 15,
                this.y - 30,
                2, 30, 1.2, "dust", "#444444"
            );
            this.smokeTimer = 0;
        }
    }

    draw(renderer) {
        const ctx = renderer.ctx;
        const pos = renderer.camera.worldToScreen(this.x, this.y);
        const size = 70 * renderer.camera.zoom;
        const scale = renderer.camera.zoom;

        // Draw furnace body (rectangular base)
        ctx.fillStyle = "#8c6d3f";
        ctx.fillRect(pos.x - size/2.5, pos.y - size/3, size/1.3, size/1.5);

        // Furnace brick pattern
        ctx.strokeStyle = "#6b4f2a";
        ctx.lineWidth = Math.max(1, 1.5 * scale);
        for (let i = 0; i < 3; i++) {
            ctx.strokeRect(
                pos.x - size/2.5 + (i * size/4.5),
                pos.y - size/3,
                size/4.5,
                size/4
            );
        }

        // Draw glowing furnace window
        const windowSize = size * 0.35;
        ctx.fillStyle = `rgba(255, 170, 0, ${this.furnaceGlow})`;
        ctx.fillRect(pos.x - windowSize/2, pos.y - size/5, windowSize, windowSize);
        
        // Window frame
        ctx.strokeStyle = `rgba(255, 100, 0, ${this.furnaceGlow * 0.7})`;
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.strokeRect(pos.x - windowSize/2, pos.y - size/5, windowSize, windowSize);

        // Furnace glow halo
        ctx.strokeStyle = `rgba(255, 100, 0, ${this.furnaceGlow * 0.4})`;
        ctx.lineWidth = Math.max(2, 4 * scale);
        ctx.strokeRect(pos.x - windowSize/2 - 5, pos.y - size/5 - 5, windowSize + 10, windowSize + 10);

        // Draw chimney/stack (vertical pipe)
        ctx.fillStyle = "#555555";
        ctx.fillRect(pos.x + size/3.5, pos.y - size/1.8, size/6, size/1.2);

        // Stack edge highlight
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.strokeRect(pos.x + size/3.5, pos.y - size/1.8, size/6, size/1.2);

        // Smoke emission visual
        const smokeIntensity = Math.sin(performance.now() * 0.003) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(200, 200, 200, ${smokeIntensity * 0.4})`;
        ctx.beginPath();
        ctx.arc(pos.x + size/2.8, pos.y - size/1.5, size/8, 0, Math.PI * 2);
        ctx.fill();

        // Input port
        ctx.fillStyle = "#666666";
        ctx.beginPath();
        ctx.arc(pos.x - size/2.5, pos.y - size/6, size * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Output port with glow
        ctx.fillStyle = `rgba(255, 150, 50, ${this.furnaceGlow * 0.6})`;
        ctx.beginPath();
        ctx.arc(pos.x + size/2.5, pos.y - size/6, size * 0.08, 0, Math.PI * 2);
        ctx.fill();

        renderer.drawWorldText("🔥", this.x, this.y + 25, 16, "#ff9944");
    }
}
