
let editNoteSaveBtn = document.querySelector(".edit-note-save-btn");
editNoteSaveBtn.addEventListener("click" ,function(e) {
    document.querySelector("#edit-note-submit-btn").click();
});

let themeOpenBtn = document.querySelector(".shared-note-options-item-themes");
let themeDivOpen = false;
if(themeOpenBtn != null) {
    themeOpenBtn.addEventListener("click", function(e) {
        if(themeDivOpen) {
            themeDivOpen = false;
            document.querySelector(".shared-note-themes").style.display = "none";
        }else {
            themeDivOpen = true;
            document.querySelector(".shared-note-themes").style.display = "block";
    
            let noteElement = e.currentTarget.parentElement.parentElement;
            let parentColor = noteElement.classList[3];
            let themesDiv = document.querySelector(".shared-note-themes");
    
            themesDiv.querySelector("." + parentColor).click();
        }
        
    });
}





let allThemeBtns = document.querySelectorAll(".note-theme-color");
for(let i = 0; i < allThemeBtns.length; i++) {
    allThemeBtns[i].addEventListener("click", function(e) {
        let themeBtnParentElement = e.currentTarget.parentElement;
        let allIndicators = themeBtnParentElement.querySelectorAll(".note-color-choosed-indicator");
        for(let j = 0; j < allIndicators.length; j++) {
            allIndicators[j].style.display = "none";
        }
        e.currentTarget.querySelector(".note-color-choosed-indicator").style.display = "flex";


        // changing color of note
        let noteDiv = document.querySelector(".shared-note");
        let colorCLass = e.currentTarget.classList[1];
        
        removeOldClassStyle(noteDiv, 3);

        document.querySelector(".theme-modal-color").value = colorCLass;
        noteDiv.classList.add(colorCLass);
    });
}


let closeThemeDivBtn = document.getElementById("close-theme-div");
closeThemeDivBtn.addEventListener("click", function(e) {
    let themeDiv = e.currentTarget.parentElement.parentElement;
    themeDivOpen = false;
    themeDiv.style.display = "none";
});

let themeColorSaveBtn = document.getElementById("save-theme-color");
themeColorSaveBtn.addEventListener("click", function(e) {
    document.querySelector(".theme-modal-submit-btn").click();
});


function removeOldClassStyle(container, i) {
    if(container.classList[i] === "pink") {
        container.classList.remove("pink");
    }else if(container.classList[i] === "blue") {
        container.classList.remove("blue");
    }else if(container.classList[i] === "green") {
        container.classList.remove("green");
    }else if(container.classList[i] === "red") {
        container.classList.remove("red");
    }else if(container.classList[i] === "orange") {
        container.classList.remove("orange");
    }else if(container.classList[i] === "yellow") {
        container.classList.remove("yellow");
    }else if(container.classList[i] === "light") {
        container.classList.remove("light");
    }else if(container.classList[i] === "white") {
        container.classList.remove("white");
    }else if(container.classList[i] === "black") {
        container.classList.remove("black");
    }
}