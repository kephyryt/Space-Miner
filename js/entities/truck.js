// ===========================================
// Space Miner
// Truck
// ===========================================

import { globalParticleSystem } from "../systems/particleSystem.js";
import { globalAudioSystem } from "../systems/audioSystem.js";
import { TruckAI } from "../systems/truckAI.js";

export class Truck {

    /**
     * Create a truck with optional AI routing
     * @param {number} x - Starting x position
     * @param {number} y - Starting y position
     * @param {World} world - Reference to game world
     * @param {Building} source - Optional initial source building (for backward compatibility)
     * @param {Building} destination - Optional initial destination building (for backward compatibility)
     * @param {boolean} useAI - Whether to use intelligent AI routing (default: true)
     */
    constructor(x, y, world, source = null, destination = null, useAI = true) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.speed = 100;
        this.capacity = 10;
        this.cargo = 0;
        this.cargoType = "ore"; // Type of resource being carried
        this.state = "idle"; // idle, searching, toSource, toDestination
        this.wheelRotation = 0;
        this.lastX = x;
        this.lastY = y;
        this.exhaustTimer = 0;
        
        // AI Routing
        this.useAI = useAI;
        this.ai = useAI ? new TruckAI(world) : null;
        this.source = source; // Current source building
        this.destination = destination; // Current destination building
        this.searchTimer = 0;
        this.searchInterval = 0.5; // Search for new routes every 0.5 seconds
        
        // For backward compatibility, if source/destination provided, start moving
        if (source && destination) {
            this.state = "toSource";
        } else if (useAI) {
            this.state = "searching";
        }
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
        if (!this.useAI) {
            // Legacy update for trucks with hardcoded routes
            this.updateLegacy(delta);
            return;
        }

        // AI-driven truck routing
        this.searchTimer += delta;

        if (this.state === "idle") {
            // Try to find work
            if (this.searchTimer > this.searchInterval) {
                this.findNewRoute();
                this.searchTimer = 0;
            }
            return;
        }

        if (this.state === "searching") {
            // Search for cargo to pick up
            if (this.searchTimer > this.searchInterval) {
                this.findNewRoute();
                this.searchTimer = 0;
            }
            
            // If we found a route, start moving
            if (this.source && this.destination) {
                this.state = "toSource";
            }
            return;
        }

        if (this.state === "toSource") {
            if (this.moveTo(this.source, delta)) {
                this.pickupFromSource();
            }
        }
        else if (this.state === "toDestination") {
            if (this.moveTo(this.destination, delta)) {
                this.deliverToDestination();
            }
        }
    }

    /**
     * Find a new source and destination pair for the truck
     */
    findNewRoute() {
        // Get resource priority for this truck
        const resourceType = this.ai.getNextResourceToPrioritize();
        if (!resourceType) {
            this.state = "idle";
            return;
        }

        this.cargoType = resourceType;

        // Find nearest building with this resource
        this.source = this.ai.findNearestSourceBuilding(
            this.x, this.y, resourceType
        );

        // Find nearest destination that accepts this resource
        this.destination = this.source ? this.ai.findNearestDestinationBuilding(
            this.x, this.y, resourceType, this.source
        ) : null;

        if (this.source && this.destination) {
            this.state = "toSource";
        } else {
            this.state = "idle";
        }
    }

    /**
     * Pick up cargo from current source building
     */
    pickupFromSource() {
        if (!this.source || !this.source.inventory) {
            this.state = "searching";
            return;
        }

        const sourceInventory = this.source.inventory;
        const available = sourceInventory.get(this.cargoType);
        const pickup = Math.min(this.capacity, available);

        if (pickup > 0) {
            const removed = sourceInventory.remove(this.cargoType, pickup);
            this.cargo = removed;

            // Trigger load audio and particles
            globalAudioSystem.play("truck.load");
            globalParticleSystem.emitBurst(
                this.x, this.y, 5, 60, 0.5, "dust", "#ffaa44"
            );

            this.state = "toDestination";
        } else {
            // No cargo at source, search for new route
            this.state = "searching";
        }
    }

    /**
     * Deliver cargo to current destination building
     */
    deliverToDestination() {
        if (!this.destination || !this.destination.inventory) {
            this.state = "searching";
            return;
        }

        const destInventory = this.destination.inventory;
        const delivered = destInventory.add(this.cargoType, this.cargo);
        this.cargo = 0;

        // Trigger unload audio and particles
        globalAudioSystem.play("truck.unload");
        globalParticleSystem.emitBurst(
            this.x, this.y, 5, 60, 0.5, "dust", "#ffaa44"
        );

        // Search for next load
        this.state = "searching";
    }

    /**
     * Legacy update for trucks with hardcoded source/destination
     */
    updateLegacy(delta) {
        if (this.state === "idle") {
            // Check if source has cargo to pick up
            const sourceHasItems = this.source.inventory && this.source.inventory.getTotal() > 0;
            if (sourceHasItems) {
                this.state = "toSource";
            }
            return;
        }

        if (this.state === "toSource") {
            if (this.moveTo(this.source, delta)) {
                // Pick up from source inventory - transfer ore resource
                const sourceInventory = this.source.inventory;
                const available = sourceInventory.get("ore");
                const pickup = Math.min(this.capacity, available);

                if (pickup > 0) {
                    // Remove from source inventory
                    const removed = sourceInventory.remove("ore", pickup);
                    this.cargo = removed;

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
                // Deliver to destination inventory
                const destInventory = this.destination.inventory;
                const delivered = destInventory.add("ore", this.cargo);
                this.cargo = 0;

                // Trigger unload audio and particles
                globalAudioSystem.play("truck.unload");
                globalParticleSystem.emitBurst(this.x, this.y, 5, 60, 0.5, "dust", "#ffaa44");

                // Check if there's more to pick up
                const sourceHasMore = this.source.inventory && this.source.inventory.getTotal() > 0;
                this.state = sourceHasMore ? "toSource" : "idle";
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
