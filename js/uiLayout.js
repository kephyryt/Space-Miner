// ===========================================
// Space Miner
// Modern UI Layout Manager
// ===========================================

import { BuildingRegistry } from "./buildingRegistry.js";

/**
 * UILayout manages the modern strategy game UI:
 * - Top resource bar
 * - Left collapsible sidebar
 * - Right building inspector panel
 * - Bottom build toolbar
 */
export class UILayout {
    constructor(world, construction) {
        this.world = world;
        this.construction = construction;
        this.selectedBuilding = null;
        
        // UI state
        this.sidebarOpen = true;
        this.inspectorOpen = false;
        
        // Smooth animation values
        this.displayMoney = 0;
        this.displayOre = 0;
        this.displayPlates = 0;
        this.displayComponents = 0;
        this.displayResearch = 0;
        this.animationSpeed = 0.15; // 0 to 1
        
        // DOM elements
        this.elements = {
            resourceBar: document.getElementById("topResourceBar"),
            sidebar: document.getElementById("leftSidebar"),
            sidebarContent: document.getElementById("sidebarContent"),
            sidebarToggle: document.getElementById("sidebarToggle"),
            sidebarOpen: document.getElementById("sidebarOpen"),
            inspector: document.getElementById("rightInspector"),
            inspectorTitle: document.getElementById("inspectorTitle"),
            inspectorContent: document.getElementById("inspectorContent"),
            inspectorClose: document.getElementById("inspectorClose"),
            toolbar: document.getElementById("bottomToolbar"),
            toolbarContent: document.querySelector(".toolbar-content"),
            loading: document.getElementById("loading")
        };
        
        // Initialize UI
        this.initializeEventListeners();
        this.populateToolbar();
        this.populateSidebar();
        
        // Hide loading screen
        setTimeout(() => {
            this.elements.loading.classList.add("hidden");
        }, 500);
    }

    initializeEventListeners() {
        // Sidebar toggle
        this.elements.sidebarToggle.addEventListener("click", () => this.toggleSidebar());
        this.elements.sidebarOpen.addEventListener("click", () => this.toggleSidebar());

        // Inspector close
        this.elements.inspectorClose.addEventListener("click", () => this.closeInspector());
    }

    /**
     * Populate bottom toolbar with building buttons
     */
    populateToolbar() {
        const buildings = Object.entries(BuildingRegistry.buildings);
        
        buildings.forEach(([type, def]) => {
            const btn = document.createElement("button");
            btn.className = "toolbar-btn";
            btn.title = type;
            
            const icon = document.createElement("div");
            icon.className = "toolbar-btn-icon";
            icon.textContent = def.icon;
            
            const label = document.createElement("div");
            label.className = "toolbar-btn-label";
            label.textContent = def.name.substring(0, 6);
            
            const tooltip = document.createElement("div");
            tooltip.className = "toolbar-btn-tooltip";
            tooltip.textContent = `${def.name} ($${def.cost})`;
            
            btn.appendChild(icon);
            btn.appendChild(label);
            btn.appendChild(tooltip);
            
            btn.addEventListener("click", () => {
                this.selectBuildingType(type);
            });
            
            btn.dataset.type = type;
            this.elements.toolbarContent.appendChild(btn);
        });
    }

    /**
     * Populate left sidebar with objectives/statistics
     */
    populateSidebar() {
        this.elements.sidebarContent.innerHTML = `
            <div class="sidebar-item">
                <div class="sidebar-item-title">⚙️ Production Chain</div>
                <div class="sidebar-item-desc">
                    Mine → Transport → Process → Warehouse
                </div>
                <div class="sidebar-item-status">Active 2/2 trucks</div>
            </div>
            <div class="sidebar-item">
                <div class="sidebar-item-title">📊 Statistics</div>
                <div class="sidebar-item-desc">
                    <div style="margin-top: 6px;">
                        <div>Buildings: <strong id="stat-buildings">6</strong></div>
                        <div>Trucks: <strong id="stat-trucks">2</strong></div>
                    </div>
                </div>
            </div>
            <div class="sidebar-item">
                <div class="sidebar-item-title">🎯 Next Goals</div>
                <div class="sidebar-item-desc">
                    ✓ Build warehouse<br>
                    ✓ Mine ore<br>
                    ◻ Upgrade buildings<br>
                    ◻ Expand production
                </div>
            </div>
        `;
    }

