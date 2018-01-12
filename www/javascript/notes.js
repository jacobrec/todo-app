let notes = [];

window.addEventListener("load", async function () {
    document.getElementById("create-note").onclick = createNote;
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
    }

    getElement() {
        let element = document.createElement("div");
        element.classList.add("note");

        // Format the date and time.
        let date = this.date.toString().substring(0, 15);
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes() < 10 ? "0" + this.date.getMinutes() : this.date.getMinutes();
        let time = hours + ":" + minutes;
        let dateAndTime = date + " @ " + time;

        element.innerHTML = `
            <p class="note-text">${this.text}</p>
            <p class="note-date">${dateAndTime}</p>
        `;
        return element;
    }
}

function createNote() {
    let textElement = document.getElementById("note-text");
    let text = textElement.value;
    textElement.value = "";
    notes.push(new Note(text));
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
