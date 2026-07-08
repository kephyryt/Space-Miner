// ===========================================
// Space Miner
// Objectives System with Chapters
// ===========================================

export class ObjectiveManager {
    constructor(world) {
        this.world = world;
        
        // Organize objectives into chapters
        this.chapters = [
            {
                id: "chapter_1",
                title: "Chapter I: First Steps",
                description: "Learn the basics of resource management",
                objectives: [
                    {
                        id: "first_ore",
                        title: "Extract Your First Ore",
                        description: "Mining HQ already has a mine. Watch it work.",
                        completed: false,
                        reward: "500 XP",
                        check: () => (this.world.resources.get("ironOre") || 0) >= 1
                    },
                    {
                        id: "first_warehouse",
                        title: "Build a Warehouse",
                        description: "Warehouses convert ore into money at $10/ore",
                        completed: false,
                        reward: "Warehouse unlocked",
                        check: () => this.world.warehouses && this.world.warehouses.length > 0
                    },
                    {
                        id: "first_money",
                        title: "Earn Your First $100",
                        description: "Get a warehouse running and convert ore to money",
                        completed: false,
                        reward: "$100 bonus",
                        check: () => this.world.money >= 100
                    }
                ]
            },
            {
                id: "chapter_2",
                title: "Chapter II: Advanced Production",
                description: "Expand your factory with new buildings",
                objectives: [
                    {
                        id: "first_smelter",
                        title: "Build a Smelter",
                        description: "Converts ore into metal plates (1 ore → 1 plate)",
                        completed: false,
                        reward: "Smelter unlocked",
                        check: () => this.world.objects && this.world.objects.some(o => o.name === "Smelter")
                    },
                    {
                        id: "produce_plates",
                        title: "Produce 10 Metal Plates",
                        description: "Make a productive smelting chain",
                        completed: false,
                        reward: "1000 XP",
                        check: () => (this.world.resources.get("ironPlate") || 0) >= 10
                    },
                    {
                        id: "first_assembler",
                        title: "Build an Assembler",
                        description: "Combine plates into components",
                        completed: false,
                        reward: "Assembler unlocked",
                        check: () => this.world.objects && this.world.objects.some(o => o.name === "Assembler")
                    }
                ]
            },
            {
                id: "chapter_3",
                title: "Chapter III: Knowledge & Research",
                description: "Unlock future technologies",
                objectives: [
                    {
                        id: "first_lab",
                        title: "Build a Research Lab",
                        description: "Generate research points to unlock tech",
                        completed: false,
                        reward: "Research unlocked",
                        check: () => this.world.objects && this.world.objects.some(o => o.name === "Research Lab")
                    },
                    {
                        id: "first_research",
                        title: "Generate 50 Research Points",
                        description: "Invest in your empire's future",
                        completed: false,
                        reward: "2000 XP",
                        check: () => (this.world.research || 0) >= 50
                    },
                    {
                        id: "reach_10k",
                        title: "Reach $10,000 in Cash",
                        description: "Build a profitable empire",
                        completed: false,
                        reward: "Milestone achieved!",
                        check: () => this.world.money >= 10000
                    }
                ]
            }
        ];

        // Flatten all objectives for easy access
        this.allObjectives = [];
        this.chapters.forEach(ch => {
            this.allObjectives.push(...ch.objectives);
        });

        this.panelElement = null;
        this.currentChapter = 0;
        this.createPanel();
    }

    createPanel() {
        const panel = document.createElement("div");
        panel.id = "objectivePanel";
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 320px;
            background: linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);
            color: #fff;
            font-family: monospace;
            max-height: 450px;
            overflow-y: auto;
            z-index: 100;
        `;

        this.panelElement = panel;
        document.body.appendChild(panel);
        this.updatePanel();
    }

    updatePanel() {
        const panel = this.panelElement;
        panel.innerHTML = "";

        // Find current active chapter
        let activeChapter = this.chapters[0];
        for (const chapter of this.chapters) {
            const hasIncomplete = chapter.objectives.some(obj => !obj.completed);
            if (hasIncomplete) {
                activeChapter = chapter;
                break;
            }
        }

        // Chapter header
        const header = document.createElement("div");
        header.style.cssText = `
            color: #00d4ff;
            font-weight: bold;
            margin-bottom: 12px;
            font-size: 14px;
            border-bottom: 1px solid #00d4ff;
            padding-bottom: 8px;
        `;
        header.textContent = "📋 " + activeChapter.title;

        const desc = document.createElement("div");
        desc.style.cssText = `
            color: #88aaff;
            font-size: 11px;
            margin-bottom: 12px;
        `;
        desc.textContent = activeChapter.description;

        panel.appendChild(header);
        panel.appendChild(desc);

        // Objectives in chapter
        activeChapter.objectives.forEach((obj) => {
            const container = document.createElement("div");
            container.style.cssText = `
                padding: 8px;
                margin-bottom: 8px;
                background: rgba(0, 212, 255, 0.05);
                border-left: 3px solid ${obj.completed ? '#00ff88' : '#00d4ff'};
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            `;

            const titleEl = document.createElement("div");
            titleEl.style.cssText = `
                color: ${obj.completed ? '#00ff88' : '#00ff88'};
                font-size: 13px;
                font-weight: bold;
                margin-bottom: 3px;
            `;
            titleEl.textContent = (obj.completed ? "✅ " : "□ ") + obj.title;

            const descEl = document.createElement("div");
            descEl.style.cssText = `
                color: #aaa;
                font-size: 12px;
                margin-bottom: 3px;
            `;
            descEl.textContent = obj.description;

            const rewardEl = document.createElement("div");
            rewardEl.style.cssText = `
                color: #ffcc00;
                font-size: 11px;
                opacity: ${obj.completed ? 1 : 0.7};
            `;
            rewardEl.textContent = "🎁 " + obj.reward;

            container.appendChild(titleEl);
            container.appendChild(descEl);
            container.appendChild(rewardEl);

            if (obj.completed) {
                container.style.background = "rgba(0, 255, 136, 0.1)";
                container.style.borderLeft = "3px solid #00ff88";
            }

            panel.appendChild(container);
        });

        // Progress bar for chapter
        const progressContainer = document.createElement("div");
        progressContainer.style.cssText = `
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(0, 212, 255, 0.3);
        `;

        const completed = activeChapter.objectives.filter(o => o.completed).length;
        const total = activeChapter.objectives.length;
        const progress = Math.floor((completed / total) * 100);

        const progressText = document.createElement("div");
        progressText.style.cssText = `
            color: #00d4ff;
            font-size: 12px;
            margin-bottom: 4px;
        `;
        progressText.textContent = `Progress: ${completed}/${total}`;

        const progressBar = document.createElement("div");
        progressBar.style.cssText = `
            width: 100%;
            height: 6px;
            background: rgba(0, 212, 255, 0.2);
            border-radius: 3px;
            overflow: hidden;
        `;

        const progressFill = document.createElement("div");
        progressFill.style.cssText = `
            height: 100%;
            width: ${progress}%;
            background: linear-gradient(90deg, #00d4ff 0%, #00ff88 100%);
            transition: width 0.5s ease;
        `;

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        panel.appendChild(progressContainer);
    }

    update() {
        let anyCompleted = false;
        
        for (const obj of this.allObjectives) {
            if (!obj.completed && obj.check()) {
                obj.completed = true;
                anyCompleted = true;
            }
        }

        if (anyCompleted) {
            this.updatePanel();
        }
    }

    getProgress() {
        const completed = this.objectives.filter(o => o.completed).length;
        return { completed, total: this.objectives.length };
    }
}
