document.addEventListener("DOMContentLoaded", () => {
    // --- STATE VARIABLES ---
    let totalTime = 0; // in seconds
    let timeRemaining = 0; // in seconds
    let isRunning = false;
    let isDragging = false;
    let timerInterval = null;
    let dragMode = 'default'; // 'default' or 'fine'

    // --- DOM ELEMENTS ---
    const svg = document.getElementById("timer-svg");
    const timeWedge = document.getElementById("time-wedge");
    const clickTarget = document.getElementById("click-target");
    const clockFace = document.getElementById("clock-face");

    // --- CONSTANTS ---
    const SVG_CENTER = 50;
    const SVG_RADIUS = 50;

    // --- INITIALIZATION ---
    function init() {
        drawClockFace();
        
        // Attach all event listeners
        clickTarget.addEventListener('mousedown', onDragStart);
        svg.addEventListener('mousemove', onDragMove);
        svg.addEventListener('mouseup', onDragEnd);
        svg.addEventListener('mouseleave', onDragEnd); // Stop if mouse leaves SVG
        
        clickTarget.addEventListener('touchstart', onDragStart);
        svg.addEventListener('touchmove', onDragMove);
        svg.addEventListener('touchend', onDragEnd);
        
        clickTarget.addEventListener('click', onClick);
        clickTarget.addEventListener('dblclick', onDoubleClick);
        
        // Set initial state (e.g., 25 minutes)
        setTime(25 * 60);
    }

    // --- DRAWING FUNCTIONS ---

    /**
     * Generates the 60 minute ticks, 12 five-minute ticks, and 12 number labels.
     */
    function drawClockFace() {
        // Logic to loop 60 times, calculate (x, y) for ticks using trigonometry,
        // and append <line> and <text> elements to the 'clock-face' group.
        
        // Example for one tick (to be put in a loop):
        // const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        // tick.setAttribute("x1", ...);
        // ...
        // clockFace.appendChild(tick);
    }

    /**
     * Draws the "pie wedge" <path> based on the time remaining.
     * @param {number} seconds - The time remaining in seconds.
     */
    function drawWedge(seconds) {
        // 1. Convert seconds (0-3600) to an angle (0-359.9).
        // const angle = (seconds / 3600) * 360;
        
        // 2. Convert angle to radians for trig functions.
        // const angleInRadians = (angle - 90) * (Math.PI / 180);
        
        // 3. Calculate the (x, y) coordinates for the arc's end point.
        // const x = SVG_CENTER + SVG_RADIUS * Math.cos(angleInRadians);
        // const y = SVG_CENTER + SVG_RADIUS * Math.sin(angleInRadians);
        
        // 4. Determine the 'large-arc-flag' (1 if > 30 min, 0 otherwise).
        // const largeArcFlag = seconds > 1800 ? 1 : 0;

        // 5. Construct the SVG 'd' path string.
        // const d = `M ${SVG_CENTER},${SVG_CENTER} L ${SVG_CENTER},0 A ${SVG_RADIUS},${SVG_RADIUS} 0 ${largeArcFlag} 1 ${x},${y} Z`;

        // 6. Set the path attribute.
        // timeWedge.setAttribute("d", d);
    }

    // --- EVENT HANDLERS ---

    function onDragStart(e) {
        pauseTimer();
        isDragging = true;
        // Logic to check for long-press to set dragMode = 'fine'
        updateTimerFromEvent(e);
    }

    function onDragMove(e) {
        if (!isDragging) return;
        updateTimerFromEvent(e);
    }

    function onDragEnd(e) {
        isDragging = false;
        dragMode = 'default';
    }

    function onClick(e) {
        if (isDragging) return; // Don't fire click on drag end
        
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function onDoubleClick(e) {
        pauseTimer();
        const minutes = prompt("Enter minutes (1-60):", totalTime / 60);
        if (minutes) {
            setTime(parseInt(minutes) * 60);
        }
    }

    /**
     * Helper function to update the timer based on a mouse/touch event.
     */
    function updateTimerFromEvent(e) {
        // 1. Get (x, y) coordinates from the event (handling touch vs. mouse).
        // 2. Calculate angle from (x, y) relative to the center using Math.atan2.
        // 3. Convert angle to seconds.
        // 4. Apply snapping logic (Priority, Default, Fine-grained).
        // 5. Call setTime(snappedSeconds).
    }

    // --- TIMER CONTROL ---

    /**
     * Sets the timer to a specific time and updates the visual.
     * @param {number} seconds - Total time to set in seconds.
     */
    function setTime(seconds) {
        totalTime = seconds;
        timeRemaining = seconds;
        drawWedge(timeRemaining);
    }

    function startTimer() {
        if (timeRemaining <= 0) return; // Don't start a finished timer
        
        isRunning = true;
        timerInterval = setInterval(tick, 1000);
    }

    function tick() {
        timeRemaining--;
        drawWedge(timeRemaining);

        if (timeRemaining <= 0) {
            endTimer();
        }
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
    }

    function endTimer() {
        pauseTimer();
        timeRemaining = 0;
        // Play sound
        // new Audio('chime.mp3').play();
        console.log("Timer Finished!");
    }

    // --- RUN ---
    init();
});
