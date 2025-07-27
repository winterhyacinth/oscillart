
const input = document.getElementById('input');

const audioCtx = new AudioContext();

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
   frequency(input.value);
   audioCtx.resume();
gainNode.gain.value = 0;
}
