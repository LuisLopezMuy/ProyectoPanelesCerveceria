const valorConsumoTotal = document.getElementById('valorConsumoTotal');
const valorConsumoPlanta = document.getElementById('valorConsumoPlanta');
const valorConsumoAdmon = document.getElementById('valorConsumoAdmon');
const valorConsumoOtros = document.getElementById('valorConsumoOtros');
const porcConsumoPlanta = document.getElementById('porcConsumoPlanta');
const porcConsumoAdmon = document.getElementById('porcConsumoAdmon');
const porcConsumoOtros = document.getElementById('porcConsumoOtros');

const porcSolar = document.getElementById('porcSolar');
const porcNormal = document.getElementById('porcNormal');
const valorSolar = document.getElementById('valorSolar');
const valorNormal = document.getElementById('valorNormal');

const barraSuperior = document.querySelector('.barra-superior');
const barraInferior = document.querySelector('.barra-inferior');
const iconoSuperior = document.querySelector('.icono-superior');
const iconoInferior = document.querySelector('.icono-inferior');


// Rango de valores
const min = 138.9;
const max = 347.2;

// Valor inicial en el centro
let valor = (min + max) / 2;




// OBTENER ILUMINACIÓN
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Pide acceso a la cámara
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("No se pudo acceder a la cámara:", err));

// Calcula la iluminación promedio (0 a 1)
function obtenerLuminosidad() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let total = 0;
    for (let i = 0; i < frame.data.length; i += 4) {
        // fórmula simple: promedio de R, G, B
        total += (frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3;
    }
    const promedio = total / (frame.data.length / 4);
    return promedio / 255; // Normalizado entre 0 y 1
}





 function actualizarBarras(valor) {

    // Alturas calculadas
    const h1 = valor; // %
    const h2 = 100 - valor; // %

    // Aplicar alturas
    barraSuperior.style.height = h1 + '%';
    barraInferior.style.height = h2 + '%';

    // Ocultar iconos si la barra llega al tope
    iconoSuperior.style.opacity = (h2 > 90) ? 0 : 1;
    iconoInferior.style.opacity = (h1 > 90) ? 0 : 1;
  }






const intervalo = setInterval(() => {
    // Objetivo aleatorio cerca del centro (tendencia suave)
    const objetivo = (min + max) / 2 + (Math.random() - 0.5) * (max - min) * 0.3;

    // Movemos el valor hacia el objetivo suavemente
    valor = objetivo;
    porcPlanta = parseInt(50 + Math.random() * 10); // Entre 50% y 60%
    porcOtros = parseInt(25 + Math.random() * 10); // Entre 25% y 35%
    porcAdmon = 100 - porcPlanta - porcOtros; // Resto para administración


    // Actualizamos el contenido del elemento HTML
    valorConsumoTotal.textContent = parseFloat(valor.toFixed(1));
    valorConsumoPlanta.textContent = parseFloat((valor * porcPlanta / 100).toFixed(1));
    valorConsumoAdmon.textContent = parseFloat((valor * porcAdmon / 100).toFixed(1));
    valorConsumoOtros.textContent = parseFloat((valor * porcOtros / 100).toFixed(1));
    porcConsumoPlanta.textContent = porcPlanta;
    porcConsumoAdmon.textContent = porcAdmon;
    porcConsumoOtros.textContent = porcOtros;

    let luz = parseInt(obtenerLuminosidad() * 150 - 14);
    luz = Math.min(Math.max(luz, 0), 100); // Limitar entre 0 y 100

    porcSolar.textContent = luz;
    porcNormal.textContent = 100 - luz;
    valorSolar.textContent = parseFloat((valor * luz / 100).toFixed(1));
    valorNormal.textContent = parseFloat((valor * (100 - luz) / 100).toFixed(1));

    actualizarBarras(luz);

}, 500);    
