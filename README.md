# Visual Temporal Timer

A minimalist, web-based visual timer inspired by the "Time Timer." This app provides a tangible, visual representation of time passing, making it ideal for focus work, Pomodoro sessions, or any time-boxed task.

The core concept is to show time as a solid-color "pie wedge" that shrinks as time elapses, rather than just a digital number countdown.

## 🚀 Features

* **Visual Time Disk:** Time remaining is shown as a solid-color wedge that animates down to zero.
* **Static Clock Face:** Includes 60-minute tick marks and numeric labels for every 5-minute increment.
* **Drag-to-Set:** Click and drag (or tap and drag) on the timer face to visually set the time.
    * **Smart Snapping:** Automatically snaps to the nearest 5-minute mark.
    * **Priority Snapping:** Snaps more strongly to common 25 and 50-minute marks.
* **Click Controls:**
    * **Single Click:** Toggles the timer to Start or Pause.
    * **Double Click:** Opens a prompt to manually enter the desired minutes (1-60).
* **Pure Vanilla JS:** No frameworks or external dependencies.

## 💻 How to Use

1.  Clone this repository.
2.  Open the `index.html` file in any modern web browser (like Chrome, Firefox, or Safari).

That's it! The app is fully self-contained in the `index.html`, `styles.css`, and `script.js` files.

## 🛠️ Future Roadmap

This is a functional v1.0, but here are some planned next steps:

* [ ] Add a selection of pleasant audio chimes for when the timer completes.
* [ ] Implement a "fine-grained" drag mode (e.g., hold `Shift` to snap to 1-minute increments).
* [ ] Create a simple settings modal to:
    * Change the color of the timer wedge.
    * Select the end-of-timer sound.
    * Configure default Pomodoro cycles (work/break times).
* [ ] Package the app as a Chrome Extension for easy access.

