
let userProfileIcon = document.querySelector(".user-profile");
let profileVisible = false;
userProfileIcon.addEventListener("click", function(e) {
    if(profileVisible) {
        document.querySelector(".user-profile-info-container").style.display = "none";
        profileVisible = false;
    }else {
        profileVisible = true;
        document.querySelector(".user-profile-info-container").style.display = "flex";
        }
    
});

function addCloseDivOfInput() {
    let noteCretorDiv = document.querySelector(".note-creator-item");
    noteCretorDiv.addEventListener("click", function(e) {
        noteCretorDiv.remove();
        let div = document.createElement("div");
        div.classList.add("note-creator-item-with-input");
        div.innerHTML = `<Form action="/dashboard" method="post">
                        <div class="note-creator-div-title" contenteditable="true">Title</div>
                        <div class="note-creator-div-note">
                            <input type="text" style="display: none;" name="title" id="note-title" />
                            <textarea class="form-control" placeholder="Take a note..." id="floatingTextarea" name="content"></textarea>
                        </div>
                        <div class="note-creator-div-icons">
                            <button class="save-note-btn icon-btn" type="submit">Save</button>
                            <button class="close-note-creator-div icon-btn">Close</button>
                        </div>
                        </form>`

        document.querySelector(".note-creator-div").append(div);
        addCloseInputDiv();
    });
}

addCloseDivOfInput();

function addCloseInputDiv() {
    let closeNoteDiv = document.querySelector(".close-note-creator-div");
    closeNoteDiv.addEventListener("click", function() {
        let closeNoteDivParent = closeNoteDiv.parentElement.parentElement.parentElement;
        closeNoteDivParent.remove();
        let div = document.createElement("div");
        div.classList.add("note-creator-item");
        div.innerHTML = `Take a note......
        <div class="add-btn"><i class="fas fa-plus"></i></div>`;
        document.querySelector(".note-creator-div").append(div);

        addCloseDivOfInput();
    });

    let saveNoteBtn = document.querySelector(".save-note-btn");
    saveNoteBtn.addEventListener("click", function(e) {
        let text = document.querySelector(".note-creator-div-title").innerText;
        document.getElementById("note-title").value = text;
    });
}



let noteDivs = document.querySelectorAll('.note-content');
for(let i=0;i<noteDivs.length;i++) {
    let str = noteDivs[i].innerText;
    if(str.length >= 200) {
        noteDivs[i].innerText = noteDivs[i].innerText.substring(0,200) + ".......";
    }
    
}

let noteDivsTitles = document.querySelectorAll('.note-title-cutted');
for(let i=0;i<noteDivsTitles.length;i++) {
    let str = noteDivsTitles[i].innerText;
    if(str.length >= 50) {
        noteDivsTitles[i].innerText = noteDivsTitles[i].innerText.substring(0,50) + ".......";
    }
    
}


let allNoteDivs = document.querySelectorAll(".note");
for(let i = 0; i < allNoteDivs.length; i++) {
    allNoteDivs[i].addEventListener("mouseover", function(e) {
        e.currentTarget.querySelector(".note-options").style.display = "flex";
    });

    allNoteDivs[i].addEventListener("mouseout", function(e) {
        e.currentTarget.querySelector(".note-options").style.display = "none";
    });

    allNoteDivs[i].addEventListener("click", function(e) {
        let noteTitle = allNoteDivs[i].querySelector(".note-title").innerText;
        let noteContent = allNoteDivs[i].querySelector(".note-content-full").innerText;
        let noteId = allNoteDivs[i].id;
        let noteColor = allNoteDivs[i].classList[1];
        
        let editNoteModal = document.querySelector("#edit-note");
        let currentModalBody = editNoteModal.querySelector(".modal-body");
        let titleTextArea =  editNoteModal.querySelector("#edit-note-title");
        let contentTextArea =  editNoteModal.querySelector("#edit-note-content");

        removeOldClassStyle(currentModalBody, 1);
        removeOldClassStyle(titleTextArea, 1);
        removeOldClassStyle(contentTextArea, 1);

        titleTextArea.value = noteTitle;
        contentTextArea.value = noteContent;
        editNoteModal.querySelector("#edit-note-id").value = noteId;

        currentModalBody.classList.add(noteColor);
        titleTextArea.classList.add(noteColor);
        contentTextArea.classList.add(noteColor);
    });
}


let modalNoteSaveBtn = document.querySelector(".edit-note-save-btn");
modalNoteSaveBtn.addEventListener("click", function(e) {
    document.getElementById("edit-note-submit-btn").click();
});

