
const input = document.getElementById('input');

const audioCtx = new AudioContext();

notenames = new Map();
notenames.set("A", 493.9);
notenames.set("B", 440);
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
var usernotes = String(input.value);
frequency(notenames.get(usernotes)); 

// define the frequency function
function frequency(pitch) {
    // create Oscillator and Gain nodes inside the function
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
}

function handle() {
    var usernotes = String(input.value);
    frequency(notenames.get(usernotes)); 
   frequency(input.value);
   audioCtx.resume();   
    gainNode.gain.value = 0;
    
}
