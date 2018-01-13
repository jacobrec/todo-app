let notes = [];

window.addEventListener("load", async function () {
    document.getElementById("note-create").onclick = createNote;
    try {
        notes = await loadNotes();
        renderNotes();
    } catch (error) {
        if (error.code === "ENOENT") {
            // The file could not be found.
            // Ignore this error and assume no prior notes exist.
            return;
        }

        alert("An error ocurred while loading your notes: " + error.message);
        console.log(error);
    }
});

class Note {
    constructor(text, date) {
        this.text = text;
        if (date) {
            this.date = date;
        } else {
            this.date = new Date();
        }
        // Use milliseconds since January 1, 1970 as the id.
        this.id = this.date.getTime();
    }

    getElement() {
        let element = document.createElement("div");
        element.id = this.id;
        element.classList.add("note");

        // Format the date and time.
        let date = this.date.toString().substring(0, 15);
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes() < 10 ? "0" + this.date.getMinutes() : this.date.getMinutes();
        let time = hours + ":" + minutes;
        let dateAndTime = date + " @ " + time;

        element.innerHTML = `
            <p class="note-text">${this.text}</p>
            <button class="note-edit btn">
                <i class="material-icons">edit</i>
            </button>
            <button class="note-delete btn">
                <i class="material-icons">delete</i>
            </button>
        `;
        element.querySelector(".note-edit").onclick = () => editNote(this.id);
        element.querySelector(".note-delete").onclick = () => deleteNote(this.id);
        return element;
    }
}

function createNote() {
    let textInputElement = document.getElementById("note-text-input");
    let text = textInputElement.value;
    textInputElement.value = "";
    notes.push(new Note(text));
    renderNotes();
    saveNotes();
}

function editNote(id) {
    // Make the text editable.
    let noteElement = document.getElementById(id);
    let textElement = noteElement.querySelector(".note-text");
    textElement.contentEditable = "true";
    textElement.style.backgroundColor = "white";
    // Replace the edit button with a save button.
    let editButton = noteElement.querySelector(".note-edit");
    editButton.innerHTML = `<i class="material-icons">save</i>`;
    editButton.onclick = () => saveNote(id);
}

function saveNote(id) {
    // Reset all the elements back to their original states.
    let noteElement = document.getElementById(id);
    let textElement = noteElement.querySelector(".note-text");
    textElement.contentEditable = "false";
    textElement.style.backgroundColor = "transparent";
    let editButton = noteElement.querySelector(".note-edit");
    editButton.innerHTML = `<i class="material-icons">edit</i>`;
    editButton.onclick = () => editNote(id);
    // Update the text in the notes array and save.
    let newText = textElement.innerHTML;
    let index = getNoteIndexById(id);
    notes[index] = new Note(newText);
    renderNotes();
    saveNotes();
}

function deleteNote(id) {
    let index = getNoteIndexById(id);
    notes.splice(index, 1);
    renderNotes();
    saveNotes();
}

function renderNotes() {
    let noteList = document.getElementById("note-list");
    // Delete all currently displayed notes.
    while (noteList.firstChild) {
        noteList.removeChild(noteList.firstChild);
    }
    // Show the new list of notes.
    for (let note of notes) {
        let element = note.getElement();
        noteList.appendChild(element);
    }
}

function getNoteIndexById(id) {
    // Find the note in the notes array.
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];
        if (note.id === id) {
            return i;
        }
    }
    throw new Error("Note not found in array.");
}

// Loading and saving notes to the filesystem.
const fs = require('fs');
const file = "./notes.json";

function loadNotes() {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            let notes = JSON.parse(data);
            notes = notes.map(note => new Note(note.text, new Date(note.date)));
            resolve(notes);
        });
    });
}

function saveNotes() {
    fs.writeFile(file, JSON.stringify(notes), error => {
        if (error) {
            alert("An error ocurred while saving your notes: " + error.message);
            console.log(error);
            return;
        }
    });
}
