window.onload = function (e) {
    document.getElementById("stop").onclick = timerStop;
    document.getElementById("start").onclick = timerStart;
    document.getElementById("reset").onclick = timerReset;


    document.getElementById("time-hours").addEventListener('keypress', function (e) {
        if (this.value.length >= 1) {
            document.getElementById("time-minutes").focus();
        }
    });

    document.getElementById("time-minutes").addEventListener('keypress', function (e) {
        if (this.value.length >= 1) {
            document.getElementById("time-seconds").focus();
        }
    });

    document.getElementById("time-minutes").addEventListener('keyup', function (e) {
        if (this.value.length == 0 && e.key == "Backspace") {
            document.getElementById("time-hours").focus();
        }
    });
    document.getElementById("time-seconds").addEventListener('keyup', function (e) {
        if (this.value.length == 0 && e.key == "Backspace") {
            document.getElementById("time-minutes").focus();
        }
    });

};

let millisRemaining = 0;

let startTime;

let running = false;
let reset = true;
function timerStop() {

    if(!running) {
        resetClock();
    }else{
        running = false;
        document.getElementById("stop").value = "Reset";
    }


}
function timerStart() {
    if (!running) {
        running = true;
        let seconds = parseInt(document.getElementById("time-seconds").value);
        if(isNaN(seconds)){
            seconds = 0;
        }
        console.log(seconds);
        let minutes = parseInt(document.getElementById("time-minutes").value);
        if(isNaN(minutes)){
            minutes = 0;
        }
        console.log(minutes);

        let hours = parseInt(document.getElementById("time-hours").value);
        if(isNaN(hours)){
            hours = 0;
        }
        console.log(hours);

        millisRemaining = seconds * 1000;
        millisRemaining += minutes * 1000 * 60;
        millisRemaining += hours * 1000 * 60 * 60;

        reset = false;
        console.log("Starting timer for " + millisRemaining + " milliseconds");
        startTime = Date.now();

        requestAnimationFrame(updateClock);
        document.getElementById("stop").value = "Stop";
    }

}

function updateClock() {
    millisRemaining -= (Date.now() - startTime);
    startTime = Date.now();
    if (millisRemaining <= 0) {
        var audio = new Audio("beep_6x.mp3");
        audio.currentTime = 0;
        audio.play();

        let myNotification = new Notification('Todo', {
            body: "Your time is up :)"
        });
        resetClock();
    }
    graphicalUpdate(millisRemaining);
    if (running) {
        requestAnimationFrame(updateClock);
    }
}
function graphicalUpdate(millis) {
    document.getElementById("time-seconds").value = Math.floor(millis / 1000) % 60;
    document.getElementById("time-minutes").value = Math.floor(millis / 1000 / 60) % 60;
    document.getElementById("time-hours").value = Math.floor(millis / 1000 / 60 / 60);
}

function resetClock() {
    document.getElementById("time-hours").value = "";
    document.getElementById("time-minutes").value = "";
    document.getElementById("time-seconds").value = "";

    millisRemaining = 0;
    running = false;
    reset = true;
}