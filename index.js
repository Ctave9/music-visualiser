window.onload = function () {

    let file = document.getElementById("thefile");
    let audio = document.getElementById("audio");

    file.onchange = function () {
        let files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        let context = new AudioContext();
        let src = context.createMediaElementSource(audio);
        let analyser = context.createAnalyser();

        let canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        let bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        let dataArray = new Uint8Array(bufferLength);
        let displayedArray = new Uint8Array(bufferLength);

        let WIDTH = canvas.width;
        let HEIGHT = canvas.height;

        let barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        let supposedY = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 10;
            ctx.lineJoin = "round";
            ctx.beginPath();



            let c = 0;
            for (let i = 0; i < bufferLength; i++) {
                displayedArray[i] += (dataArray[i] - displayedArray[i]) / 8;
                for (let j = 0; j < 10; j++) {

                    barHeight = displayedArray[i];

                    supposedY += (barHeight - supposedY) / 50;

                    let r = barHeight + (25 * (i / bufferLength));
                    let g = 250 * (i / bufferLength);
                    let b = 50;

                    if (i < 20) {
                        ctx.strokeStyle = "rgb(" + supposedY + "," + supposedY / 3 + "," + Math.round(50 - supposedY / 2) + ", 0.5)";
                        console.log(100 - supposedY);
                    }
                    // ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    ctx.lineTo(x, (HEIGHT - (supposedY) - HEIGHT / 3) * (c % 2 === 0 ? 1 : 5));

                    x += (barWidth + 1) / 25;
                    c++;
                }
            }
            ctx.stroke();
            ctx.lineWidth = 5;
            ctx.beginPath();
            c = 0;
            x = 0;
            for (let i = 0; i < bufferLength; i++) {
                for (let j = 0; j < 10; j++) {

                    barHeight = displayedArray[i];

                    supposedY += (barHeight - supposedY) / 50;

                    let r = barHeight + (25 * (i / bufferLength));
                    let g = 250 * (i / bufferLength);
                    let b = 50;

                    if (i < 20) {
                        ctx.strokeStyle = "rgb(" + supposedY + "," + supposedY / 3 + "," + Math.round(50 - supposedY / 2) + ")";
                    }
                    // ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    ctx.lineTo(x, (HEIGHT - (supposedY) - HEIGHT / 3) - 5);

                    x += (barWidth + 1) / 25;
                    c++;
                }
            }
            ctx.stroke();
        }

        audio.play();
        renderFrame();
    };

};

