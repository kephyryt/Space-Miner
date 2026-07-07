// ===========================================
// Space Miner
// UI System
// ===========================================


export class UI {


    constructor(construction){


        this.construction =
        construction;


        this.panel =
        document.getElementById(
            "buildingPanel"
        );


        this.name =
        document.getElementById(
            "buildingName"
        );


        this.info =
        document.getElementById(
            "buildingInfo"
        );


        this.selected = null;



        this.actionButton =
        document.createElement(
            "button"
        );


        this.actionButton.style.marginTop =
        "15px";


            this.panel.appendChild(
                this.actionButton
            );


    }





    showBuilding(building){


        this.selected =
        building;


        this.panel.style.display =
        "block";


        this.update();


    }





    update(){


        if(!this.selected)
            return;



        const building =
        this.selected;



        this.name.textContent =
        building.name;



        this.info.innerHTML = `

        Level:
        ${building.level ?? 1}

        <br><br>

        Storage:
        ${Math.floor(
            building.storage ?? 0
        )}

        <br><br>

        Production:
        ${Math.floor(
            building.production ?? 0
        )}

        <br><br>

        Capacity:
        ${Math.floor(
            building.capacity ?? 0
        )}

        `;



        // Remove old action

        this.actionButton.onclick =
        null;



        // HQ building menu

        if(building.name === "Mining HQ"){


            this.actionButton.style.display =
            "block";


        this.actionButton.textContent =
        "Build Mine ($250)";



            this.actionButton.onclick =
            () => {


                this.construction.select(
                    "mine"
                );


            };


        }


        // Mine upgrade menu

        else if(building.upgrade){



            this.actionButton.style.display =
            "block";



        this.actionButton.textContent =
        "Upgrade";



        this.actionButton.onclick =
        () => {


            building.upgrade();


            this.update();


        };


        }


        else {


            this.actionButton.style.display =
            "none";


        }


    }





    hide(){


        this.selected =
        null;


        this.panel.style.display =
        "none";


    }


}
