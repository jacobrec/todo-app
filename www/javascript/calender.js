var cal;
let events = [];
$(document).ready(function() {
    addCal();
    getEvents();
});

function addCal() {
    cal = $('#mini-clndr').clndr({
        template: $('#mini-clndr-template').html(),
        events: events,
        clickEvents: {
            click: function(target) {
                if (target.events.length) {
                    var daysContainer = $('#mini-clndr').find('.days-container');
                    daysContainer.toggleClass('show-events', true);
                    $('#mini-clndr').find('.x-button').click(function() {
                        daysContainer.toggleClass('show-events', false);
                    });
                }
            }
        },
        adjacentDaysChangeMonth: true,
        forceSixRows: true
    });
}

function deleteEvent(id) {
    let but = document.getElementById("but-" + id);
    if (but.data == undefined) {
        but.data = false;
    }

    if (but.data) {
        for (let index in events) {
            if (events[index].id == id) {
                events.splice(index, 1);
            }
        }
        cal.setEvents(events);
    } else {
        but.style.backgroundColor = "red";
        but.innerHTML = "Confirm";
        but.data = true;

        window.addEventListener("click", function(e) {
            if (e.srcElement != but) {
                but.style.backgroundColor = "#0099CC";
                but.innerHTML = "Remove";
                but.data = false;
            }
        });

    }
    saveEvents();
}


function newEvent() { // TODO: escape string
    let e = {
        date: $("#modal_date").val(),
        title: $("#modal_name").val(),
        location: $("#modal_loc").val(),
        id: Date.now()
    };
    events.push(e);
    events.sort(function(a, b) {
        if (a.date < b.date) {
            return -1;
        } else if (a.date > b.date) {
            return 1;
        }
        return 0;
    });
    cal.setEvents(events);

    killEvent();
    saveEvents()
}

function killEvent() {
    $("#modal_name").val("");
    $("#modal_loc").val("");
    $("#modal_date").val("");
    $("#modal_aquireinfo").removeClass("showModal");
    $("#modal_aquireinfo").addClass("hideModal");
}


// Loading and saving notes to the filesystem.

async function getEvents() {
    try {
        events = await loadEvents();
        cal.setEvents(events);
    } catch (error) {
        if (error.code === "ENOENT") {
            // The file could not be found.
            // Ignore this error and assume no prior notes exist.
            return;
        }

        alert("An error ocurred while loading your notes: " + error.message);
        console.log(error);
    }
};


const fs = require('fs');
const file = "./events.json";

function loadEvents() {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            let events = JSON.parse(data);
            resolve(events);
        });
    });
}

function saveEvents() {
    fs.writeFile(file, JSON.stringify(events), error => {
        if (error) {
            alert("An error ocurred while saving your notes: " + error.message);
            console.log(error);
            return;
        }
    });
}
