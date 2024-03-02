/**********************************************************/
/**********************************************************/
/**********************************************************/
var entradas = 10;
function limitarLongitud() {
    var input = document.getElementById("numResultados");
    if (input.value.length > 2) {
        input.value = input.value.slice(0, 2); // Limita la longitud a dos caracteres
    }
    if (input.value < 1) {
        input.value = 1;
    } else if (input.value > entradas) {
        input.value = entradas;
    }
    // if (input.value.length < 2) {
    //     input.value = "0" + input.value;
    // }
    input.max = entradas;
}

function agregarDatos() {
    const numBolasInput = document.getElementById("numBolas");

    const datos = [
        "Opción 01",
        "Opción 02",
        "Opción 03",
        "Opción 04",
        "Opción 05",
        "Opción 06",
        "Opción 07",
        "Opción 08",
        "Opción 09",
        "Opción 10"
    ];
    const datosSinEspacios = datos.map(dato => dato.trim());
    numBolasInput.value = datosSinEspacios.join('\n');
}

agregarDatos();

function limitarCaracteres(elemento, maxCaracteres, maxFilas) {
    let lines = elemento.value.split('\n');
    if (lines.length > maxFilas) {
        lines = lines.slice(0, maxFilas);
    }
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > maxCaracteres) {
            lines[i] = lines[i].substring(0, maxCaracteres);
        }
    }
    elemento.value = lines.join('\n');
}

const agregarCeroIzquierda = numero => (numero < 10 ? "0" : "") + numero;
function numFilas(valor) {
    const posibilidadesTotalesInput = document.getElementById("posibilidades-totales");
    const numBolasInput = document.getElementById("numBolas");
    const contenidoNumBolas = numBolasInput.value;
    const lineasNumBolas = contenidoNumBolas.split(/\r?\n/).filter(linea => linea.trim() !== '');
    const numLineasNumBolas = lineasNumBolas.length;
    const numLineasFormateado = agregarCeroIzquierda(numLineasNumBolas);

    posibilidadesTotalesInput.value = numLineasFormateado;
    entradas = numLineasFormateado;
    var input = document.getElementById("numResultados");
    input.value = 1;
    // if (input.value.length < 2) {
    //     input.value = "0" + input.value;
    // }
}

/**********************************************************/
/**********************************************************/
/**********************************************************/
/**********************************************************/
/**********************************************************/
/**********************************************************/
const { Engine, Render, Bodies, World, Body, Events } = Matter;

let engine;
let world;
let agitar = false;

function iniciarMatter() {
    engine = Engine.create();
    world = engine.world;
}

