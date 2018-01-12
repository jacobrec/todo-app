window.addEventListener("load", function () {
    document.getElementById("create-note").onclick = createNote;
    renderNotes();
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
        let time = this.date.getHours() + ":" + this.date.getMinutes();
        let dateAndTime = date + " @ " + time;

        element.innerHTML = `
            <p class="note-text">${this.text}</p>
            <p class="note-date">${dateAndTime}</p>
        `;
        return element;
    }
}

let notes = [];

function createNote() {
    let textElement = document.getElementById("note-text");
    let text = textElement.value;
    textElement.value = "";
    notes.push(new Note(text));
    renderNotes();
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
