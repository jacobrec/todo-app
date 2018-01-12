let running = false;
let reset = true;
let startTime;
let stopTime;

window.onload = function (e) {
    console.log(";)");
    document.getElementById("start-restart").onclick = startRestartClick ;
    document.getElementById("stop-reset").onclick = stopResetClick;
};



function stopResetClick() {
    if(running){
        watchStop();
    }else{
        watchReset();
    }
}

function startRestartClick() {
    watchStart();
}


function watchStart() {
    if(!running) {
        running = true;
        if (reset) {
            startTime = Date.now();
            reset = false;
        } else {
            let millis = Date.now() - stopTime;
            startTime = startTime + millis;
        }

        window.requestAnimationFrame(updateTime);
    }

    changeButtons(true);
}
function watchStop() {
    running = false;
    stopTime = Date.now();
    changeButtons(false);
}

function watchReset() {
    reset = true;
    setWatch(0);
    changeButtons(true);
}

function changeButtons(isReset) {
    if(isReset) {
        document.getElementById("stop-reset").value = "Stop";
    }else{
        document.getElementById("stop-reset").value = "Reset";
    }
}

function updateTime() {
    let millis = Date.now() - startTime;
    setWatch(millis);

    if(running){
        window.requestAnimationFrame(updateTime);
    }
}
function setWatch(millis) {

    let hours = Math.floor(millis/1000/60/60);
    let minutes = Math.floor((millis/1000/60) % 60);
    let seconds = Math.floor((millis/1000) % 60);
    millis = (millis % 1000);


    // shoutout to dynamic typing to allow me to do this
    if(seconds < 10){
        seconds = "0"+seconds;
    }
    if(minutes < 10){
        minutes = "0"+minutes;
    }
    if(hours < 10){
        hours = "0"+hours;
    }
    if(millis < 10){
        millis = "00" + millis;
    }else if (millis < 100){
        millis = "0" + millis;
    }
    document.getElementById("timer").innerHTML = hours+":"+minutes+":"+seconds+"."+millis;
}