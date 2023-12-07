import * as tone from "tone";

export class Audio {
  constructor() {
    this.synth = new tone.Synth().toDestination();

    this.keyboardNotes = {};
    this.setKeyboard();

    window.addEventListener("keydown", this.onPress.bind(this));
  }

  setKeyboard() {
    const keyboard_notes = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    const keyboard_octaves = [2, 3, 4, 5, 6, 7];

    const keyboard_keys = [
      "a",
      "w",
      "s",
      "e",
      "d",
      "f",
      "t",
      "g",
      "y",
      "h",
      "u",
      "j",
    ];

    const keyboard = {};

    for (let i = 0; i < keyboard_notes.length; i++) {
      const note = keyboard_notes[i];
      const key = keyboard_keys[i];
      keyboard[key] = note;
    }

    this.keyboardNotes = keyboard;
  }

  onPress(event) {
    const key = event.key;
    const note = this.getNoteFromKey(key);
    if (note) {
      // this.synth.triggerAttackRelease("C5", "+0.05", 0, 1.5);

      const random = Math.floor(Math.random() * 6) + 1;

      this.synth.triggerAttackRelease(note + random, "+0.05", 0, 1.5);
      const freq = new tone.Frequency(note + random).toFrequency();
      window.dispatchEvent(
        new CustomEvent("note", {
          detail: {
            frequency: freq,
          },
        })
      );
    }
  }

  getNoteFromKey(key) {
    return this.keyboardNotes[key];
  }
}
