// ===========================================
// Space Miner
// Iron Mine
// ===========================================

import { ResourceBuilding } from "./resourceBuilding.js";
import { globalParticleSystem } from "../systems/particleSystem.js";

export class Mine extends ResourceBuilding {


    constructor(x,y){


        super(
            x,
            y,
            "Iron Mine"
        );


        this.cost =
        100;

        // Animation properties
        this.drillRotation = 0;
        this.particleTimer = 0;

    }




    upgrade(){


        super.upgrade();


        this.cost *= 2;


    }

    update(delta) {
        super.update(delta);
        
        // Rotate drill
        this.drillRotation += delta * 5; // 5 radians per second
        if (this.drillRotation > Math.PI * 2) {
            this.drillRotation -= Math.PI * 2;
        }
        
        // Emit dust particles while producing
        this.particleTimer += delta;
        if (this.particleTimer > 0.3) {
            globalParticleSystem.emitBurst(
                this.x + (Math.random() - 0.5) * 20,
                this.y + (Math.random() - 0.5) * 20,
                3, 50, 0.8, "dust", "#8b6914"
            );
            this.particleTimer = 0;
        }
    }



    draw(renderer){

        const ctx = renderer.ctx;

        const pos = renderer.camera.worldToScreen(this.x, this.y);
        const radius = 45 * renderer.camera.zoom;
        const scale = renderer.camera.zoom;

        // Draw mine base (dark gray platform)
        ctx.fillStyle = "#333333";
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + radius * 0.4, radius * 0.8, radius * 0.2, 0, 0, Math.PI*2);
        ctx.fill();

        // Draw headframe structure (triangular support)
        ctx.strokeStyle = "#555555";
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.beginPath();
        ctx.moveTo(pos.x - radius * 0.4, pos.y + radius * 0.35);
        ctx.lineTo(pos.x, pos.y - radius * 0.8);
        ctx.lineTo(pos.x + radius * 0.4, pos.y + radius * 0.35);
        ctx.stroke();

        // Draw cross-bracing
        ctx.strokeStyle = "#444444";
        ctx.lineWidth = Math.max(1, 1.5 * scale);
        ctx.beginPath();
        ctx.moveTo(pos.x - radius * 0.35, pos.y - radius * 0.3);
        ctx.lineTo(pos.x + radius * 0.35, pos.y - radius * 0.3);
        ctx.stroke();

        // Draw rotating drill mechanism
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.drillRotation);
        
        // Drill shaft - metallic
        ctx.strokeStyle = "#888888";
        ctx.lineWidth = Math.max(3, 5 * scale);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.5);
        ctx.lineTo(0, radius * 0.5);
        ctx.stroke();
        
        // Drill bit (spinning cone at bottom)
        ctx.fillStyle = "#ffaa44";
        ctx.beginPath();
        ctx.moveTo(0, radius * 0.5);
        ctx.lineTo(-radius * 0.2, radius * 0.7);
        ctx.lineTo(radius * 0.2, radius * 0.7);
        ctx.closePath();
        ctx.fill();
        
        // Drill bit glow
        ctx.strokeStyle = `rgba(255, 170, 68, 0.5)`;
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.stroke();
        
        ctx.restore();

        // Level indicator on top
        ctx.fillStyle = "#ffff88";
        ctx.font = `bold ${Math.max(10, 12 * scale)}px monospace`;
        ctx.fillText(this.level, pos.x, pos.y - radius - 10);

        renderer.drawWorldText("⛏", this.x, this.y + 20, 16, "#ffaa44");

    }


}
