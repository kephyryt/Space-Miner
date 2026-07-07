// ===========================================
// Space Miner
// Iron Mine
// ===========================================

import { ResourceBuilding } from "./resourceBuilding.js";


export class Mine extends ResourceBuilding {


    constructor(x,y){


        super(
            x,
            y,
            "Iron Mine"
        );


        this.cost =
        100;


    }




    upgrade(){


        super.upgrade();


        this.cost *= 2;


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
        "#555";



            ctx.beginPath();


            ctx.arc(
                pos.x,
                pos.y,
                45,
                0,
                Math.PI*2
            );


            ctx.fill();



            ctx.fillStyle =
            "white";


        ctx.fillText(

            "⛏ Mine Lv."
            +
            this.level,

            pos.x-35,
            pos.y-55

        );



    }


}
