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

const durations = {
    "w": 2000,
    "h": 1000,
    "q": 500,
    "i": 250,
    "s": 125,
    "t": 64,
    "x": 32,
    "o": 16
};



const normalizeDuration = dur => dur > 1000 ?
  "w" : dur > 500 ?
  "h" : dur > 250 ?
  "q" : dur > 125 ?
  "i" : dur > 64 ?
  "s" : dur > 32 ?
  "t" : dur > 16 ?
  "x" : "o";

const getRestDuration = dur => dur > 2000 ?
  "w" : dur > 1000 ?
  "h" : dur > 500 ?
  "q" : dur > 250 ?
  "i" : dur > 125 ?
  "s" : dur > 64 ?
  "t" : dur > 32 ?
  "x" : "o";

let currentRecording = [];
let recording = false;
let recordingStartTime = new Date().getTime();

const record = ({ note, oct }, { startTime }) => {
  const duration = new Date().getTime() - startTime;
  if (recording) {
    currentRecording.push({
      note: `${note}${oct}${normalizeDuration(duration)}`,
      startTime: startTime - recordingStartTime
    })
  }
}

const getTrackPosition = (track) =>
  track.map(n => durations[n[n.length - 1]]).reduce((a,b) => a + b, 0);

const recordNote = (track, noteObj) => {
  let restTime = noteObj.startTime - getTrackPosition(track);
  while (restTime > 0) {
    const normalizedDuration = getRestDuration(restTime);
    const dur = durations[normalizedDuration];
    restTime -= dur;
    track.push(`R${normalizedDuration}`);
  }
  track.push(noteObj.note);
}

const generateTracks = () => {
  let tracks = [[],[],[],[],[],[],[],[]];
  console.log(currentRecording);
  currentRecording.forEach(noteObj => {
    const availableTracks = tracks.filter(track => getTrackPosition(track) < noteObj.startTime);
    if (availableTracks.length > 0) {
      recordNote(availableTracks[0], noteObj);
    } else {
      console.warn("No available tracks");
    }
  });
  const recordedScore = new MusicalScore("https://renevanderark.github.io/arkaic/out/");
  console.log(tracks);
  tracks.filter(track => track.length > 0).forEach(track => {
    console.log(track.join(" "));
    recordedScore.addTrack(instruments[instrument], track.join(" "))
  });
  recordedScore.play();
}

window.addEventListener("keydown", ev => {
  if (ev.key === " ") {
    recording = !recording;
    if (recording) {
      recordingStartTime = new Date().getTime();
    } else {
      generateTracks();

      currentRecording = [];
    }
    document.getElementById("recording").innerHTML = recording ? "recording" : "not recording";
  }

  if (ev.key === "ArrowUp" && octave < 7) {
    octave++;
    document.getElementById("octave").innerHTML = octave;
    return ev.preventDefault();
  }
  if (ev.key === "ArrowDown" && octave > 2) {
    octave--;
    document.getElementById("octave").innerHTML = octave;
    return ev.preventDefault();
  }
  if (ev.key === "Tab") {
    instrument++;
    if (instrument >= instruments.length) {
      instrument = 0;
    }
    document.getElementById("instrument").innerHTML = instruments[instrument];
    return ev.preventDefault();
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
    record({note: keyMap[ev.key].note, oct: keyMap[ev.key].oct + octave}, audioMap[ev.key]);

    delete audioMap[ev.key];
  }
  return ev.preventDefault();
});
