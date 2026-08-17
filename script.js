const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const hackScreen = document.getElementById("hack-screen");
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
const anonymousScreen = document.getElementById("anonymous-screen");
const finalScreen = document.getElementById("final-screen");
const vozHacker = document.getElementById("voz-hacker");
const YOUTUBE_URL = "https://www.youtube.com/shorts/PXyB-GLMBTs";

// Crear elemento de audio para la rana
const sonidoRana = new Audio();
sonidoRana.src = "https://res.cloudinary.com/qzptjn5p/video/upload/v1786897717/sonido-rana.mp3.mp3";
sonidoRana.loop = false;
sonidoRana.preload = "auto";

// Flag para evitar que se ejecute múltiples veces
let yaHizoClic = false;

// Función para reproducir sonido de rana
function reproducirSonidoRana() {
    try {
        sonidoRana.currentTime = 0;
        sonidoRana.play().catch(err => console.log("No se puede reproducir el sonido:", err));
    } catch (err) {
        console.log("Audio no disponible:", err);
    }
}

startButton.addEventListener("click", () => {
    
    // Evitar que se ejecute múltiples veces
    if (yaHizoClic) return;
    yaHizoClic = true;

    // Ocultar pantalla inicial
    startScreen.style.display = "none";

    // Reproducir sonido de rana
    reproducirSonidoRana();
    
    // Mostrar la rana
    document.getElementById("inicio").style.display = "flex";
    
    // Detener el sonido de rana exactamente a los 4 segundos (no depender de su duración)
    setTimeout(() => {
        sonidoRana.pause();
        sonidoRana.currentTime = 0;
    }, 4000);
    
    // Iniciar Matrix después de 4 segundos (cuando termina la rana y su música)
    setTimeout(() => {
        document.getElementById("inicio").style.display = "none";
        hackScreen.classList.add("active");
        iniciarMatrix();
    }, 4000);
    
    // Terminar Matrix después de 2 segundos más y mostrar Anonymous
    setTimeout(() => {
        hackScreen.classList.remove("active");
        
        // Mostrar pantalla de Anonymous
        anonymousScreen.classList.add("active");
        
        // Reproducir la voz del hacker solo una vez
        vozHacker.pause();
        vozHacker.currentTime = 0;
        vozHacker.play().catch(err => console.log("No se puede reproducir la voz:", err));
    }, 6000);
    

});

let width;
let height;

let fontSize = 22;
let columns;
let drops;

function ajustarCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    columns = Math.floor(width / fontSize);

    drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -50;
    }
}

function dibujarMatrix() {

    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#00ff41";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {

        const numero = Math.random() > 0.5 ? "0" : "1";

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(numero, x, y);

        // Cuando llega abajo, vuelve a empezar
        if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i] += 0.7;
    }
}

function iniciarMatrix() {
    ajustarCanvas();

    function animar() {
        if (hackScreen.classList.contains("active")) {
            dibujarMatrix();
            requestAnimationFrame(animar);
        }
    }

    animar();
}

window.addEventListener("resize", ajustarCanvas);

let finalSequenceStarted = false;

function mostrarPantallaFinal() {
    if (finalSequenceStarted) return;
    finalSequenceStarted = true;

    const anonymousScreen = document.getElementById("anonymous-screen");
    if (anonymousScreen) anonymousScreen.classList.remove("active");

    if (!finalScreen) return;

    finalScreen.style.display = "flex";
    finalScreen.style.opacity = "1";
    finalScreen.style.transform = "scale(1)";
    finalScreen.style.transition = "all 0.6s ease";

    let status = document.getElementById("redirect-status");
    if (!status) {
        status = document.createElement("div");
        status.id = "redirect-status";
        status.textContent = "ESPERA... 2 SEGUNDOS";
        status.className = "redirect-status";
        const box = finalScreen.querySelector("#final-content") || finalScreen;
        box.appendChild(status);
    }

    setTimeout(() => {
        window.location.href = YOUTUBE_URL;
    }, 2000);
}

vozHacker.addEventListener("ended", () => {
    setTimeout(() => {
        mostrarPantallaFinal();
    }, 400);
});

// fallback
setTimeout(() => {
    if (!finalSequenceStarted) {
        mostrarPantallaFinal();
    }
}, 25000);

function iniciarCuentaRegresiva() {
    const countdown = document.getElementById("countdown") || document.getElementById("final-countdown");
    if (!countdown || !finalScreen) return;

    const box = finalScreen.querySelector(".final-box") || finalScreen;

    let numero = 5;
    countdown.textContent = "5";

    // quitar status anterior
    const oldStatus = document.getElementById("redirect-status");
    if (oldStatus) oldStatus.remove();

    const intervalo = setInterval(() => {
        numero--;

        if (numero > 0) {
            countdown.textContent = String(numero);
            return;
        }

        clearInterval(intervalo);
        countdown.textContent = "0";

        const status = document.createElement("div");
        status.id = "redirect-status";
        status.textContent = "ESPERA... 2 SEGUNDOS";
        status.style.cssText = `
            margin-top: 16px;
            font-size: 18px;
            letter-spacing: 0.25em;
            color: #00ff41;
            text-transform: uppercase;
            font-weight: 800;
            text-shadow: 0 0 12px rgba(0,255,65,0.95);
            animation: hackerBlink 0.32s steps(2, end) infinite;
        `;

        box.appendChild(status);

        let style = document.getElementById("hacker-blink-style");
        if (!style) {
            style = document.createElement("style");
            style.id = "hacker-blink-style";
            style.textContent = `
                @keyframes hackerBlink {
                    0%, 100% { opacity: 1; filter: brightness(1.2); }
                    50% { opacity: 0.18; filter: brightness(2.2); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            window.location.href = YOUTUBE_URL;
        }, 2000);
    }, 1000);
}


