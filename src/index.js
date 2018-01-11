import MusicalScore from "musical-score";

const music = new MusicalScore("https://renevanderark.github.io/arkaic/out/");
const instruments = ["bass", "guitar",  "horn", "piano", "string"]
let instrument = 0;
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


const getDuration = dur => dur > 1000 ?
  "w" : dur > 500 ?
  "h" : dur > 250 ?
  "q" : dur > 125 ?
  "i" : dur > 64 ?
  "s" : dur > 32 ?
  "t" : dur > 16 ?
  "x" : "o";


const record = ({ note, oct }, { startTime }) => {
  const duration = new Date().getTime() - startTime;
  console.log(`${startTime}: ${note}${oct}${getDuration(duration)}`);
}


window.addEventListener("keydown", ev => {
  if (ev.key === "ArrowUp" && octave < 7) {
    octave++;
    return ev.preventDefault();
  }
  if (ev.key === "ArrowDown" && octave > 2) {
    octave--;
    return ev.preventDefault();
  }
  if (ev.key === "Tab") {
    instrument++;
    if (instrument >= instruments.length) {
      instrument = 0;
    }
  }

  const note = keyMap[ev.key];
  if (note && !audioMap[ev.key]) {
    audioMap[ev.key] = {
      audio: music.playNote(instruments[instrument], `${keyMap[ev.key].note}${octave + keyMap[ev.key].oct}w`),
      startTime: new Date().getTime()
    };
  }
  return ev.preventDefault();
});

window.addEventListener("keyup", ev => {
  const note = keyMap[ev.key];
  if (note && audioMap[ev.key]) {
    audioMap[ev.key].audio.pause();
    record(keyMap[ev.key], audioMap[ev.key]);

    delete audioMap[ev.key];
  }
  return ev.preventDefault();
});
