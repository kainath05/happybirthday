navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function checkVolume() {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length;

            if (average > 100) { // Threshold for detecting a loud sound
                document.getElementById('candle').style.display = 'none';
                document.getElementById('status').textContent = 'Candle blown out!';
            }

            requestAnimationFrame(checkVolume);
        }

        checkVolume();
    })
    .catch(err => {
        console.error('Error accessing audio media:', err);
    });
