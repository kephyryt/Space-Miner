// ===========================================
// Space Miner
// Construction System
// ===========================================


import { Mine } from "./entities/mine.js";



export class Construction {


    constructor(world){


        this.world =
        world;


        this.mode =
        null;


        this.costs = {

            mine: 250

        };


    }





    select(type){


        this.mode =
        type;


    }





    cancel(){


        this.mode =
        null;


    }





    place(x,y){


        if(!this.mode)
            return;



        if(this.mode === "mine"){


            if(
                this.world.money >=
                this.costs.mine
            ){


                this.world.money -=
                this.costs.mine;



                const mine =
                new Mine(
                    x,
                    y
                );



                this.world.objects.push(
                    mine
                );


                this.world.mines.push(
                    mine
                );


            }


        }



        this.cancel();


    }


}
