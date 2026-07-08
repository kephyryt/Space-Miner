// ===========================================
// Space Miner
// HUD Manager
// ===========================================

export class HUDManager {
    constructor(world) {
        this.world = world;
        
        // Display values for smooth animation
        this.displayMoney = 0;
        this.displayOre = 0;
        this.displayPlates = 0;
        this.displayComponents = 0;
        this.displayResearch = 0;
        
        // Animation speed (0 to 1, higher = faster)
        this.animationSpeed = 0.15;
        
        this.createHUDElements();
    }

    createHUDElements() {
        const hud = document.getElementById("hud");
        hud.innerHTML = `
            <div class="hud-title">SPACE MINER</div>
            <div class="hud-section">
                <div class="hud-stat">
                    <span class="hud-label">Money:</span>
                    <span class="hud-value" id="hud-money">$0</span>
                </div>
                <div class="hud-stat">
                    <span class="hud-label">Ore:</span>
                    <span class="hud-value" id="hud-ore">0</span>
                </div>
            </div>
            <div class="hud-section">
                <div class="hud-stat">
                    <span class="hud-label">Plates:</span>
                    <span class="hud-value" id="hud-plates">0</span>
                </div>
                <div class="hud-stat">
                    <span class="hud-label">Components:</span>
                    <span class="hud-value" id="hud-components">0</span>
                </div>
            </div>
            <div class="hud-section">
                <div class="hud-stat">
                    <span class="hud-label">Research:</span>
                    <span class="hud-value" id="hud-research">0</span>
                </div>
                <div class="hud-stat">
                    <span class="hud-label">FPS:</span>
                    <span class="hud-value" id="hud-fps">60</span>
                </div>
            </div>
            <div class="hud-section">
                <div class="hud-stat">
                    <span class="hud-label">Zoom:</span>
                    <span class="hud-value" id="hud-zoom">1.00x</span>
                </div>
            </div>
        `;
    }

    // Smooth number interpolation
    smoothValue(current, target, speed) {
        const diff = target - current;
        if (Math.abs(diff) < 1) return target;
        return current + diff * speed;
    }

    update() {
        // Animate counter values
        this.displayMoney = this.smoothValue(this.displayMoney, this.world.money, this.animationSpeed);
        this.displayOre = this.smoothValue(this.displayOre, this.world.ore, this.animationSpeed);
        this.displayPlates = this.smoothValue(this.displayPlates, this.world.resources.get("ironPlate"), this.animationSpeed);
        this.displayComponents = this.smoothValue(this.displayComponents, this.world.resources.get("component"), this.animationSpeed);
        this.displayResearch = this.smoothValue(this.displayResearch, this.world.research, this.animationSpeed);
        
        // Update display
        document.getElementById("hud-money").textContent = "$" + Math.floor(this.displayMoney);
        document.getElementById("hud-ore").textContent = Math.floor(this.displayOre);
        document.getElementById("hud-plates").textContent = Math.floor(this.displayPlates);
        document.getElementById("hud-components").textContent = Math.floor(this.displayComponents);
        document.getElementById("hud-research").textContent = Math.floor(this.displayResearch);
    }

    updateFPS(fps) {
        document.getElementById("hud-fps").textContent = Math.round(fps);
    }

    updateZoom(zoom) {
        document.getElementById("hud-zoom").textContent = zoom.toFixed(2) + "x";
    }
}
