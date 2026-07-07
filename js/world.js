// ===========================================
// Space Miner
// World
// ===========================================


import { Mine } from "./entities/mine.js";
import { Truck } from "./entities/truck.js";
import { Building } from "./entities/building.js";



export class World {


    constructor(){


        this.money =
        1000;


        this.ore =
        0;



        this.hq =
        new Building(
            0,
            0,
            "Mining HQ"
        );



        this.mines = [];



        const startingMine =
        new Mine(
            500,
            100
        );


        this.mines.push(
            startingMine
        );



        this.trucks = [];



        this.truck =
        new Truck(
            0,
            0,
            startingMine,
            this.hq
        );



        this.objects = [

            this.hq,

            startingMine

        ];



    }





    update(delta){



        for(
            const mine of this.mines
        ){

            mine.update(delta);

        }



        this.truck.update(delta);




        if(
            this.hq.storage > 0
        ){


            this.hq.storage--;


            this.ore++;


            this.money += 10;


        }



    }





    draw(renderer){



        for(
            const object of this.objects
        ){

            object.draw(renderer);

        }



        this.truck.draw(renderer);



    }





    getObjectAt(x,y){



        for(
            const object of this.objects
        ){



            if(
                Math.hypot(
                    object.x-x,
                    object.y-y
                )
                <
                80
            ){

                return object;

            }


        }


        return null;


    }


}
