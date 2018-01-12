let canvas;
let ctx;


window.onload = function (e) {
    initClock();
};

function initClock() {
    canvas = document.getElementById("clock")
    ctx = canvas.getContext("2d");


    window.setInterval(function () {
        updateSeconds();
    }, 500);
}
function updateSeconds() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // outer circle
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    // the hour ticks
    for (let i = 0; i < 12; i++) {
        clockLine(70, 80, Math.PI * 2 - i / 12 * Math.PI * 2, 1, "#000000")
    }

    // the hands
    let date = new Date();
    clockLine(0, 90, date.getSeconds() / 60 * Math.PI * 2 - Math.PI / 2, 2, "#000000");
    clockLine(0, 70, date.getMinutes() / 60 * Math.PI * 2 - Math.PI / 2, 3, "#000000");
    clockLine(0, 50, date.getHours() / 12 * Math.PI * 2 - Math.PI / 2, 5, "#000000");

}
// draws a line from the center, inner radius is distance before line starts, outer radius is where it ends
function clockLine(innerRadius, outerRadius, angle, width, colour) {
    ctx.beginPath();

    ctx.moveTo(150 + innerRadius * Math.cos(angle), 150 + innerRadius * Math.sin(angle));
    ctx.lineTo(150 + outerRadius * Math.cos(angle), 150 + outerRadius * Math.sin(angle));

    ctx.lineWidth = width;
    ctx.strokeStyle = colour;
    ctx.stroke();
}