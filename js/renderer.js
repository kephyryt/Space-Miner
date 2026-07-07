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
                            Math.random()

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



            const pos =
            this.camera.worldToScreen(
                star.x,
                star.y
            );



            const pulse =
            (
                Math.sin(
                    time+
                    star.brightness*10
                )
                +1
            )
            /
            2;



            ctx.fillStyle =
            `rgba(255,255,255,${
                0.3+
                pulse*0.7
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



        // glow


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



        ctx.fillStyle =
        "#1769ff";


        ctx.fillRect(
            pos.x-radius,
            pos.y-radius,
            radius*2,
            radius*2
        );



        // continents


        ctx.fillStyle =
        "#39b54a";



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



        // clouds


        ctx.strokeStyle =
        "rgba(255,255,255,0.4)";


        ctx.lineWidth =
        4;



        ctx.beginPath();


        ctx.arc(
            pos.x,
            pos.y,
            radius*0.75,
            0,
            Math.PI
        );


        ctx.stroke();



        ctx.restore();


    }





    render(){


        this.clear();


        this.drawStars();


        this.drawEarth();


    }


}
