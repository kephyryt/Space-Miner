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


                const zoomAmount =
                event.deltaY > 0
                ? 0.9
                : 1.1;


                this.zoom *= zoomAmount;


                this.zoom =
                Math.max(
                    this.minZoom,
                    Math.min(
                        this.maxZoom,
                        this.zoom
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
