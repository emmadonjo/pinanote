//src/js/app.js

//@author Emmanuel Joshua
//@email jo4christ48@yahoo.com


import Model from "./model.js";
const model = new Model();

const pinNoteFormToggler = document.querySelector("#pinNoteFormToggler");
const searchNoteFormToggler = document.querySelector("#searchNoteFormToggler");
const closeNoteForm = document.querySelector("#closeNoteForm");
const closeSearchForm = document.querySelector("#closeSearchForm");
const root = document.querySelector("#root");
const pinNoteBtn = document.querySelector("#pinNoteBtn");
const searchNoteBtn = document.querySelector("#searchNoteBtn");
const status = document.querySelector(".status");
const pinNoteForm = document.querySelector("#pinNoteForm");
const searchNoteForm = document.querySelector("#searchNoteForm");

const toggleClass = (elem, arrayOfClasses)=>{
    //Adds or removes an elem's class
    //@param string elem
    //@param object arrayOfClasses


    if(typeof elem == undefined) throw new TypeError("Invalid elem given");

    if(!Array.isArray(arrayOfClasses)) throw new TypeError("Class must be an array");

    arrayOfClasses.forEach(klass=>{
        elem.classList.toggle(klass);
    });
};

const display = notes=>{
    //display notes from localStorage
    //@param object notes

    if(notes.length == 1){
        status.textContent = `1 Note Pinned`;
     }else if(notes.length > 1){
         status.textContent = `${notes.length} Notes Pinned`;
     }

    if(notes){
        let wrap = "";

        notes.forEach(note=>{
            wrap += `
            <div class='cols'>
                <div>
                    <h2>${note.title}</h2>
                    <div class='meta'>
                        <span>&#128306; ${note.noteDate}</span> <span>&#128336; ${note.noteTime}</span>
                    </div>
                    <p>
                        ${note.text}
                    </p>
                    <div class='controls'>
                        <span class='note-id hide'>${note.id}</span>
                        <button class='ctrls edit-note'>
                            Edit
                        </button>
                        <button class='ctrls delete-note'>
                            Delete
                        </button>
                    </div>  
                </div>
            </div>
            `;

            root.innerHTML = wrap;
        });
    }else{
        console.log("There are no notes to display");
    }
};

const validateInputs = (title, text)=>{
    //validates the title and text inputs
    //@param string title
    //@param string text
    //@return object

    let errors = [];
    if(title.trim() == "" || text.trim() == ""){
        errors.push("The title and text fields are required");
    }

    if(title.trim().length > 30){
        errors.push("Title cannot exceed 30 characters - space inclusive");
    }
    if(text.trim().length > 160){
        errors.push("Text must not exceed 100 characters - space inclusive");
    }

    if(errors.length > 0){
        return {
            "status": "error",
            "message": errors
        };
    }else{
        return {
            "status": "success"
        };
    }
};

const displayMessage = (container, messageToDislay) =>{
    //displays message to the DOM appended to the container given
    //@param string container
    //@param object messageToDisplay

    if(!Array.isArray(messageToDislay)) throw new TypeError("Message must be of the type array");

    if(typeof container == undefined) throw new TypeError("Invalid container elem given");

    let msg = "<ul>";
    
    messageToDislay.forEach(message=>{
        msg += `<li>${message}</li>`;
    });
    
    msg += "</ul>";

    container.innerHTML = msg;
};

pinNoteFormToggler.addEventListener("click", ()=>{
    toggleClass(pinNoteForm, ["hide", "form-tab"]);
    document.querySelector("#noteTitleField").focus();

});



if(closeNoteForm){
    closeNoteForm.addEventListener("click", ()=>{
        toggleClass(pinNoteForm, ["hide", "form-tab"]);
        document.querySelector("#noteTitleField").value ="";
        document.querySelector("#noteTextField").value = "";
        document.querySelector(".pinInfo").textContent = "";
    });
}
   
searchNoteFormToggler.addEventListener("click", ()=>{
    toggleClass(searchNoteForm, ["hide", "form-tab"]);
    document.querySelector("#searchNoteField").focus();

});

