const { Engine, Render, Bodies, World, Constraint } = Matter;

let engine;
let world;

function iniciarMatter() {
    engine = Engine.create();
    world = engine.world;
}

function setup() {
    createCanvas(500, 500);
}

function draw() {
    background("#140720");
    if (world && world.bodies) {
        for (const body of world.bodies) {
            if (body.label === 'Circle Body') {
                fill(0); // Establece el color del texto en negro
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(14);

                
                fill(body.render.text.backgroundColor);
                ellipse(body.position.x, body.position.y, body.circleRadius * 2);

                fill("#000");
                text(body.render.text.content, body.position.x, body.position.y);
            }
        }
    }
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

    const limiteX = 500;
    const limiteY = 500;

    for (let i = 0; i < numBolas; i++) {
        const x = Math.random() * (limiteX - 40) + 20;
        const y = Math.random() * (limiteY - 40) + 20;

        const bola = Bodies.circle(x, y, 20, {
            restitution: 0.8,
            friction: 0.1,
            label: 'Circle Body',
            render: {
                fillStyle: getRandomColor(),
                text: {
                    content: `Bola ${i + 1}`,
                    backgroundColor: getRandomColor(),
                    size: 14,
                    color: "#fff",
                },
            },
        });

        World.add(world, bola);
    }

    const paredes = [
        Bodies.rectangle(limiteX / 2, 0, limiteX, 5, { isStatic: true }),
        Bodies.rectangle(limiteX / 2, limiteY, limiteX, 5, { isStatic: true }),
        Bodies.rectangle(0, limiteY / 2, 5, limiteY, { isStatic: true }),
        Bodies.rectangle(limiteX, limiteY / 2, 5, limiteY, { isStatic: true }),
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
    var r = Math.floor(Math.random() * 100) + 155; // Rojo en el rango 155-255
    var g = Math.floor(Math.random() * 100) + 155; // Verde en el rango 155-255
    var b = Math.floor(Math.random() * 100) + 155; // Azul en el rango 155-255

    var colorHex = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return colorHex;
}