crearBolas();
function crearBolas() {
    const numBolasInput = document.getElementById("numBolas");
    const contenido = numBolasInput.value;

    const lineas = contenido.split(/\r?\n/).filter(linea => linea.trim() !== '');

    const numBolas = lineas.length;

    if (numBolas === 0) {
        alert("Ingresa al menos una línea de texto.");
    }

    const bolasContainer = document.getElementById("bolas");
    bolasContainer.innerHTML = "";

    iniciarMatter();

    const limiteX = 600;
    const limiteY = 600;

    for (let i = 0; i < numBolas; i++) {
        const x = Math.random() * (limiteX - 40) + 20;
        const y = Math.random() * (limiteY - 40) + 20;

        const bola = Bodies.circle(x, y, 20, {
            restitution: 0.8,
            friction: 0.1,
            label: 'Circle Body',
            render: {
                fillStyle: getRandomColor(),
            },
        });

        World.add(world, bola);

        const texto = document.createElement('div');
        texto.innerHTML = agregarCeroIzquierda(i + 1);
        texto.style.position = 'absolute';
        texto.style.color = "#000000";
        bolasContainer.appendChild(texto);

        // Actualizar posición del texto en cada frame
        Events.on(engine, 'beforeUpdate', () => {
            if (bola) {
                const posicion = bola.position;
                const anchoTexto = texto.offsetWidth;
                const altoTexto = texto.offsetHeight;

                texto.style.left = `${posicion.x - anchoTexto / 2}px`;  // Centrar horizontalmente
                texto.style.top = `${posicion.y - altoTexto / 2}px`;    // Centrar verticalmente

                // Verificar si la bola está fuera del área visible
                if (posicion.x < 0 || posicion.x > limiteX || posicion.y < 0 || posicion.y > limiteY) {
                    // Reiniciar la posición de la bola si está fuera
                    Body.setPosition(bola, { x: Math.random() * (limiteX - 40) + 20, y: Math.random() * (limiteY - 40) + 20 });
                }
            }
        });
        /*
        Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;
            for (const pair of pairs) {
                const { bodyA, bodyB } = pair;
                if (bodyA.label === 'Circle Body' && bodyB.label === 'Circle Body') {
                    // Choque entre dos bolas, reproduce el sonido
                    playCollisionSound();
                }
            }
        });
        */
    }

    const paredes = [
        Bodies.rectangle(limiteX / 2, 0, limiteX, 50, { isStatic: true, restitution: 1, collisionFilter: { group: -1 }, render: { fillStyle: '#04201e' } }), // Pared superior
        Bodies.rectangle(limiteX / 2, limiteY, limiteX, 50, { isStatic: true, restitution: 1, collisionFilter: { group: -1 }, render: { fillStyle: '#04201e' } }), // Pared inferior
        Bodies.rectangle(0, limiteY / 2, 50, limiteY, { isStatic: true, restitution: 1, collisionFilter: { group: -1 }, render: { fillStyle: '#04201e' } }), // Pared izquierda
        Bodies.rectangle(limiteX, limiteY / 2, 50, limiteY, { isStatic: true, restitution: 1, collisionFilter: { group: -1 }, render: { fillStyle: '#04201e' } }), // Pared derecha

        // Bodies.rectangle(limiteX / 2, limiteY / 2 - 100, 800, 10, { isStatic: true, restitution: 1 }),
        // Bodies.rectangle(limiteX / 2 - 30, limiteY / 2 - 70, 10, 40, { isStatic: true, restitution: 1 }),
        // Bodies.rectangle(limiteX / 2 + 30, limiteY / 2  - 70, 10, 40, { isStatic: true, restitution: 1 }),

    ];

    World.add(world, paredes);

    engine.timing.timeScale = 0.5;

    const render = Render.create({
        element: bolasContainer,
        engine: engine,
        options: {
            width: limiteX,
            height: limiteY,
            wireframes: false,
            background: '#fafffe',
        },
    });

    Render.run(render);
    Engine.run(engine);
}

function getRandomColor() {
    var r = Math.floor(Math.random() * 100) + 155;
    var g = Math.floor(Math.random() * 100) + 155;
    var b = Math.floor(Math.random() * 100) + 155;

    var colorHex = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return colorHex;
}

function girar() {
    const bolaVelocidad = document.getElementById("velocidad").value;
    const bolaDuracion = document.getElementById("duracion").value * 1000;
    const bolaResultados = document.getElementById("numResultados").value;
    const bolaSonido = document.getElementById("sonido").checked;
    console.log(bolaVelocidad, bolaDuracion, bolaResultados, bolaSonido);
    if (bolaVelocidad == 'normal') {
        numV = 0.2;
    } else if (bolaVelocidad == 'rapido') {
        numV = 0.5;
    }
    if (bolaSonido == true) {
        switch (bolaDuracion) {
            case 3000:
                var audio = new Audio('./audio/eee5.mp3');
                break;
            case 4000:
                var audio = new Audio('./audio/eee6.mp3');
                break;
            case 5000:
                var audio = new Audio('./audio/eee7.mp3');
                break;
            default:
                console.error('No hay un caso para bolaSonido igual a', bolaSonido);
        }
        audio.volume = 0.2;
        audio.play();
        setTimeout(function () {
            audio.pause();
        }, bolaDuracion+1600);
    } else if (bolaSonido == false) {
        console.log('sin sonido :c');
    }

    agitar = true;

    setTimeout(() => {
        agitar = false;
    }, bolaDuracion);
    
    const intervalId = setInterval(() => {
        if (agitar) {
            for (const body of world.bodies) {
                if (body.label === 'Circle Body') {
                    applyRandomForce(body, numV);
                }
            }
        } else {
            clearInterval(intervalId);
        }
    }, 1);
}

function applyRandomForce(body, num) {
    const fuerzaX = (Math.random() - 0.5) * num;
    const fuerzaY = (Math.random() - 0.5) * num;
    Body.applyForce(body, body.position, { x: fuerzaX, y: fuerzaY });
}
/*
function playCollisionSound() {
    const collisionSound = new Audio('./audio/colision2.mp3');
    collisionSound.volume = 0.2;
    if (collisionSound.paused) {
        // Iniciar la reproducción
        collisionSound.play();
    } else {
        // Reiniciar la reproducción desde el principio si ya está en reproducción
        collisionSound.currentTime = 0;
    }
}
*/