    /**
     * Toggle sidebar visibility
     */
    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        
        if (this.sidebarOpen) {
            this.elements.sidebar.classList.remove("hidden");
            this.elements.sidebarOpen.classList.remove("show");
        } else {
            this.elements.sidebar.classList.add("hidden");
            this.elements.sidebarOpen.classList.add("show");
        }
    }

    /**
     * Show building in inspector
     */
    showBuilding(building) {
        this.selectedBuilding = building;
        this.inspectorOpen = true;
        
        this.elements.inspector.classList.add("active");
        this.elements.inspectorTitle.textContent = building.name;
        
        this.updateInspectorContent();
    }

    /**
     * Close inspector panel
     */
    closeInspector() {
        this.selectedBuilding = null;
        this.inspectorOpen = false;
        this.elements.inspector.classList.remove("active");
    }

    /**
     * Update inspector content with building details
     */
    updateInspectorContent() {
        if (!this.selectedBuilding) return;

        const building = this.selectedBuilding;
        let html = "";

        // Building stats section
        html += `
            <div class="inspector-section">
                <div class="inspector-section-title">📍 Building Info</div>
                <div class="inspector-stat">
                    <span class="inspector-stat-label">Level:</span>
                    <span class="inspector-stat-value">${building.level || 1}</span>
                </div>
                <div class="inspector-stat">
                    <span class="inspector-stat-label">Type:</span>
                    <span class="inspector-stat-value">${building.name}</span>
                </div>
        `;

        // Inventory section
        if (building.inventory) {
            const total = building.inventory.getTotal();
            const fillPercent = (total / building.inventory.capacity * 100).toFixed(0);
            
            html += `
                <div class="inspector-stat">
                    <span class="inspector-stat-label">Storage:</span>
                    <span class="inspector-stat-value">${Math.floor(total)}/${Math.floor(building.inventory.capacity)}</span>
                </div>
                <div style="margin-top: 8px;">
                    <div style="height: 6px; background: rgba(0, 212, 255, 0.1); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${fillPercent}%; background: linear-gradient(90deg, #00d4ff, #00ff88); transition: width 0.3s ease;"></div>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="inspector-stat">
                    <span class="inspector-stat-label">Storage:</span>
                    <span class="inspector-stat-value">${Math.floor(building.storage || 0)}/${Math.floor(building.capacity || 0)}</span>
                </div>
            `;
        }

        html += "</div>";

        // Production section
        if (building.production && building.production > 0) {
            html += `
                <div class="inspector-section">
                    <div class="inspector-section-title">⚡ Production</div>
                    <div class="inspector-stat">
                        <span class="inspector-stat-label">Rate:</span>
                        <span class="inspector-stat-value">${(building.production || 0).toFixed(1)}/s</span>
                    </div>
                </div>
            `;
        }

        // Resources section
        html += `
            <div class="inspector-section">
                <div class="inspector-section-title">📦 Resources</div>
                <div class="inspector-stat">
                    <span class="inspector-stat-label">Ore:</span>
                    <span class="inspector-stat-value">${Math.floor(this.world.ore || 0)}</span>
                </div>
                <div class="inspector-stat">
                    <span class="inspector-stat-label">Plates:</span>
                    <span class="inspector-stat-value">${Math.floor(this.world.resources.get("ironPlate") || 0)}</span>
                </div>
                <div class="inspector-stat">
                    <span class="inspector-stat-label">Components:</span>
                    <span class="inspector-stat-value">${Math.floor(this.world.resources.get("component") || 0)}</span>
                </div>
            </div>
        `;

        // Action section
        if (building.name === "Mining HQ") {
            html += `<div class="inspector-section"><div class="inspector-section-title">🔨 Build</div>`;
            
            Object.entries(BuildingRegistry.buildings).forEach(([type, def]) => {
                html += `
                    <button class="inspector-btn" onclick="window.construction.select('${type}')">
                        ${def.icon} ${def.name} ($${def.cost})
                    </button>
                `;
            });
            
            html += "</div>";
        } else if (building.upgrade) {
            html += `
                <button class="inspector-btn" onclick="window.selectedBuilding.upgrade(); window.ui.updateInspectorContent();">
                    ⬆️ Upgrade Building
                </button>
            `;
        }

        if (building.description) {
            html += `
                <div class="inspector-section">
                    <div style="font-size: 12px; color: #a0a0a0; line-height: 1.5;">
                        ${building.description}
                    </div>
                </div>
            `;
        }

        this.elements.inspectorContent.innerHTML = html;
        
        // Expose building to window for button callbacks
        window.selectedBuilding = building;
    }

    /**
     * Select building type for construction
     */
    selectBuildingType(type) {
        this.construction.select(type);
        
        // Update toolbar button states
        document.querySelectorAll(".toolbar-btn").forEach(btn => {
            btn.classList.remove("active");
            if (btn.dataset.type === type) {
                btn.classList.add("active");
            }
        });
    }

    /**
     * Update top resource bar with smooth animations
     */
    update() {
        // Smooth value transitions
        this.displayMoney = this.smoothValue(
            this.displayMoney,
            this.world.money,
            this.animationSpeed
        );
        this.displayOre = this.smoothValue(
            this.displayOre,
            this.world.ore || 0,
            this.animationSpeed
        );
        this.displayPlates = this.smoothValue(
            this.displayPlates,
            this.world.resources.get("ironPlate") || 0,
            this.animationSpeed
        );
        this.displayComponents = this.smoothValue(
            this.displayComponents,
            this.world.resources.get("component") || 0,
            this.animationSpeed
        );
        this.displayResearch = this.smoothValue(
            this.displayResearch,
            this.world.research || 0,
            this.animationSpeed
        );

        // Update resource bar display
        document.getElementById("res-money").textContent = "$" + Math.floor(this.displayMoney);
        document.getElementById("res-ore").textContent = Math.floor(this.displayOre);
        document.getElementById("res-plates").textContent = Math.floor(this.displayPlates);
        document.getElementById("res-components").textContent = Math.floor(this.displayComponents);
        document.getElementById("res-research").textContent = Math.floor(this.displayResearch);

        // Update inspector if open
        if (this.inspectorOpen && this.selectedBuilding) {
            this.updateInspectorContent();
        }
    }

    /**
     * Update FPS display
     */
    updateFPS(fps) {
        document.getElementById("res-fps").textContent = Math.round(fps);
    }

    /**
     * Update zoom display
     */
    updateZoom(zoom) {
        document.getElementById("res-zoom").textContent = zoom.toFixed(2) + "x";
    }

    /**
     * Smooth number interpolation for animations
     */
    smoothValue(current, target, speed) {
        const diff = target - current;
        if (Math.abs(diff) < 1) return target;
        return current + diff * speed;
    }

    /**
     * Show building in inspector when clicked
     */
    showBuildingInspector(building) {
        this.showBuilding(building);
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.closeInspector();
    }
}
