let canvas;
let ctx;


window.onload = function (e) {
    initClock();
};

function initClock() {
    canvas = document.getElementById("clock")
    ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5);


    window.setInterval(function () {
        updateSeconds();
    }, 500);
}
const centerPos = 350;
const clockColour = "#ECF0F1";
const clockAccent = "#E74C3C";
function updateSeconds() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // outer circle
    ctx.beginPath();
    ctx.arc(centerPos, centerPos, 300, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = clockColour;
    ctx.stroke();

    // the hour ticks
    for (let i = 0; i < 12; i++) {
        clockLine(250, 285, Math.PI * 2 - i / 12 * Math.PI * 2, 1, clockColour)
    }

    // the hands
    let date = new Date();
    clockLine(0, 250, date.getSeconds() / 60 * Math.PI * 2 - Math.PI / 2, 2, clockAccent);
    clockLine(0, 200, date.getMinutes() / 60 * Math.PI * 2 - Math.PI / 2, 3, clockColour);
    clockLine(0, 150, date.getHours() / 12 * Math.PI * 2 - Math.PI / 2, 5, clockColour);

}
// draws a line from the center, inner radius is distance before line starts, outer radius is where it ends
function clockLine(innerRadius, outerRadius, angle, width, colour) {
    ctx.beginPath();

    ctx.moveTo(centerPos + innerRadius * Math.cos(angle), centerPos + innerRadius * Math.sin(angle));
    ctx.lineTo(centerPos + outerRadius * Math.cos(angle), centerPos + outerRadius * Math.sin(angle));

    ctx.lineWidth = width;
    ctx.strokeStyle = colour;
    ctx.stroke();
}