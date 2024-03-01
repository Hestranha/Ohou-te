const { Engine, Render, Bodies, World, Body, Events } = Matter;

let engine;
let world;
let agitar = false;

function iniciarMatter() {
    engine = Engine.create();
    world = engine.world;
}


function crearBolas() {
    const numBolasInput = document.getElementById("numBolas");
    const numBolas = parseInt(numBolasInput.value);

    if (isNaN(numBolas) || numBolas <= 0) {
        alert("Ingresa un número válido de bolas.");
        return;
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
        texto.innerHTML = `${i + 1}`;
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
            }
        });
    }

    const paredes = [
        Bodies.rectangle(limiteX / 2, 0, limiteX, 50, { isStatic: true, restitution: 1, collisionFilter: { group: -1 } }), // Pared superior
        Bodies.rectangle(limiteX / 2, limiteY, limiteX, 50, { isStatic: true, restitution: 1, collisionFilter: { group: -1 } }), // Pared inferior
        Bodies.rectangle(0, limiteY / 2, 50, limiteY, { isStatic: true, restitution: 1, collisionFilter: { group: -1 } }), // Pared izquierda
        Bodies.rectangle(limiteX, limiteY / 2, 50, limiteY, { isStatic: true, restitution: 1, collisionFilter: { group: -1 } }), // Pared derecha

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
    agitar = true;

    setTimeout(() => {
        agitar = false;
    }, 3000);
    const intervalId = setInterval(() => {
        if (agitar) {
            for (const body of world.bodies) {
                if (body.label === 'Circle Body') {
                    applyRandomForce(body);
                }
            }
        } else {
            clearInterval(intervalId);
        }
    }, 10);
}

function applyRandomForce(body) {
    const fuerzaX = (Math.random() - 0.5) * 0.2;
    const fuerzaY = (Math.random() - 0.5) * 0.2;
    Body.applyForce(body, body.position, { x: fuerzaX, y: fuerzaY });
}
