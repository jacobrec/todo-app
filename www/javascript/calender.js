var cal;


var currentMonth = moment().format('YYYY-MM');
var nextMonth = moment().add('month', 1).format('YYYY-MM');

var events = [{
        date: currentMonth + '-' + '10',
        title: 'Persian Kitten Auction',
        location: 'Center for Beautiful Cats',
        id: 0
    },
    {
        date: currentMonth + '-' + '19',
        title: 'Cat Frisbee',
        location: 'Jefferson Park',
        id: 1
    },
    {
        date: currentMonth + '-' + '23',
        title: 'Kitten Demonstration',
        location: 'Center for Beautiful Cats',
        id: 2
    },
    {
        date: nextMonth + '-' + '07',
        title: 'Small Cat Photo Session',
        location: 'Center for Cat Photography',
        id: 3
    }
];


$(document).ready(function() {
    addCal();
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



}

function sortEvents() {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < events.length - 1; i++) {
            if (events[i].date > events[i].date) {
                var temp = events[i];
                events[i] = events[i + 1];
                events[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

function newEvent() {
    let e = {
        date: $("#modal_date").val(),
        title: $("#modal_name").val(),
        location: $("#modal_loc").val(),
        id: 4
    };
    events.push(e);
    sortEvents();
    cal.setEvents(events);

    killEvent();
}

function killEvent() {
    $("#modal_name").val("");
    $("#modal_loc").val("");
    $("#modal_date").val("");
    $("#modal_aquireinfo").removeClass("showModal");
    $("#modal_aquireinfo").addClass("hideModal");
}
