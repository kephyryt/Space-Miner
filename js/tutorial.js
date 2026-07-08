// ===========================================
// Space Miner
// Tutorial System
// ===========================================

export class Tutorial {
    constructor() {
        this.shown = localStorage.getItem("spaceMiner_tutorialShown") === "true";
        this.currentStep = 0;
        this.steps = [
            {
                title: "Welcome to Space Miner!",
                content: "You are the manager of an automated mining operation. Build mines, warehouses, smelters, and more to create an efficient production chain.",
                hint: "Click 'Next' to continue"
            },
            {
                title: "Your First Mine",
                content: "Click on the Mining HQ (gray square in center) to see building options. Mines extract ore from the ground - it's your basic resource.",
                hint: "Each mine produces 5 ore/sec"
            },
            {
                title: "Storing Resources",
                content: "Build a Warehouse to store ore and convert it into money! Each ore sells for $10 in the warehouse.",
                hint: "Warehouses are your primary income"
            },
            {
                title: "Automate with Trucks",
                content: "Trucks automatically move resources from mines to warehouses. They'll pick up ore and deliver it for you - fully automatic!",
                hint: "Trucks work while you sleep"
            },
            {
                title: "Advanced Processing",
                content: "Once you have money, build Smelters to convert ore into plates, Assemblers to make components, and Research Labs to unlock new tech!",
                hint: "Create complex production chains"
            },
            {
                title: "You're Ready!",
                content: "Start by clicking the Mining HQ and building your first mine. Expand your operation and maximize your profits!",
                hint: "Go forth and automate!"
            }
        ];
    }

    show() {
        if (this.shown) return;
        this.render();
    }

    render() {
        const overlay = document.createElement("div");
        overlay.id = "tutorialOverlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const modal = document.createElement("div");
        modal.style.cssText = `
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 40px;
            max-width: 600px;
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
            color: #fff;
            font-family: monospace;
        `;

        const title = document.createElement("h1");
        title.textContent = this.steps[this.currentStep].title;
        title.style.cssText = `
            color: #00d4ff;
            margin: 0 0 20px 0;
            font-size: 28px;
        `;

        const content = document.createElement("p");
        content.textContent = this.steps[this.currentStep].content;
        content.style.cssText = `
            color: #ccc;
            margin: 0 0 20px 0;
            line-height: 1.6;
            font-size: 16px;
        `;

        const hint = document.createElement("p");
        hint.textContent = "💡 " + this.steps[this.currentStep].hint;
        hint.style.cssText = `
            color: #00ff88;
            margin: 0 0 30px 0;
            font-size: 14px;
            font-style: italic;
        `;

        const buttons = document.createElement("div");
        buttons.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        `;

        const skipBtn = document.createElement("button");
        skipBtn.textContent = "Skip Tutorial";
        skipBtn.style.cssText = `
            padding: 10px 20px;
            background: #333;
            border: 1px solid #666;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
            transition: all 0.2s;
        `;
        skipBtn.onmouseover = () => skipBtn.style.background = "#444";
        skipBtn.onmouseout = () => skipBtn.style.background = "#333";
        skipBtn.onclick = () => this.close(overlay);

        const nextBtn = document.createElement("button");
        nextBtn.textContent = this.currentStep === this.steps.length - 1 ? "Start Game" : "Next →";
        nextBtn.style.cssText = `
            padding: 10px 20px;
            background: linear-gradient(135deg, #00d4ff 0%, #0088ff 100%);
            border: none;
            color: #000;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
            font-weight: bold;
            transition: all 0.2s;
        `;
        nextBtn.onmouseover = () => nextBtn.style.transform = "translateY(-2px)";
        nextBtn.onmouseout = () => nextBtn.style.transform = "translateY(0)";
        nextBtn.onclick = () => {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                overlay.innerHTML = "";
                this.render();
            } else {
                this.close(overlay);
            }
        };

        buttons.appendChild(skipBtn);
        buttons.appendChild(nextBtn);

        modal.appendChild(title);
        modal.appendChild(content);
        modal.appendChild(hint);
        modal.appendChild(buttons);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    close(overlay) {
        localStorage.setItem("spaceMiner_tutorialShown", "true");
        overlay.remove();
    }
}
