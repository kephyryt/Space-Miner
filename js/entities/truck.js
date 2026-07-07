// ===========================================
// Space Miner
// Truck
// ===========================================

export class Truck {


    constructor(x,y,mine,hq){


        this.x=x;
        this.y=y;


        this.mine=mine;

        this.hq=hq;



        this.speed=100;



        this.capacity=10;


        this.cargo=0;


        this.state="toMine";


    }





    moveTo(target,delta){


        const dx =
        target.x-this.x;


        const dy =
        target.y-this.y;


        const distance =
        Math.sqrt(
            dx*dx+
            dy*dy
        );



        if(distance > 5){


            this.x +=
            dx/distance *
            this.speed *
            delta;


            this.y +=
            dy/distance *
            this.speed *
            delta;


            return false;


        }


        return true;


    }





    update(delta){



        if(this.state==="toMine"){


            if(this.moveTo(this.mine,delta)){


                this.cargo =
                Math.min(
                    this.capacity,
                    this.mine.storage
                );


                this.mine.storage -=
                this.cargo;



                this.state="toHQ";


            }


        }



        else if(this.state==="toHQ"){


            if(this.moveTo(this.hq,delta)){


                this.hq.storage +=
                this.cargo;


                this.cargo=0;


                this.state="toMine";


            }


        }



    }





    draw(renderer){


        const pos =
        renderer.camera.worldToScreen(
            this.x,
            this.y
        );


        const ctx =
        renderer.ctx;



        ctx.fillStyle =
        "#ffaa00";


        ctx.fillRect(
            pos.x-12,
            pos.y-8,
            24,
            16
        );


    }


}
