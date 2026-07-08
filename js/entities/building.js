// ===========================================
// Space Miner
// Building Base
// ===========================================

import { globalAnimationSystem, Easing } from "../systems/animationSystem.js";
import { Inventory } from "../inventory.js";

export class Building {

    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        
        // Inventory system (NEW: replacing legacy storage system)
        this.inventory = new Inventory(1000, []); // 1000 capacity, accepts all resources
        
        // Legacy properties for backward compatibility
        // TODO: These will be deprecated when all buildings use inventory
        this.storage = 0;
        this.capacity = 1000;
        
        this.level = 1;
        this.production = 0;
        this.description = "A building";
        
        // Animation properties
        this.lightIntensity = 0.3;
        this.animationTime = Math.random() * 2; // Offset animations
        
        // Connection system
        this.connections = []; // Array of connected buildings
        this.connectionColor = "#00ffff"; // Cyan by default
        
        // Idle animations
        this.setupIdleAnimations();
    }

    setupIdleAnimations() {
        // Pulsing light effect (looping)
        const loop = () => {
            globalAnimationSystem.add(
                this, "lightIntensity", 0.3, 0.8, 2,
                Easing.inOutQuad, loop
            );
        };
        globalAnimationSystem.add(
            this, "lightIntensity", 0.3, 0.8, 2,
            Easing.inOutQuad, loop
        );
    }

    // Connection system methods
    connectTo(building) {
        if (!this.connections.includes(building)) {
            this.connections.push(building);
        }
    }

    disconnectFrom(building) {
        this.connections = this.connections.filter(b => b !== building);
    }

    // Inventory compatibility - keep legacy storage in sync for backward compatibility
    addStorage(amount) {
        // Legacy method: adds to "ore" resource type in inventory
        const added = this.inventory.add("ore", amount);
        this.storage = this.inventory.getTotal();
        return added;
    }

    removeStorage(amount) {
        // Legacy method: removes from "ore" resource type in inventory
        const removed = this.inventory.remove("ore", amount);
        this.storage = this.inventory.getTotal();
        return removed;
    }

    drawConnections(renderer) {
        const ctx = renderer.ctx;
        const fromPos = renderer.camera.worldToScreen(this.x, this.y);

        for (const building of this.connections) {
            const toPos = renderer.camera.worldToScreen(building.x, building.y);
            
            // Draw glowing connection line
            const gradient = ctx.createLinearGradient(fromPos.x, fromPos.y, toPos.x, toPos.y);
            gradient.addColorStop(0, `${this.connectionColor}88`);
            gradient.addColorStop(0.5, `${this.connectionColor}ff`);
            gradient.addColorStop(1, `${this.connectionColor}88`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(1, 2 * renderer.camera.zoom);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(toPos.x, toPos.y);
            ctx.stroke();
            
            // Draw glowing nodes at endpoints
            ctx.fillStyle = `${this.connectionColor}cc`;
            ctx.beginPath();
            ctx.arc(fromPos.x, fromPos.y, Math.max(3, 4 * renderer.camera.zoom), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    draw(renderer){

        const ctx = renderer.ctx;

        const pos = renderer.camera.worldToScreen(this.x, this.y);
        const size = 80 * renderer.camera.zoom;

        // Draw base building
        ctx.fillStyle = "#888";
        ctx.fillRect(
            pos.x-size/2,
            pos.y-size/2,
            size,
            size
        );

        // Draw pulsing light effect
        ctx.fillStyle = `rgba(0, 212, 255, ${this.lightIntensity * 0.4})`;
        ctx.fillRect(
            pos.x-size/2,
            pos.y-size/2,
            size,
            size
        );

        // Draw corners as blinking lights
        const cornerSize = size * 0.15;
        ctx.fillStyle = `rgba(0, 255, 136, ${this.lightIntensity})`;
        ctx.fillRect(pos.x-size/2, pos.y-size/2, cornerSize, cornerSize);
        ctx.fillRect(pos.x+size/2-cornerSize, pos.y-size/2, cornerSize, cornerSize);
        ctx.fillRect(pos.x-size/2, pos.y+size/2-cornerSize, cornerSize, cornerSize);
        ctx.fillRect(pos.x+size/2-cornerSize, pos.y+size/2-cornerSize, cornerSize, cornerSize);

        renderer.drawWorldText(this.name, this.x, this.y - 60, 14, "#fff");

    }


}
