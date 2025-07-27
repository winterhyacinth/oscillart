
const input = document.getElementById('input');

const audioCtx = new AudioContext();



//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;


var interval = null;
var amplitude = 40;



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
    freq = pitch / 10000;

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
   drawWave();
   audioCtx.resume();   
    gainNode.gain.value = 0.5;
}


var counter = 0;
function drawWave() {
	ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height/2;
    ctx.moveTo(x, y);
    ctx.beginPath(); 
    
    counter = 0;
    interval = setInterval(line, 20);

}

function line() {
    
    y = height/2 + (amplitude * Math.sin(2(Math.PI * freq * x) ) )
    ctx.lineTo(x,y);
    ctx.stroke();
    x = x + 1;

   //increase counter by 1 to show how long interval has been run
   counter++;

   if(counter > 50) {
       clearInterval(interval);
  }

}
