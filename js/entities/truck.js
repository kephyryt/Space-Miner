// ===========================================
// Space Miner
// Truck
// ===========================================

import { globalParticleSystem } from "../systems/particleSystem.js";
import { globalAudioSystem } from "../systems/audioSystem.js";

export class Truck {

    constructor(x, y, source, destination, world) {
        this.x = x;
        this.y = y;
        this.source = source;
        this.destination = destination;
        this.world = world;
        this.speed = 100;
        this.capacity = 10;
        this.cargo = 0;
        this.state = "toSource";
        this.wheelRotation = 0;
        this.lastX = x;
        this.lastY = y;
        this.exhaustTimer = 0;
    }

    moveTo(target, delta) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            this.lastX = this.x;
            this.lastY = this.y;
            this.x += dx / distance * this.speed * delta;
            this.y += dy / distance * this.speed * delta;
            
            // Rotate wheels based on movement
            this.wheelRotation += (this.speed * delta) / 8;
            
            // Emit exhaust particles occasionally
            this.exhaustTimer += delta;
            if (this.exhaustTimer > 0.3) {
                globalParticleSystem.emitBurst(
                    this.x - (dx / distance) * 5,
                    this.y - (dy / distance) * 5,
                    2, 40, 0.6, "dust", "#888888"
                );
                this.exhaustTimer = 0;
            }
            
            return false;
        }

        return true;
    }

    update(delta) {
        if (this.state === "idle") {
            if ((this.source.storage || 0) > 0) {
                this.state = "toSource";
            }
            return;
        }

        if (this.state === "toSource") {
            if (this.moveTo(this.source, delta)) {
                const pickup = Math.min(this.capacity, this.source.storage || 0);
                if (pickup > 0) {
                    this.source.storage -= pickup;
                    this.cargo = pickup;
                    
                    // Trigger load audio and particles
                    globalAudioSystem.play("truck.load");
                    globalParticleSystem.emitBurst(this.x, this.y, 5, 60, 0.5, "dust", "#ffaa44");
                    
                    this.state = "toDestination";
                } else {
                    this.state = "idle";
                }
            }
        }
        else if (this.state === "toDestination") {
            if (this.moveTo(this.destination, delta)) {
                this.destination.storage += this.cargo;
                this.world.resources.add("ironOre", this.cargo);
                this.cargo = 0;
                
                // Trigger unload audio and particles
                globalAudioSystem.play("truck.unload");
                globalParticleSystem.emitBurst(this.x, this.y, 5, 60, 0.5, "dust", "#ffaa44");
                
                this.state = (this.source.storage || 0) > 0 ? "toSource" : "idle";
            }
        }
    }

    draw(renderer){
        const pos = renderer.camera.worldToScreen(this.x, this.y);
        const ctx = renderer.ctx;
        const zoom = renderer.camera.zoom;

        // Truck body
        ctx.fillStyle = "#ff8800";
        ctx.fillRect(pos.x - 12 * zoom, pos.y - 8 * zoom, 24 * zoom, 16 * zoom);

        // Cargo bed (shows if carrying cargo)
        if (this.cargo > 0) {
            ctx.fillStyle = "#ffdd44";
            const cargoHeight = 6 * (this.cargo / this.capacity) * zoom;
            ctx.fillRect(pos.x - 10 * zoom, pos.y - 8 * zoom - cargoHeight, 20 * zoom, cargoHeight);
        }

        // Headlights
        ctx.fillStyle = "#ffff88";
        ctx.fillRect(pos.x - 11 * zoom, pos.y - 5 * zoom, 3 * zoom, 3 * zoom);
        ctx.fillRect(pos.x - 11 * zoom, pos.y + 2 * zoom, 3 * zoom, 3 * zoom);

        // Draw wheels with rotation
        ctx.save();
        const wheelSize = 2.5 * zoom;
        
        // Back wheel
        ctx.translate(pos.x - 6 * zoom, pos.y + 8 * zoom);
        ctx.rotate(this.wheelRotation);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = Math.max(1, zoom);
        ctx.beginPath();
        ctx.arc(0, 0, wheelSize, 0, Math.PI * 2);
        ctx.stroke();
        // Wheel tread
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + this.wheelRotation;
            ctx.beginPath();
            ctx.moveTo(wheelSize * Math.cos(angle), wheelSize * Math.sin(angle));
            ctx.lineTo(wheelSize * 0.5 * Math.cos(angle), wheelSize * 0.5 * Math.sin(angle));
            ctx.stroke();
        }
        ctx.restore();

        // Front wheel
        ctx.save();
        ctx.translate(pos.x + 6 * zoom, pos.y + 8 * zoom);
        ctx.rotate(this.wheelRotation);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = Math.max(1, zoom);
        ctx.beginPath();
        ctx.arc(0, 0, wheelSize, 0, Math.PI * 2);
        ctx.stroke();
        // Wheel tread
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + this.wheelRotation;
            ctx.beginPath();
            ctx.moveTo(wheelSize * Math.cos(angle), wheelSize * Math.sin(angle));
            ctx.lineTo(wheelSize * 0.5 * Math.cos(angle), wheelSize * 0.5 * Math.sin(angle));
            ctx.stroke();
        }
        ctx.restore();
    }
}
