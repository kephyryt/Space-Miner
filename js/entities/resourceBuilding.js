// ===========================================
// Space Miner
// Resource Building Base
// ===========================================

import { Building } from "./building.js";


export class ResourceBuilding extends Building {


    constructor(x, y, name) {

        super(x, y, name);


        this.level = 1;


        this.storage = 0;


        this.capacity = 100;


        this.production =
        5;


    }



    update(delta) {


        this.storage +=
        this.production *
        delta;


        if(this.storage > this.capacity){

            this.storage =
            this.capacity;

        }


    }



    upgrade(){


        this.level++;


        this.production *= 1.5;


        this.capacity *= 1.5;


    }


}
