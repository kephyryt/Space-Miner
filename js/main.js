// ===========================================
// Space Miner
// Main
// ===========================================


import { Renderer } from "./renderer.js";
import { Camera } from "./camera.js";
import { World } from "./world.js";
import { UI } from "./ui.js";
import { Construction } from "./construction.js";



const canvas =
document.getElementById(
    "gameCanvas"
);



const fpsText =
document.getElementById(
    "fps"
);


const zoomText =
document.getElementById(
    "zoom"
);


const moneyText =
document.getElementById(
    "money"
);


const oreText =
document.getElementById(
    "ore"
);




function resize(){

    canvas.width =
    innerWidth;


    canvas.height =
    innerHeight;

}


addEventListener(
    "resize",
    resize
);


resize();



const camera =
new Camera(canvas);



const renderer =
new Renderer(
    canvas,
    camera
);



const world =
new World();



const construction =
new Construction(
    world
);



const ui =
new UI(
    construction
);





canvas.addEventListener(
    "click",
    event=>{


        const rect =
        canvas.getBoundingClientRect();



        const sx =
        event.clientX -
        rect.left;


        const sy =
        event.clientY -
        rect.top;




        const wx =
        (
            sx -
            canvas.width/2
        )
        /
        camera.zoom
        +
        camera.x;



        const wy =
        (
            sy -
            canvas.height/2
        )
        /
        camera.zoom
        +
        camera.y;




        if(construction.mode){


            construction.place(
                wx,
                wy
            );


            return;


        }




        const object =
        world.getObjectAt(
            wx,
            wy
        );



        if(object){

            ui.showBuilding(
                object
            );

        }
        else{

            ui.hide();

        }



    });




document.getElementById(
    "loading"
).style.display =
"none";



    let last =
    performance.now();



    function loop(time){



        const delta =
        (time-last)/1000;


        last=time;



        world.update(delta);



        renderer.render();


        world.draw(renderer);



        //
        // HUD updates
        //

        fpsText.textContent =
        Math.round(
            1/delta
        );


        zoomText.textContent =
        camera.zoom.toFixed(2)
        +"x";


moneyText.textContent =
"$"
+
Math.floor(
    world.money
);


oreText.textContent =
Math.floor(
    world.ore
);



//
// Selected building updates
//

ui.update();



requestAnimationFrame(
    loop
);


    }



    requestAnimationFrame(
        loop
    );
