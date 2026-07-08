// ===========================================
// Space Miner
// Main
// ===========================================


import { Renderer } from "./renderer.js";
import { Camera } from "./camera.js";
import { World } from "./world.js";
import { UILayout } from "./uiLayout.js";
import { Construction } from "./construction.js";
import { SaveSystem } from "./save.js";
import { Tutorial } from "./tutorial.js";
import { ObjectiveManager } from "./objectives.js";
import { globalAnimationSystem } from "./systems/animationSystem.js";
import { globalParticleSystem } from "./systems/particleSystem.js";



const canvas =
document.getElementById(
    "gameCanvas"
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

let world, construction, ui;

try {
    world =
    new World();

    construction =
    new Construction(
        world
    );

    ui =
    new UILayout(
        world,
        construction
    );

    // Expose to window for global access
    window.construction = construction;
    window.ui = ui;
    console.log("UI initialized successfully!");
} catch (error) {
    console.error("Initialization error:", error);
    console.error("Stack:", error.stack);
    window.__initError = error;
    throw error; // Re-throw to prevent further execution
}

const saveSystem = new SaveSystem(world);
saveSystem.load();

const tutorial = new Tutorial();
const objectives = new ObjectiveManager(world);

// Show tutorial on first load
setTimeout(() => tutorial.show(), 500);





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

            ui.showBuildingInspector(
                object
            );

        }
        else{

            ui.clearSelection();

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


        globalAnimationSystem.update(delta);
        camera.update(delta);

        world.update(delta);



        renderer.render();


        world.draw(renderer);

        globalParticleSystem.draw(renderer);



        //
        // HUD updates
        //

        ui.updateFPS(1/delta);
        ui.updateZoom(camera.zoom);
        ui.update();
        objectives.update();



//
// Auto-save periodically
//

setInterval(() => saveSystem.save(), 5000);

requestAnimationFrame(
    loop
);


    }



    requestAnimationFrame(
        loop
    );
