document.addEventListener("DOMContentLoaded", () => {
    // --- STATE VARIABLES ---
    let totalTime = 0; // in seconds
    let timeRemaining = 0; // in seconds
    let isRunning = false;
    let isDragging = false;
    let didDrag = false; // Flag to prevent click after drag
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
    const SVG_NS = "http://www.w3.org/2000/svg"; // SVG Namespace

    // --- INITIALIZATION ---
    function init() {
        drawClockFace();
        
        // Attach all event listeners
        clickTarget.addEventListener('mousedown', onDragStart);
        svg.addEventListener('mousemove', onDragMove);
        svg.addEventListener('mouseup', onDragEnd);
        svg.addEventListener('mouseleave', onDragEnd); // Stop if mouse leaves SVG
        
        clickTarget.addEventListener('touchstart', onDragStart, { passive: false });
        svg.addEventListener('touchmove', onDragMove, { passive: false });
        svg.addEventListener('touchend', onDragEnd);
        
        clickTarget.addEventListener('click', onClick);
        clickTarget.addEventListener('dblclick', onDoubleClick);
        
        // Set initial state to 25 minutes
        setTime(25 * 60);
    }

    // --- DRAWING FUNCTIONS ---

    /**
     * Generates the 60 minute ticks, 12 five-minute ticks, and 12 number labels.
     */
    function drawClockFace() {
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * 360;
            const rad = (angle - 90) * (Math.PI / 180);
            const isFiveMinute = i % 5 === 0;

            const tickLength = isFiveMinute ? 5 : 2;
            const tickClass = isFiveMinute ? "tick-five-minute" : "tick-minute";

            const x1 = SVG_CENTER + (SVG_RADIUS - tickLength) * Math.cos(rad);
            const y1 = SVG_CENTER + (SVG_RADIUS - tickLength) * Math.sin(rad);
            const x2 = SVG_CENTER + SVG_RADIUS * Math.cos(rad);
            const y2 = SVG_CENTER + SVG_RADIUS * Math.sin(rad);

            const tick = document.createElementNS(SVG_NS, "line");
            tick.setAttribute("x1", x1);
            tick.setAttribute("y1", y1);
            tick.setAttribute("x2", x2);
            tick.setAttribute("y2", y2);
            tick.setAttribute("class", tickClass);
            clockFace.appendChild(tick);

            if (isFiveMinute) {
                const labelRadius = SVG_RADIUS - tickLength - 7;
                const lx = SVG_CENTER + labelRadius * Math.cos(rad);
                const ly = SVG_CENTER + labelRadius * Math.sin(rad);
                
                const label = document.createElementNS(SVG_NS, "text");
                label.setAttribute("x", lx);
                label.setAttribute("y", ly);
                label.setAttribute("class", "label");
                label.textContent = i === 0 ? 60 : i;
                clockFace.appendChild(label);
            }
        }
    }
    
    
    /**
     * Draws the "pie wedge" <path> based on the time remaining.
     * @param {number} seconds - The time remaining in seconds.
     */
    function drawWedge(seconds) {
        if (seconds <= 0) {
            timeWedge.setAttribute("d", "");
            return;
        }
        
        // Clamp to just under 3600 to prevent full-circle rendering issues
        const time = Math.min(seconds, 3599.99); 
        
        // 1. Convert seconds (0-3600) to an angle (0-360).
        const angle = (time / 3600) * 360;
        
        // 2. Convert angle to radians for trig functions (offset by -90 for top start).
        const angleInRadians = (angle - 90) * (Math.PI / 180);
        
        // 3. Calculate the (x, y) coordinates for the arc's end point.
        const x = SVG_CENTER + SVG_RADIUS * Math.cos(angleInRadians);
        const y = SVG_CENTER + SVG_RADIUS * Math.sin(angleInRadians);
        
        // 4. Determine the 'large-arc-flag' (1 if > 30 min, 0 otherwise).
        const largeArcFlag = time > 1800 ? 1 : 0;

        // 5. Construct the SVG 'd' path string.
        // M 50,50 = Move to center
        // L 50,0  = Line to top-center
        // A 50,50 0 [largeArcFlag] 1 [x],[y] = Arc from top to new (x,y)
        // Z       = Close path (line back to center)
        const d = `M ${SVG_CENTER},${SVG_CENTER} L ${SVG_CENTER},0 A ${SVG_RADIUS},${SVG_RADIUS} 0 ${largeArcFlag} 1 ${x},${y} Z`;

        // 6. Set the path attribute.
        timeWedge.setAttribute("d", d);
    }

    // --- EVENT HANDLERS ---
    
    function onDragStart(e) {
        e.preventDefault();
        pauseTimer();
        isDragging = true;
        didDrag = false;
        // Logic to check for long-press to set dragMode = 'fine' can be added here
        updateTimerFromEvent(e);
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        didDrag = true; // Mark that a drag occurred
        updateTimerFromEvent(e);
    }

    function onDragEnd(e) {
        isDragging = false;
        dragMode = 'default';
    }

    function onClick(e) {
        // If 'didDrag' is true, it means onDragMove fired.
        // Suppress the click, reset the flag, and exit.
        if (didDrag) {
            didDrag = false;
            return;
        }
        
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function onDoubleClick(e) {
        pauseTimer();
        const currentMinutes = Math.round(totalTime / 60);
        const minutes = prompt("Enter minutes (1-60):", currentMinutes);
        if (minutes !== null && !isNaN(minutes) && minutes >= 0 && minutes <= 60) {
            setTime(parseInt(minutes) * 60);
        }
    }

    /**
     * Gets the (x, y) coordinates of an event, scaled to the 0-100 SVG viewBox.
     */
    function getCoords(e) {
        const rect = svg.getBoundingClientRect();
        let x, y;
        
        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        return {
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100
        };
    }

    /**
     * Helper function to update the timer based on a mouse/touch event.
     */
    function updateTimerFromEvent(e) {
        const { x, y } = getCoords(e);
        
        // 1. Calculate (x, y) relative to the center
        const relX = x - SVG_CENTER;
        const relY = y - SVG_CENTER;
        
        // 2. Calculate angle using Math.atan2 (add 90 to make 0 at the top)
        let angle = Math.atan2(relY, relX) * (180 / Math.PI) + 90;
        
        // 3. Normalize angle to be 0-360
        if (angle < 0) {
            angle += 360;
        }
        
        // 4. Convert angle to seconds
        let seconds = (angle / 360) * 3600;

        // 5. Apply snapping logic
        let snappedSeconds;
        if (dragMode === 'fine') {
            snappedSeconds = Math.round(seconds / 60) * 60; // Snap to nearest minute
        } else {
            // Default: snap to 5 minutes
            snappedSeconds = Math.round(seconds / 300) * 300;
            
            // Priority snapping (check proximity, e.g., within 2 minutes)
            const twentyFiveMin = 25 * 60;
            const fiftyMin = 50 * 60;
            if (Math.abs(seconds - twentyFiveMin) < 120) snappedSeconds = twentyFiveMin;
            else if (Math.abs(seconds - fiftyMin) < 120) snappedSeconds = fiftyMin;
        }

        // Handle the 60-minute mark (which is 0 seconds on the timer)
        if (snappedSeconds === 3600) snappedSeconds = 0;
        
        // 6. Call setTime()
        setTime(snappedSeconds);
    }

    // --- TIMER CONTROL ---

    /**
     * Sets the timer to a specific time and updates the visual.
     * @param {number} seconds - Total time to set in seconds.
     */
    function setTime(seconds) {
        const clampedSeconds = Math.max(0, Math.min(3600, seconds));
        totalTime = clampedSeconds;
        timeRemaining = clampedSeconds;
        drawWedge(timeRemaining);
    }

    function startTimer() {
        if (timeRemaining <= 0 || isRunning) return; // Don't start a finished/running timer
        
        isRunning = true;
        // Start the interval just *before* the next full second
        const startTime = Date.now();
        timerInterval = setInterval(tick, 1000);
        tick(); // Call tick immediately to show the first second drop
    }

    function tick() {
        if (!isRunning) return;

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
        drawWedge(0);
        // Placeholder for audio
        alert("Timer Finished!");
        // console.log("Timer Finished!");
    }

    // --- RUN ---
    init();
});
