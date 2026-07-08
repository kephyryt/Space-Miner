// ===========================================
// Space Miner
// Assembler
// ===========================================

import { Building } from "./building.js";

export class Assembler extends Building {
    constructor(x, y, name = "Assembler") {
        super(x, y, name);
        this.capacity = 100;
        this.storage = 0;
        this.production = 0.5;
        this.description = "Consumes plates to produce components as the factory grows.";
        
        // Animation properties
        this.gearRotation = 0;
    }

    update(delta) {
        if (!this.world) return;
        
        // Rotate gears
        this.gearRotation += delta * 4;
        if (this.gearRotation > Math.PI * 2) {
            this.gearRotation -= Math.PI * 2;
        }
        
        const plates = this.world.resources.get("ironPlate");
        if (plates >= 1 && this.storage < this.capacity) {
            this.world.resources.add("ironPlate", -1);
            this.storage += this.production * delta;
            if (this.storage >= 1) {
                const components = Math.floor(this.storage);
                this.storage -= components;
                this.world.resources.add("component", components);
            }
        }
    }

    drawGear(ctx, x, y, radius, teeth, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        ctx.fillStyle = "#666666";
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw gear teeth
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;
            ctx.fillStyle = "#888888";
            ctx.save();
            ctx.rotate(angle);
            ctx.fillRect(-radius * 0.15, radius * 0.5, radius * 0.3, radius * 0.25);
            ctx.restore();
        }
        
        ctx.restore();
    }

    draw(renderer) {
        const ctx = renderer.ctx;
        const pos = renderer.camera.worldToScreen(this.x, this.y);
        const size = 70 * renderer.camera.zoom;
        const scale = renderer.camera.zoom;

        // Draw factory building base
        ctx.fillStyle = "#4b6b2f";
        ctx.fillRect(pos.x - size/2.2, pos.y - size/2.5, size/1.1, size/1.4);

        // Building frame
        ctx.strokeStyle = "#2f3f1f";
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.strokeRect(pos.x - size/2.2, pos.y - size/2.5, size/1.1, size/1.4);

        // Windows (showing activity inside)
        ctx.fillStyle = `rgba(200, 255, 100, 0.3)`;
        for (let i = 0; i < 2; i++) {
            ctx.fillRect(
                pos.x - size/3 + (i * size/3),
                pos.y - size/3,
                size/6,
                size/5
            );
        }

        // Draw rotating gears (animated)
        const gearRadius = size * 0.22;
        this.drawGear(ctx, pos.x - size * 0.18, pos.y + size * 0.05, gearRadius, 8, this.gearRotation);
        this.drawGear(ctx, pos.x + size * 0.18, pos.y + size * 0.05, gearRadius, 8, -this.gearRotation * 0.8);

        // Draw conveyor belt connecting gears
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.beginPath();
        ctx.moveTo(pos.x - size * 0.18 + gearRadius * 0.7, pos.y + size * 0.05);
        ctx.lineTo(pos.x + size * 0.18 - gearRadius * 0.7, pos.y + size * 0.05);
        ctx.stroke();

        // Conveyor motion visualization
        const beltMotion = (performance.now() * 0.002) % (size * 0.3);
        ctx.fillStyle = "rgba(100, 200, 100, 0.5)";
        ctx.fillRect(pos.x - size * 0.12 + beltMotion - size * 0.3, pos.y + size * 0.03, size * 0.1, size * 0.04);

        // Draw output port with component glow
        ctx.fillStyle = "#88ff00";
        ctx.beginPath();
        ctx.arc(pos.x + size/2.2, pos.y, size * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // Status lights
        ctx.fillStyle = this.storage > 0 ? "#88ff00" : "#666666";
        ctx.beginPath();
        ctx.arc(pos.x - size/3, pos.y - size/3.5, Math.max(2, 3 * scale), 0, Math.PI * 2);
        ctx.fill();

        renderer.drawWorldText("⚙", this.x, this.y + 25, 16, "#88ff00");
    }
}
