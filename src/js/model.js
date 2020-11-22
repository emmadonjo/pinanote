// src/js/Model.js

class Model{
    getNotes(){
        let ls = localStorage.getItem("pinnedNotes");

        if(ls){
            return JSON.parse(ls);
        }else{
            return [];
        }
    }

    getNote(id){
        // return a single record
        // @param int id - specific note id
        // @return object 

        if(id){
            let notes = this.getNotes();

            if(notes){
                for(let i = 0; i < notes.length; i++){
                    if(parseInt(notes[i].id) == id){
                        
                        return notes[i];
                    }
                }
            }else{
                return [];
            }
        }else{
            return [];
        }
    }

    getId(){
        //returns the highest  available unique id
        let id = 0;
        let notes = this.getNotes();
        if(notes){
            for(let i = 0; i < notes.length; i++){
                if(parseInt(notes[i].id) > id){
                    id = parseInt(notes[i].id);
                }
            }
        }

        return id + 1;
    }

    saveNote(id, title, text, noteDate, noteTime){
        //saves a single record
        //@param int id 
        //@param string title
        //@param string text
        //@param string noteDate
        //@param string noteTime
        let notes = this.getNotes();

        if(!notes){
            notes = [];
        }

        notes.push({
            "id": id,
            "title": title,
            "text": text,
            "noteDate": noteDate,
            "noteTime": noteTime
        });

        console.log(notes);

        localStorage.setItem("pinnedNotes", JSON.stringify(notes));
    }

    updateNote(id, title, text){
        //update a particular note
        //@param int id
        //@param string title
        //@param string text

        let notes = this.getNotes();
        for(let i = 0; i < notes.length; i++){
            if(parseInt(notes[i].id) == id){
                notes[i].title = title;
                notes[i].text = text;
                console.log(`${notes[i].title}`);
                localStorage.setItem("pinnedNotes", JSON.stringify(notes));
                return true;
            }
        }

        
    }

    searchNotes(searchTerm){
        //returns notes that match the search term
        //@param string searchTerm

        let searchNotes = [];
        let notes = this.getNotes();
        console.log(notes);
        if(notes){
            for(let note = 0; note < notes.length; note++){
                if(notes[note].title.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 || notes[note].text.toLowerCase().indexOf(searchTerm.toLowerCase()) !=-1){
                    searchNotes.push({
                        "id":  notes[note].id,
                        "title": notes[note].title,
                        "text": notes[note].text,
                        "noteDate": notes[note].noteDate,
                        "noteTime": notes[note].noteTime                        
                    });
                }
            }
        }

        return searchNotes;
    }

    deleteNote(id){
        //delete a specific note
        //@param int id

        let notes = this.getNotes();
        if(notes){
            for(let i = 0; i < notes.length; i++){
                if(parseInt(notes[i].id) == id){
                    let noteIndex = notes.indexOf(notes[i]);
                    notes.splice(noteIndex,1);
                    localStorage.setItem("pinnedNotes", JSON.stringify(notes));
                    return true;
                }
            }
    
            
        }
    }

}

module.exports = Model;