if(closeSearchForm){
    closeSearchForm.addEventListener("click", ()=>{
        toggleClass(searchNoteForm, ["hide", "form-tab"]);
        document.querySelector("#searchNoteField").value ="";
        document.querySelector(".searchInfo").textContent = "";
    });
}

//create new note or update a note
pinNoteBtn.addEventListener("click", e=>{
    e.preventDefault();

    //get date and time
    let currentDate = new Date();
    let year = currentDate.getUTCFullYear();
    let month = currentDate.getUTCMonth();
    let date = currentDate.getUTCDate();
    let hour = currentDate.getUTCHours();
    let minute = currentDate.getUTCMinutes();

    let noteDate = date + "-" + month + "-" + year;
    let noteTime = hour + ":" + minute;

    //get input values
    let title = document.querySelector("#noteTitleField");
    let text = document.querySelector("#noteTextField");

    //container to show error or success messages
    let container = document.querySelector(".pinInfo");

    //validate inputs
    let validate = validateInputs(title.value.trim(), text.value.trim());
    if(validate.status == "error"){
        //display error message;
        displayMessage(container, validate.message);
    }else{
        //pin or update note
        if(pinNoteBtn.textContent.toLowerCase().indexOf("update")!= -1){
            //if the button's text is update
            //update note instead
            let id = document.querySelector("#hiddenId").value;
            model.updateNote(id, title.value.trim(), text.value.trim());

            //display updated info message
            displayMessage(container, ["Note successfully updated"]);

            setTimeout(()=>{
                toggleClass(pinNoteForm, ["hide", "form-tab"]);
            }, 1000);

            //Clear the input fields
            title.value = "";
            text.value = "";

            //display current notes
            let allNotes = model.getNotes();
            
            display(allNotes);
            
        }else{
            //if the button's text isn't update
            //pin note - create new note

            //get the next id
            let id = model.getId();

            model.saveNote(id, title.value.trim(), text.value.trim(), noteDate, noteTime);
            displayMessage(container, ["Note pinned successfully"]);

            //Clear the input fields
            title.value = "";
            text.value = "";

            //focus on the title input field
            title.focus();

             //display current notes
             let allNotes = model.getNotes();
             

             display(allNotes);
        }
    }
});

//search for notes.

searchNoteBtn.addEventListener("click", e=>{
    let searchTerm = document.querySelector("#searchNoteField");
    let container = document.querySelector(".searchInfo");
    if(searchTerm.value.trim() === 'undefined' || searchTerm.value.trim()==""){
        displayMessage(container, ["Please enter a search term!"]);
        
    }else{
        let searches = model.searchNotes(searchTerm.value.trim());

        if(searches.length > 0){
            display(searches);
            searchTerm.value ="";
            toggleClass(searchNoteForm, ["hide", "form-tab"]);
            
        }else{
            displayMessage(container, ["No notes found!"]);
        }
    }

});

root.addEventListener("click", e=>{
    //initialize noteId
    let noteId;

    if(e.target.className.indexOf("edit-note") != - 1){
        //if the button click is an edit button
        
        //get the edit of the note clicked
        noteId = e.target.parentNode.querySelector(".note-id").textContent;

        //get the specific note to edit
        let note = model.getNote(parseInt(noteId));
        
        //set the title, text and id respectively
        document.querySelector("#noteTitleField").value = note.title;
        document.querySelector("#noteTextField").value = note.text;
        document.querySelector("#hiddenId").value = note.id;

        //change submit button text to Update
        document.querySelector("#pinNoteBtn").textContent = "Update";

        //display form by removing .hide class and adding .form-tab class
        toggleClass(pinNoteForm, ["hide", "form-tab"]);

    }else if(e.target.className.indexOf("delete-note") != -1){
        //if the button clicked is a delete button

        //get id of the note clicked
        noteId = e.target.parentNode.querySelector(".note-id").textContent;
        if(confirm("Are you sure you want to unpin this note?") == true){
           
            //delete note
            model.deleteNote(noteId);
            console.log("Note successfully unpinned!");
        }
        
    }
    //get all available notes
    let notes = model.getNotes();

    //display the latets notes after updating or deleting a note;
    display(notes);
});


window.addEventListener("load", ()=>{
    let notes = model.getNotes();

    if(notes){
        display(notes);
    }
});