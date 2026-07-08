// ===========================================
// Space Miner
// Particle System
// ===========================================
// Visual particles for resources, effects, etc.

export class Particle {
    constructor(x, y, vx, vy, life, type = "resource", color = "#ffff88") {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.type = type;
        this.color = color;
        this.scale = 1;
    }

    update(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        this.life -= delta;
        this.scale = Math.max(0, this.life / this.maxLife);
    }

    draw(renderer, camera) {
        if (this.life <= 0) return;

        const ctx = renderer.ctx;
        const pos = camera.worldToScreen(this.x, this.y);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.scale));

        if (this.type === "ore") {
            // Yellow ore crate
            ctx.fillStyle = "#ffdd44";
            ctx.fillRect(pos.x - 8, pos.y - 8, 16, 16);
            ctx.strokeStyle = "#ccaa00";
            ctx.lineWidth = 1;
            ctx.strokeRect(pos.x - 8, pos.y - 8, 16, 16);
        } else if (this.type === "plate") {
            // Gray metal plate
            ctx.fillStyle = "#cccccc";
            ctx.fillRect(pos.x - 6, pos.y - 6, 12, 12);
            ctx.strokeStyle = "#888888";
            ctx.lineWidth = 1;
            ctx.strokeRect(pos.x - 6, pos.y - 6, 12, 12);
        } else if (this.type === "component") {
            // Blue component
            ctx.fillStyle = "#4488ff";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === "dust") {
            // Dust particles
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 3 * this.scale, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === "spark") {
            // Spark particle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2 * this.scale, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    isAlive() {
        return this.life > 0;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, vx, vy, life, type = "resource", color = "#ffff88") {
        this.particles.push(new Particle(x, y, vx, vy, life, type, color));
    }

    // Emit multiple particles in a spread pattern
    emitBurst(x, y, count, speed, life, type = "resource", color = "#ffff88") {
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const s = speed + (Math.random() - 0.5) * speed * 0.5;
            const vx = Math.cos(angle) * s;
            const vy = Math.sin(angle) * s;
            this.emit(x, y, vx, vy, life, type, color);
        }
    }

    update(delta) {
        this.particles = this.particles.filter(p => {
            p.update(delta);
            return p.isAlive();
        });
    }

    draw(renderer) {
        for (const particle of this.particles) {
            particle.draw(renderer, renderer.camera);
        }
    }

    clear() {
        this.particles = [];
    }
}

// Global particle system instance
export const globalParticleSystem = new ParticleSystem();
