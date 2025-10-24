        const video = document.getElementById('video');
        const canvas = document.getElementById('hiddenCanvas');
        const ctx = canvas.getContext('2d');
        const valueEl = document.getElementById('value');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');

        let stream = null;
        let rafId = null;

        // Muestra un cuadro cada X ms (muestreo). Ajusta si quieres más/menos frecuencia.
        const SAMPLE_INTERVAL_MS = 500;

        // reduce resolution for faster processing
        const SAMPLE_WIDTH = 80;
        const SAMPLE_HEIGHT = 60;

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "environment" },
                    audio: false
                });
                video.srcObject = stream;
                startBtn.disabled = true;
                stopBtn.disabled = false;
                // espera a que el video empiece
                await video.play();
                canvas.width = SAMPLE_WIDTH;
                canvas.height = SAMPLE_HEIGHT;
                runLoop();
            } catch (err) {
                alert('No se pudo acceder a la cámara: ' + (err.message || err));
                console.error(err);
            }
        }

        function stopCamera() {
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
                stream = null;
            }
            startBtn.disabled = false;
            stopBtn.disabled = true;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            valueEl.textContent = '—';
        }

        // calcula luminosidad promedio de los píxeles
        function computeAverageLuminance(imageData) {
            // imageData.data is [r,g,b,a, r,g,b,a, ...]
            const data = imageData.data;
            let sum = 0;
            // para velocidad, muestreamos cada N píxeles (stride)
            const stride = 4 * 2; // saltar cada 2 píxeles (ajustable)
            for (let i = 0; i < data.length; i += stride) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // luminancia perceptual (fórmula estándar)
                const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                sum += lum;
            }
            const count = data.length / stride;
            return sum / count;
        }

        let lastSampleTime = 0;
        function runLoop(timestamp) {
            if (!lastSampleTime) lastSampleTime = timestamp;
            // usamos requestAnimationFrame para sincronizar; procesamos cada SAMPLE_INTERVAL_MS
            if (timestamp - lastSampleTime >= SAMPLE_INTERVAL_MS) {
                // dibuja video escalado en canvas reducido
                try {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const avg = computeAverageLuminance(img);
                    // redondea a 1 decimal
                    valueEl.textContent = Math.round(avg * 10) / 10;
                } catch (e) {
                    console.warn('Error al procesar frame:', e);
                }
                lastSampleTime = timestamp;
            }
            rafId = requestAnimationFrame(runLoop);
        }

        // eventos botones
        startBtn.addEventListener('click', startCamera);
        stopBtn.addEventListener('click', stopCamera);

        // limpiar al cerrar la página
        window.addEventListener('beforeunload', stopCamera);