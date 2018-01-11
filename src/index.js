import MusicalScore from "musical-score";

const music = new MusicalScore("https://renevanderark.github.io/arkaic/out/");
let instrument = "bass";
let audioMap = {};
let octave = 3;
const keyMap = {
  "z": {note: "C", oct: 0},
  "s": {note: "C#", oct: 0},
  "x": {note: "D", oct: 0},
  "d": {note: "D#", oct: 0},
  "c": {note: "E", oct: 0},
  "v": {note: "F", oct: 0},
  "g": {note: "F#", oct: 0},
  "b": {note: "G", oct: 0},
  "h": {note: "G#", oct: 0},
  "n": {note: "A", oct: 0},
  "j": {note: "A#", oct: 0},
  "m": {note: "B", oct: 0},
  ",": {note: "C", oct: 1},
  "l": {note: "C#", oct: 1},
  ".": {note: "D", oct: 1},
  ";": {note: "D#", oct: 1},
  "/": {note: "E", oct: 1},
};


window.addEventListener("keydown", ev => {
  if (ev.key === "ArrowUp" && octave < 7) {
    octave++;
    return ev.preventDefault();
  }
  if (ev.key === "ArrowDown" && octave > 2) {
    octave--;
    return ev.preventDefault();
  }
  const note = keyMap[ev.key];
  if (note && !audioMap[ev.key]) {
    audioMap[ev.key] = music.playNote(instrument, `${keyMap[ev.key].note}${octave + keyMap[ev.key].oct}w`);
  }
  return ev.preventDefault();
});

window.addEventListener("keyup", ev => {
  const note = keyMap[ev.key];
  if (note && audioMap[ev.key]) {
    audioMap[ev.key].pause();
    delete audioMap[ev.key];
  }
  return ev.preventDefault();
});
