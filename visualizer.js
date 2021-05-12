// set up container div
const container = document.getElementById('container');

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    // create shapes
    let geometry1 = new THREE.BoxGeometry(1, 1, 1);
    let material1 = new THREE.MeshBasicMaterial( { color: 'rgb(255, 0,0)' } );

    let geometry2 = new THREE.BoxGeometry(1, 1, 1);
    let material2 = new THREE.MeshBasicMaterial( { color: 'rgb(255, 0,0)' } );

    let geometry3 = new THREE.BoxGeometry(1, 1, 1);
    let material3 = new THREE.MeshBasicMaterial( { color: 'rgb(255, 0,0)' } );

    const cube1 = new THREE.Mesh( geometry1, material1 );
    scene.add( cube1 ); 

    const cube2 = new THREE.Mesh( geometry2, material2 );
    scene.add( cube2 ); 

    const cube3 = new THREE.Mesh( geometry3, material3 );
    scene.add( cube3 ); 

    // ring
    const geometry4 = new THREE.RingGeometry( 1, 5, 16 );
    const material4 = new THREE.MeshBasicMaterial( { color: 'rgb(255, 0,0)', side: THREE.DoubleSide } );
    const ring = new THREE.Mesh( geometry4, material4 );
    scene.add( ring );

    camera.position.z = 5;


    function animate() {
        analyser.getByteFrequencyData(dataArray);  

        // create equally lengthed subsets of dataArray
        let section = dataArray.length / 4
        let section1 = dataArray.slice(0, section);
        let section2 = dataArray.slice(section, section*2);
        let section3 = dataArray.slice(section*2, section*3);

        // create array of sections
        const sections = [section1, section2, section3];
        
        // compute average of array
        let avgFrq = ( dataArray.reduce((a, b) => a + b) / dataArray.length ) /100;
        let s1AvgFrq = ( section1.reduce((a, b) => a + b) / section1.length );
        let s2AvgFrq = ( section2.reduce((a, b) => a + b) / section2.length );
        let s3AvgFrq = ( section3.reduce((a, b) => a + b) / section3.length );

        let c1Color = s1AvgFrq/1;
        let c2Color = s2AvgFrq*2;
        let c3Color = s3AvgFrq * 4;


        cube1.scale.x = innerWidth;
        cube1.scale.y = s1AvgFrq / 30;
        cube1.position.set(0, 0, 0);
        cube1.material.color.set( (255, c1Color, c1Color) );
        

        cube2.scale.x = innerWidth;
        cube2.scale.y = s2AvgFrq / 40;
        cube2.position.set(0, 0, 1);
        cube2.material.color.set( (255, 255, c2Color) );

        cube3.scale.x = innerWidth;
        cube3.scale.y = s2AvgFrq / 90;
        cube3.position.set(0, 0, 2);
        cube3.material.color.set( (255, 200, c3Color) );

        // ring.scale.x = innerWidth;
        ring.scale.x = avgFrq * 1.7;
        ring.scale.y = avgFrq * 1.7;
        ring.position.set(0, 0, 3);
        ring.material.color.set( 'red' );

        // render scene
        renderer.render( scene, camera );
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
