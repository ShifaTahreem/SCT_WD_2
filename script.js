const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const exportBtn = document.getElementById("exportBtn");

const lapsList = document.getElementById("laps");

const progressCircle = document.getElementById("progress");

const themeBtn = document.getElementById("themeBtn");

let startTime = 0;
let elapsedTime = 0;

let timerInterval = null;

let running = false;

let laps = [];

/* ==========================
   PROGRESS RING
========================== */

const radius = 140;

const circumference =
    2 * Math.PI * radius;

progressCircle.style.strokeDasharray =
    circumference;

progressCircle.style.strokeDashoffset =
    circumference;

/* ==========================
   FORMAT TIME
========================== */

function formatTime(ms) {

    const hours =
        Math.floor(ms / 3600000);

    const minutes =
        Math.floor((ms % 3600000) / 60000);

    const seconds =
        Math.floor((ms % 60000) / 1000);

    const centiseconds =
        Math.floor((ms % 1000) / 10);

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(centiseconds).padStart(2, "0")
    );
}

/* ==========================
   UPDATE TIMER
========================== */

function updateTimer() {

    elapsedTime =
        Date.now() - startTime;

    display.textContent =
        formatTime(elapsedTime);

    const progress =
        (elapsedTime % 60000) / 60000;

    const offset =
        circumference -
        progress * circumference;

    progressCircle.style.strokeDashoffset =
        offset;
}

/* ==========================
   START
========================== */

function startTimer() {

    if (running) return;

    running = true;

    startTime =
        Date.now() - elapsedTime;

    timerInterval =
        setInterval(updateTimer, 10);
}

/* ==========================
   PAUSE
========================== */

function pauseTimer() {

    if (!running) return;

    running = false;

    clearInterval(timerInterval);
}

/* ==========================
   RESET
========================== */

function resetTimer() {

    running = false;

    clearInterval(timerInterval);

    startTime = 0;
    elapsedTime = 0;

    laps = [];

    display.textContent =
        "00:00:00.00";

    lapsList.innerHTML = "";

    progressCircle.style.strokeDashoffset =
        circumference;
}

/* ==========================
   LAP
========================== */

function addLap() {

    if (!running) return;

    const lapTime =
        formatTime(elapsedTime);

    laps.push(lapTime);

    const lapItem =
        document.createElement("li");

    lapItem.innerHTML = `
        <span>Lap ${laps.length}</span>
        <span>${lapTime}</span>
    `;

    lapsList.prepend(lapItem);
}

/* ==========================
   EXPORT LAPS
========================== */

function exportLaps() {

    if (laps.length === 0) {

        alert(
            "No lap times available."
        );

        return;
    }

    let content =
        "STOPWATCH LAP RECORDS\n\n";

    laps.forEach((lap, index) => {

        content +=
            `Lap ${index + 1}: ${lap}\n`;

    });

    const blob =
        new Blob(
            [content],
            {
                type: "text/plain"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "lap-records.txt";

    a.click();

    URL.revokeObjectURL(url);
}

/* ==========================
   DARK / LIGHT MODE
========================== */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );

        if (
            document.body.classList.contains(
                "light"
            )
        ) {

            themeBtn.textContent =
                " ☀ ";

        } else {

            themeBtn.textContent =
                " ☾ ";
        }
    }
);

/* ==========================
   BUTTON EVENTS
========================== */

startBtn.addEventListener(
    "click",
    startTimer
);

pauseBtn.addEventListener(
    "click",
    pauseTimer
);

resetBtn.addEventListener(
    "click",
    resetTimer
);

lapBtn.addEventListener(
    "click",
    addLap
);

exportBtn.addEventListener(
    "click",
    exportLaps
);

/* ==========================
   KEYBOARD SHORTCUTS
========================== */

document.addEventListener(
    "keydown",
    (e) => {

        switch (
            e.key.toLowerCase()
        ) {

            case " ":
                e.preventDefault();
                startTimer();
                break;

            case "p":
                pauseTimer();
                break;

            case "l":
                addLap();
                break;

            case "r":
                resetTimer();
                break;
        }
    }
);