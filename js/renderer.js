// ===========================================
// Space Miner
// Renderer
// ===========================================

export class Renderer {


    constructor(canvas, camera) {


        this.canvas = canvas;


        this.ctx =
        canvas.getContext("2d");


        this.camera = camera;



        this.stars = [];


        this.createStars();


        this.earthRotation = 0;

    }



    createStars() {
        for(let i = 0; i < 400; i++){
            this.stars.push({
                x:
                (Math.random()-0.5)
                * 5000,
                y:
                (Math.random()-0.5)
                * 5000,
                size:
                Math.random()*2+0.5,
                brightness:
                Math.random(),
                twinkleDuration: Math.random() * 3 + 1,
                twinkling: Math.random(),
                // Parallax layers - distant stars move slower
                parallaxDepth: Math.random() * 0.8 + 0.2
            });
        }
    }



    clear(){


        const ctx=this.ctx;



        ctx.fillStyle =
        "#02040a";


        ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


    }




    drawStars(){


        const ctx=this.ctx;



        const time =
        performance.now()
        *0.002;



        for(const star of this.stars){

            // Parallax effect - distant stars move less with camera
            const parallaxX = star.x * star.parallaxDepth;
            const parallaxY = star.y * star.parallaxDepth;

            const pos =
            this.camera.worldToScreen(
                parallaxX,
                parallaxY
            );

            // Twinkling effect
            star.twinkling += 0.02;
            if (star.twinkling > star.twinkleDuration) {
                star.twinkling = 0;
            }
            const twinklePhase = star.twinkling / star.twinkleDuration;

            const pulse =
            (
                Math.sin(
                    time+
                    star.brightness*10 +
                    twinklePhase * Math.PI
                )
                +1
            )
            /
            2;



            ctx.fillStyle =
            `rgba(255,255,255,${
                0.2+
                pulse*0.8
            })`;



            ctx.beginPath();



            ctx.arc(

                pos.x,

                pos.y,

                star.size *
                this.camera.zoom,


                0,

                Math.PI*2

            );



            ctx.fill();

            // Star glow for brighter stars
            if (pulse > 0.7) {
                ctx.fillStyle = `rgba(200,220,255,${(pulse-0.7)*0.3})`;
                ctx.beginPath();
                ctx.arc(
                    pos.x,
                    pos.y,
                    star.size * this.camera.zoom * 2,
                    0,
                    Math.PI*2
                );
                ctx.fill();
            }

        }


    }





    drawEarth(){

        const ctx=this.ctx;

        const pos =
        this.camera.worldToScreen(
            0,
            0
        );

        const radius =
        150 *
        this.camera.zoom;

        // atmosphere glow (cyan)
        ctx.beginPath();
        ctx.arc(
            pos.x,
            pos.y,
            radius+25,
            0,
            Math.PI*2
        );
        ctx.strokeStyle =
        "rgba(40, 150, 200, 0.4)";
        ctx.lineWidth = 6;
        ctx.stroke();

        // outer glow
        ctx.beginPath();
        ctx.arc(
            pos.x,
            pos.y,
            radius+15,
            0,
            Math.PI*2
        );
        ctx.strokeStyle =
        "rgba(80,200,255,0.6)";
        ctx.lineWidth =
        8;
        ctx.stroke();

        // planet
        ctx.save();

        ctx.beginPath();
        ctx.arc(
            pos.x,
            pos.y,
            radius,
            0,
            Math.PI*2
        );
        ctx.clip();

        // Ocean gradient
        const oceanGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
        oceanGradient.addColorStop(0, "#2a9fff");
        oceanGradient.addColorStop(1, "#0d47a1");
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(
            pos.x-radius,
            pos.y-radius,
            radius*2,
            radius*2
        );

        // continents
        ctx.fillStyle = "#39b54a";

        ctx.beginPath();
        ctx.arc(
            pos.x-45*this.camera.zoom,
            pos.y-30*this.camera.zoom,
            35*this.camera.zoom,
            0,
            Math.PI*2
        );
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
            pos.x+55*this.camera.zoom,
            pos.y+20*this.camera.zoom,
            45*this.camera.zoom,
            0,
            Math.PI*2
        );
        ctx.fill();