let shareModalShareBtn = document.querySelector(".share-note-save-btn");
shareModalShareBtn.addEventListener("click", function(e) {
    document.getElementById("share-note-submit-btn").click();
});

let noteShareBtns = document.querySelectorAll(".share-btn-on-note");
for(let i = 0; i < noteShareBtns.length; i++) {
    noteShareBtns[i].addEventListener("click", function(e) {
        let noteId = e.currentTarget.parentElement.parentElement.id;
        let userId = document.getElementById("userId").value;
        document.getElementById("share-note-id").value = noteId;
        document.querySelector(".share-note-copy-link-container-copy-btn").innerText = "Copy";
        
        //adding logic for checking Note share or edit access
        let shareBtnParent = e.currentTarget.parentElement.parentElement;
        let notePublic = shareBtnParent.querySelector(".notePublicOrNot").value;
        let noteEditAcces = shareBtnParent.querySelector(".noteEditOrNot").value;

        if(notePublic === "true") {
            document.querySelector(".share-note-item-copy-link").style.display = "flex";
            document.getElementById("share-note-public").checked = true;
            document.querySelector(".share-note-copy-link-container-link").innerText = "http://localhost:3000/shared/" + userId + "/" + noteId;
            document.getElementById("share-note-editAcces").disabled = false;
            if(noteEditAcces === "true") {
                document.getElementById("share-note-editAcces").checked = true;
            }else {
                document.getElementById("share-note-editAcces").checked = false;
            }
        }else {
            document.querySelector(".share-note-item-copy-link").style.display = "none";
            document.getElementById("share-note-public").checked = false;
        }
    });
}

let noteDeleteBtns = document.querySelectorAll(".delete-btn-on-note");
for(let i = 0; i < noteDeleteBtns.length; i++) {
    noteDeleteBtns[i].addEventListener("click", function(e) {
        let noteId = e.currentTarget.parentElement.parentElement.id;
        document.getElementById("delete-note-id").value = noteId;
    });
}

let modalDeleteNoteBtn = document.querySelector(".modal-delete-note-btn");
modalDeleteNoteBtn.addEventListener("click", function(e) {
    document.getElementById("delete-note-submit-btn").click();
});

let shareNotePublicBtn = document.getElementById("share-note-public");
shareNotePublicBtn.addEventListener("change", function(e) {
    if(e.currentTarget.checked) {
        document.getElementById("share-note-editAcces").disabled = false;
    }else {
        document.getElementById("share-note-editAcces").checked = false;
        document.getElementById("share-note-editAcces").disabled = true;
    }
    
});



//setting theme
let allCOlorBtnOnNote = document.querySelectorAll(".color-btn-on-note");
for(let i = 0; i < allCOlorBtnOnNote.length; i++) {
    allCOlorBtnOnNote[i].addEventListener("click", function(e) {
        let noteParentEle = e.currentTarget.parentElement.parentElement;
        let noteId = noteParentEle.id;
        let noteTitle = noteParentEle.querySelector(".note-title-cutted").innerText;
        let noteContent = noteParentEle.querySelector(".note-content").innerText;
        let noteDefaultColor = e.currentTarget.parentElement.parentElement.classList[1];
        let themeModal = document.getElementById("themeModal");
        themeModal.querySelector(".theme-modal-title").innerText = noteTitle;
        themeModal.querySelector(".theme-modal-content").innerText = noteContent;
        let themeModalBody = themeModal.querySelector(".modal-body");
        themeModal.querySelector(".theme-modal-formid").value = noteId;
        
        let themeModalColorContainer = themeModalBody.querySelector("." + noteDefaultColor);
        themeModalColorContainer.click();
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


        //changing color of div
        let themeBtnParentElementOfmodal = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
        let themeBtnParentElementOfmodalHeader = themeBtnParentElementOfmodal.querySelector(".modal-header");
        let colorCLass = e.currentTarget.classList[1];
        
        removeOldClassStyle(themeBtnParentElementOfmodalHeader, 2);
        
        themeBtnParentElementOfmodalHeader.classList.add(colorCLass);
        document.querySelector(".theme-modal-color").value = colorCLass;
    });
}


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
 

//submitting themeModalform
let themeModalSaveBtn = document.querySelector(".theme-modal-save-btn");
themeModalSaveBtn.addEventListener("click", function(e) {
    document.querySelector(".theme-modal-submit-btn").click();
});


function copyFunc() {
	let text = document.querySelector(".share-note-copy-link-container-link").innerText;
    document.querySelector(".share-note-copy-link-container-copy-btn").innerText = "Copied";
	navigator.clipboard.writeText(text);
}


var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
