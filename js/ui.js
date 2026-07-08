// ===========================================
// Space Miner
// UI System
// ===========================================

import { BuildingRegistry } from "./buildingRegistry.js";

export class UI {

    constructor(construction) {
        this.construction = construction;
        this.panel = document.getElementById("buildingPanel");
        this.name = document.getElementById("buildingName");
        this.info = document.getElementById("buildingInfo");
        this.selected = null;
        this.buttons = {};
        this.upgradeButton = null;

        // Create buttons for all building types
        const types = Object.keys(BuildingRegistry.buildings);
        types.forEach((type, index) => {
            const button = document.createElement("button");
            button.style.marginTop = index === 0 ? "15px" : "8px";
            button.style.display = "none";
            button.dataset.type = type;
            button.onclick = () => this.construction.select(type);
            this.buttons[type] = button;
            this.panel.appendChild(button);
        });
    }

    showBuilding(building) {
        this.selected = building;
        this.panel.style.display = "block";
        this.update();
    }

    update() {
        if (!this.selected) return;

        const building = this.selected;
        this.name.textContent = building.name;

        // Hide all buttons
        Object.values(this.buttons).forEach(btn => btn.style.display = "none");
        if (this.upgradeButton) this.upgradeButton.style.display = "none";

        // Build info display
        let info = `<strong>${building.name}</strong><br>`;
        info += `Level: ${building.level ?? 1}<br><br>`;
        info += `Storage: ${Math.floor(building.storage ?? 0)}<br>`;
        info += `Capacity: ${Math.floor(building.capacity ?? 0)}<br>`;
        info += `Production/sec: ${Math.floor(building.production ?? 0)}<br><br>`;
        info += `${building.description ?? ""}<br><br>`;
        info += `<strong>Resources</strong><br>`;
        info += `Ore: ${Math.floor(this.construction.world.resources.get("ironOre") ?? 0)}<br>`;
        info += `Plates: ${Math.floor(this.construction.world.resources.get("ironPlate") ?? 0)}<br>`;
        info += `Components: ${Math.floor(this.construction.world.resources.get("component") ?? 0)}<br>`;
        info += `Research: ${Math.floor(this.construction.world.research ?? 0)}`;

        this.info.innerHTML = info;

        // Show appropriate buttons based on building
        if (building.name === "Mining HQ") {
            Object.entries(this.buttons).forEach(([type, button]) => {
                const def = BuildingRegistry.buildings[type];
                button.textContent = `${def.icon} ${def.name} ($${def.cost})`;
                button.style.display = "block";
            });
        }
        // Show upgrade button for buildings with upgrades
        else if (building.upgrade) {
            if (!this.upgradeButton) {
                this.upgradeButton = document.createElement("button");
                this.upgradeButton.style.marginTop = "15px";
                this.panel.appendChild(this.upgradeButton);
            }
            this.upgradeButton.textContent = "⬆️ Upgrade";
            this.upgradeButton.onclick = () => {
                building.upgrade();
                this.update();
            };
            this.upgradeButton.style.display = "block";
        }
    }

    hide() {
        this.selected = null;
        this.panel.style.display = "none";
    }
}