        // City lights (only at high zoom)
        if (this.camera.zoom > 0.3) {
            ctx.fillStyle = "rgba(255, 255, 200, 0.8)";
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + this.earthRotation * 0.5;
                const lightX = pos.x + Math.cos(angle) * radius * 0.5;
                const lightY = pos.y + Math.sin(angle) * radius * 0.4;
                ctx.beginPath();
                ctx.arc(lightX, lightY, Math.max(1, 2 * this.camera.zoom), 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Animated rotating clouds
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.earthRotation * 0.3);
        
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = Math.max(1, 3 * this.camera.zoom);

        ctx.beginPath();
        ctx.arc(0, 0, radius*0.75, 0, Math.PI * 0.6);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius*0.65, Math.PI, Math.PI * 1.6);
        ctx.stroke();

        ctx.restore();

        ctx.restore();

        // Update earth rotation for animation
        this.earthRotation += 0.001;
    }





    drawWorldText(text, worldX, worldY, fontSize = 16, color = "white") {
        const ctx = this.ctx;
        const pos = this.camera.worldToScreen(worldX, worldY);
        
        // For emoji icons: very minimal scaling to stay consistent at all zoom levels
        // For text labels: scale gently with zoom
        // Check if text is mostly emoji (single character or short)
        const isEmoji = text.length <= 2;
        
        let scaledFontSize;
        if (isEmoji) {
            // Emoji: nearly fixed size, very gentle scaling
            // At 0.10x: ~12px, At 1.0x: 14px, At 3.0x: ~15px
            scaledFontSize = Math.max(12, Math.min(16, fontSize * Math.pow(this.camera.zoom, 0.15)));
        } else {
            // Text labels: gentle sqrt scaling
            // At 0.10x: ~7px, At 1.0x: 16px, At 3.0x: ~27px
            scaledFontSize = Math.max(7, Math.min(28, fontSize * Math.sqrt(this.camera.zoom)));
        }
        
        ctx.save();
        ctx.font = `bold ${scaledFontSize}px monospace`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText(text, pos.x, pos.y);
        ctx.restore();
    }

    drawOrbitalRing() {
        const ctx = this.ctx;
        const pos = this.camera.worldToScreen(0, 0);
        const baseRadius = 150 * this.camera.zoom;
        const orbitRadius = baseRadius + 500 * this.camera.zoom; // Orbital ring encompassing factories
        
        // Draw bright main orbital ring
        ctx.strokeStyle = "rgba(0, 255, 200, 0.7)";
        ctx.lineWidth = Math.max(3, 5 * this.camera.zoom);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw inner bright line
        ctx.strokeStyle = "rgba(50, 255, 220, 0.6)";
        ctx.lineWidth = Math.max(2, 3 * this.camera.zoom);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, orbitRadius - 12 * this.camera.zoom, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw outer atmospheric glow
        ctx.shadowColor = "rgba(0, 255, 200, 0.5)";
        ctx.shadowBlur = Math.max(10, 20 * this.camera.zoom);
        ctx.strokeStyle = "rgba(0, 200, 220, 0.3)";
        ctx.lineWidth = Math.max(2, 4 * this.camera.zoom);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, orbitRadius + 20 * this.camera.zoom, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw animated pulsing connector nodes around the ring
        const nodeCount = 16;
        const pulse = (Math.sin(performance.now() * 0.002) + 1) / 2;
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2 + (performance.now() * 0.0001);
            const nodeX = pos.x + Math.cos(angle) * orbitRadius;
            const nodeY = pos.y + Math.sin(angle) * orbitRadius;
            
            // Node bright core with shadow
            ctx.shadowColor = "rgba(0, 255, 200, 0.8)";
            ctx.shadowBlur = Math.max(5, 10 * this.camera.zoom);
            ctx.fillStyle = `rgba(0, 255, 200, ${0.6 + pulse * 0.4})`;
            ctx.beginPath();
            ctx.arc(nodeX, nodeY, Math.max(3, 5 * this.camera.zoom), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Node glow halo
            ctx.fillStyle = `rgba(100, 255, 220, ${0.2 + pulse * 0.3})`;
            ctx.beginPath();
            ctx.arc(nodeX, nodeY, Math.max(6, 12 * this.camera.zoom), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    render(){


        this.clear();


        this.drawStars();


        this.drawEarth();

        this.drawOrbitalRing();


    }


}
