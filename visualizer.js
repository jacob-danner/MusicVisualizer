// set up container div
const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// get file
const file = document.getElementById('fileupload');

let audioSource;
let analyser;

container.addEventListener('click', function(){
    
    const audioContext = new AudioContext();
    // link audioContext with audio
    audioSource = audioContext.createMediaElementSource(audio);
    // create and connect analyser node
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    // fft size is number of data points collected
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    // create unit8 of audio data
    const dataArray = new Uint8Array(bufferLength);


    //draw 

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // get audio data at time from dataArray
        analyser.getByteFrequencyData(dataArray);
        
        x = 0;
        // code to draw 
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = 'white';
            ctx.fillRect(x, ( canvas.height - barHeight ), barWidth * 2, barHeight);
            x += barWidth;
        }
        
        // frequency data is whole integers from 0 to 255

        requestAnimationFrame(animate);
    }
    animate();
});

file.addEventListener('change', function() {
    const files = this.files;
    const audio = document.getElementById('audio');
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
})

