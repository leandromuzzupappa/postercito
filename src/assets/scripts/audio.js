const sources = {
  grimes: "../audios/grimes.mp3",
  saoki: "../audios/saoki.mp3",
  jdivision: "../audios/jdivision.mp3",
  amonkeys: "../audios/amonkeys.mp3",
};

let audioStatus = "stopped";
let audioContext;
let audio;
let analyserNode;
let frequencyData;

let minFrequency = 0.5;
let maxFrequency = 4;
let minAmplitude = 0.12;
let maxAmplitude = 0.2;

let amplitude;
let frequency;

function initAudio(song) {
  if (!audioContext) {
    audioContext = new AudioContext();
    audio = document.createElement("audio");
    audio.src = song;
    audio.crossOrigin = "Anonymous";
    audio.loop = true;
    audio.play();

    const source = audioContext.createMediaElementSource(audio);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048 * 2;
    analyserNode.minDecibels = -100;
    analyserNode.maxDecibels = -30;
    frequencyData = new Float32Array(analyserNode.fftSize);

    source.connect(analyserNode);
    source.connect(audioContext.destination);
    audioStatus = "playing";
  } else {
    audio.pause();
    audioContext.close();
    audioContext = audio = null;
    audioStatus = "stopped";
    initAudio(song);
  }

  return { frequency, amplitude };

  //console.log("audio", audioContext);
}

function audioLoop() {
  analyserNode.getFloatFrequencyData(frequencyData);
  const drum = audioSignal(analyserNode, frequencyData, 10, 100);
  const bass = audioSignal(analyserNode, frequencyData, 100, 500);
  const mid = audioSignal(analyserNode, frequencyData, 500, 2000);
  const treble = audioSignal(analyserNode, frequencyData, 2000, 10000);
  const voice = audioSignal(analyserNode, frequencyData, 5000, 7000);

  /* frequency = map(voice, 0, 1, minFrequency, maxFrequency);
  amplitude = map(drum, 0, 1, minAmplitude, maxAmplitude); */

  //   console.log("frequency", frequency);
  //   console.log("amplitude", amplitude);

  /*  console.log({
    frequency: audioSignal(analyserNode, frequencyData, 100, 500),
    amplitude: audioSignal(analyserNode, frequencyData, 10, 100),
  }); */

  return {
    frequency: audioSignal(analyserNode, frequencyData, 100, 500),
    amplitude: audioSignal(analyserNode, frequencyData, 10, 100),
  };
}

function frequencyToIndex(frequencyHz, sampleRate, frequencyBinCount) {
  const nyquist = sampleRate / 2;
  const index = Math.round((frequencyHz / nyquist) * frequencyBinCount);
  return Math.min(frequencyBinCount, Math.max(0, index));
}

function indexToFrequency(index, sampleRate, frequencyBinCount) {
  return (index * sampleRate) / (frequencyBinCount * 2);
}

function audioSignal(analyser, frequencies, minHz, maxHz) {
  if (!analyser) return 0;
  const sampleRate = analyser.context.sampleRate;
  const binCount = analyser.frequencyBinCount;

  let start = frequencyToIndex(minHz, sampleRate, binCount);
  const end = frequencyToIndex(maxHz, sampleRate, binCount);
  const count = end - start;
  let sum = 0;
  for (; start < end; start++) {
    sum += frequencies[start];
  }

  const minDb = analyserNode.minDecibels;
  const maxDb = analyserNode.maxDecibels;
  const valueDb = count === 0 || !isFinite(sum) ? minDb : sum / count;
  return map(valueDb, minDb, maxDb, 0, 1, true);
}

function map(value, start1, stop1, start2, stop2, withinBounds) {
  const newValue =
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newValue;
  }
  if (start2 < stop2) {
    return Math.max(start2, Math.min(stop2, newValue));
  } else {
    return Math.max(stop2, Math.min(start2, newValue));
  }
}

/* window.addEventListener("focus", () => {
  if (audioContext && audio) {
    audio.play();
  }
});

window.addEventListener("blur", () => {
  audio.pause();
});
 */

export { sources, audioStatus, initAudio, audioLoop };
