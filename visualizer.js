


// set up container div
const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

//get file
const file = document.getElementById('fileupload');

let audioSource;
let analyser;

container.addEventListener('click', function(){
    
    const audioContext = new AudioContext();

    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        
        x = 0;
        // code to draw 
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = 'white';
            ctx.fillRect(x, ( canvas.height - barHeight ), barWidth * 2, barHeight);
            x += barWidth;
        }
        
        requestAnimationFrame(animate);
    }
    animate();
});

file.addEventListener('change', function() {
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();
})

// frequency data is whole integers from 0 to 255