// ===========================================
// Space Miner
// Camera System
// Handles movement and zoom
// ===========================================

export class Camera {

    constructor(canvas) {

        this.canvas = canvas;

        // World position
        this.x = 0;
        this.y = 0;

        // Zoom level
        this.zoom = 1;
        
        // Target zoom for easing
        this.targetZoom = 1;
        this.zoomEasingSpeed = 0.15; // Lower = smoother, higher = snappier

        // Zoom limits
        this.minZoom = 0.1;
        this.maxZoom = 5;

        // Movement
        this.dragging = false;

        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.setupControls();

    }

    setupControls() {

        // Zoom with mouse wheel
        window.addEventListener(
            "wheel",
            (event) => {

                event.preventDefault();

                const zoomAmount =
                event.deltaY > 0
                ? 0.9
                : 1.1;

                this.targetZoom *= zoomAmount;

                this.targetZoom =
                Math.max(
                    this.minZoom,
                    Math.min(
                        this.maxZoom,
                        this.targetZoom
                    )
                );

            }
        );

        // Click and drag camera movement
        this.canvas.addEventListener(
            "mousedown",
            (event) => {

                this.dragging = true;

                this.lastMouseX =
                event.clientX;

                this.lastMouseY =
                event.clientY;

            }
        );

        window.addEventListener(
            "mouseup",
            () => {

                this.dragging = false;

            }
        );

        window.addEventListener(
            "mousemove",
            (event) => {

                if (!this.dragging)
                    return;

                const dx =
                event.clientX -
                this.lastMouseX;

                const dy =
                event.clientY -
                this.lastMouseY;

                this.x -=
                dx / this.zoom;

                this.y -=
                dy / this.zoom;

                this.lastMouseX =
                event.clientX;

                this.lastMouseY =
                event.clientY;

            }
        );

    }

    // Update camera easing (call from main loop)
    update(delta) {
        // Smooth zoom easing
        const zoomDiff = this.targetZoom - this.zoom;
        if (Math.abs(zoomDiff) > 0.001) {
            this.zoom += zoomDiff * this.zoomEasingSpeed;
        } else {
            this.zoom = this.targetZoom;
        }
    }



    // Convert world coordinates
    // into screen coordinates

    worldToScreen(x, y) {

        return {

            x:
            (x - this.x) *
            this.zoom +
            this.canvas.width / 2,


            y:
            (y - this.y) *
            this.zoom +
            this.canvas.height / 2

        };

    }

}
