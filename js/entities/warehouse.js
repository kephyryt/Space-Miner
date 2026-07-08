// ===========================================
// Space Miner
// Warehouse
// ===========================================

import { Building } from "./building.js";
import { globalAnimationSystem } from "../systems/animationSystem.js";
import { globalAudioSystem } from "../systems/audioSystem.js";
import { globalParticleSystem } from "../systems/particleSystem.js";

export class Warehouse extends Building {
    constructor(x, y, name = "Warehouse") {
        super(x, y, name);
        this.capacity = 500;
        this.storage = 0;
        this.acceptsResource = true;
        this.production = 0;
        this.description = "Stores mined ore and converts it into money.";
        
        // Animation properties
        this.doorOpen = 0; // 0 to 1
        this.blinkLight = 0;
        this.salesTimer = 0;
        this.setupAnimations();
    }

    setupAnimations() {
        // Door opening animation
        const doorLoop = () => {
            globalAnimationSystem.add(this, "doorOpen", 0, 0.7, 1.5, "inOutQuad", () => {
                globalAnimationSystem.add(this, "doorOpen", 0.7, 0, 1.5, "inOutQuad", doorLoop);
            });
        };
        doorLoop();
        
        // Blinking lights
        const lightLoop = () => {
            globalAnimationSystem.add(this, "blinkLight", 0.5, 1, 0.4, "linear", () => {
                globalAnimationSystem.add(this, "blinkLight", 1, 0.5, 0.4, "linear", lightLoop);
            });
        };
        lightLoop();
    }

    update(delta) {
        // Convert ore in inventory to money
        const oreInInventory = this.inventory.get("ore");
        if (oreInInventory <= 0 || delta <= 0) return;

        const sellAmount = 1;
        const sold = this.inventory.remove("ore", sellAmount);
        
        if (sold > 0 && this.world) {
            this.world.money += sold * 10;
            this.world.resources.add("ironOre", -sold);
            
            // Trigger audio event periodically
            this.salesTimer += delta;
            if (this.salesTimer > 1) {
                globalAudioSystem.play("resource.sell");
                
                // Emit resource particles upward (like money/value floating out)
                globalParticleSystem.emitBurst(
                    this.x,
                    this.y - 20,
                    3, 50, 0.5, "spark", "#ffdd44"
                );
                
                this.salesTimer = 0;
            }
        }
    }

    draw(renderer) {
        const ctx = renderer.ctx;
        const pos = renderer.camera.worldToScreen(this.x, this.y);
        const size = 80 * renderer.camera.zoom;
        const scale = renderer.camera.zoom;

        // Draw cylindrical storage tank (main body)
        ctx.fillStyle = "#1f5d8f";
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y - size * 0.1, size * 0.35, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tank metallic shading
        ctx.fillStyle = "rgba(100, 180, 220, 0.3)";
        ctx.beginPath();
        ctx.ellipse(pos.x - size * 0.15, pos.y - size * 0.15, size * 0.1, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw cargo doors (animated)
        ctx.fillStyle = "#2a7fbb";
        const doorWidth = size * 0.2;
        const doorHeight = size * 0.3 * this.doorOpen;
        ctx.fillRect(pos.x - doorWidth/2, pos.y + size * 0.2, doorWidth, doorHeight);
        ctx.fillRect(pos.x + doorWidth/3, pos.y + size * 0.2, doorWidth, doorHeight);

        // Door borders
        ctx.strokeStyle = "#1a4d7a";
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.strokeRect(pos.x - doorWidth/2, pos.y + size * 0.2, doorWidth, doorHeight);
        ctx.strokeRect(pos.x + doorWidth/3, pos.y + size * 0.2, doorWidth, doorHeight);

        // Draw indicator lights (blinking)
        ctx.fillStyle = `rgba(136, 221, 255, ${this.blinkLight})`;
        const lightRadius = Math.max(3, 5 * scale);
        
        // Top lights
        ctx.beginPath();
        ctx.arc(pos.x - size * 0.25, pos.y - size * 0.35, lightRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x + size * 0.25, pos.y - size * 0.35, lightRadius, 0, Math.PI * 2);
        ctx.fill();

        // Middle status lights (show if warehouse has items)
        const hasItems = this.inventory.getTotal() > 0;
        ctx.fillStyle = hasItems ? `rgba(100, 255, 100, ${this.blinkLight * 0.8})` : "rgba(100, 100, 100, 0.3)";
        ctx.beginPath();
        ctx.arc(pos.x - size * 0.1, pos.y, lightRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x + size * 0.1, pos.y, lightRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw tank rim/cap at top
        ctx.strokeStyle = "#0d3a57";
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y - size * 0.45, size * 0.38, size * 0.1, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Level indicator (show inventory fill percentage)
        const level = this.inventory.getFillPercentage() * 100;
        ctx.fillStyle = "#88ddff";
        ctx.font = `bold ${Math.max(10, 11 * scale)}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(`${Math.round(level)}%`, pos.x, pos.y);

        renderer.drawWorldText("📦", this.x, this.y + 25, 18, "#88ddff");
    }
}
