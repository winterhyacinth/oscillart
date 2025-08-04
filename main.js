const input = document.getElementById('input');
const colorpick1 = document.getElementById('color1');
const colorpick2 = document.getElementById('color2');
const colorpick3 = document.getElementById('color3');


const vol_slider = document.getElementById('vol_slider');
const recording_toggle = document.getElementById('record');

var interval = null;
var reset = false;

var timepernote = 0;
var length = 0; //length of noteslist (how many we go thru --> how long note should play)

const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;

//def canvas variables, setup
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;

notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440);
notenames.set("B", 493.9);


const root = document.documentElement;


[colorpick1, colorpick2, colorpick3].forEach(el => el.addEventListener('input', updateColors));
updateColors();

function updateColors() {
  document.documentElement.style.setProperty('--color1', colorpick1.value);
  document.documentElement.style.setProperty('--color2', colorpick2.value);
  document.documentElement.style.setProperty('--color3', colorpick3.value);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colorpick1.value);
  gradient.addColorStop(0.5, colorpick2.value);
  gradient.addColorStop(1, colorpick3.value);
  return gradient;
}



// define the frequency function
function frequency(pitch) {
    freq = pitch / 10000;
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    setting = setInterval(() => {gainNode.gain.value = vol_slider.value}, 1);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);   
    setTimeout(() => { clearInterval(setting); gainNode.gain.value = 0; }, ((timepernote)-10));
}


function handle() {
    reset = true;
    audioCtx.resume();
    gainNode.gain.value = 0;

    var usernotes = String(input.value).toUpperCase();
    var noteslist = [];

    length = usernotes.length;
    timepernote = (6000 / length);

    for (i = 0; i < usernotes.length; i++) {
           noteslist.push(notenames.get(usernotes.charAt(i)));       
    }

    let j = 0;
   repeat = setInterval(() => {
       if (j < noteslist.length) {
           frequency(parseInt(noteslist[j]));
           drawWave();
       j++
       } else {
           clearInterval(repeat)
       }

   }, timepernote)
  
}

var counter = 0;

function drawWave() {
    clearInterval(interval);
     if (reset) {
       ctx.clearRect(0, 0, width, height);
       x = 0;
       y = height/2;
       ctx.moveTo(x, y);
       ctx.beginPath();
   }
   counter = 0;    
   interval = setInterval(line, 20);
   reset = false;
}

function line() {
    y = height/2 + ((vol_slider.value/100)*40) * Math.sin(x * 2  * Math.PI * freq * (0.5*length)); 
    
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colorpick1.value);
    gradient.addColorStop(0.5, colorpick2.value);
    gradient.addColorStop(1, colorpick3.value);


    ctx.strokeStyle = gradient;
    ctx.lineStyle = "solid";

    ctx.lineTo(x,y);
    ctx.stroke();
    x = x + 1;

   //increase counter by 1 to show how long interval has been run
   counter++;

   if(counter > (timepernote/20)) {
       clearInterval(interval);
  }
}

//media recording api
var blob, recorder = null;
var chunks = [];

function startRecording(){
   const canvasStream = canvas.captureStream(20); // canvas frame rate
   const audioDestination = audioCtx.createMediaStreamDestination();
    gainNode.connect(audioDestination);

   const combinedStream = new MediaStream();
    chunks = [];

   // add video data
    canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
    
    audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));

    recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
    recorder.ondataavailable = e => {
if (e.data.size > 0) {
   chunks.push(e.data);
 }
};


recorder.onstop = () => {
   const blob = new Blob(chunks, { type: 'video/webm' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'recording.webm';
   a.click();
   URL.revokeObjectURL(url);
};
recorder.start();

}
var is_recording = false;
function toggle() {
   is_recording = !is_recording; 
   if(is_recording){
       recording_toggle.innerHTML = "stop recording";
       startRecording(); 
   } else {
       recording_toggle.innerHTML = "start recording";
       recorder.stop();
   }
}



