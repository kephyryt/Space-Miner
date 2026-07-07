// ===========================================
// Space Miner
// Building Base
// ===========================================

export class Building {


    constructor(x,y,name){


        this.x=x;
        this.y=y;

        this.name=name;


        this.storage=0;

    }



    draw(renderer){


        const ctx =
        renderer.ctx;


        const pos =
        renderer.camera.worldToScreen(
            this.x,
            this.y
        );


        ctx.fillStyle =
        "#888";


        ctx.fillRect(
            pos.x-40,
            pos.y-40,
            80,
            80
        );


        ctx.fillStyle =
        "white";


        ctx.fillText(
            this.name,
            pos.x-35,
            pos.y-50
        );


    }


}
