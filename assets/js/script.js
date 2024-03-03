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
agregarDatos(datos, "numBolas");
function agregarDatos(datos, id) {
    const numBolasInput = document.getElementById(id);
    const datosSinEspacios = datos.map(dato => dato.trim());
    numBolasInput.value = datosSinEspacios.join('\n');
}

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
let agitar = false; // nos ayuda a saber si debemos agitar las bolas
// ayuda = condicionamos para que las bolas puedan salirse de los "limites" -
// - (no se salen pero es una forma de decirlo)
// ayuda2 = ayuda a detener la verificacion de conteo de bolas
let ayuda, ayuda2;
function iniciarMatter() {
    engine = Engine.create();
    world = engine.world;
}

crearBolas();
var ordenBolas = []; // tenemos el orden de bolas que cayeron
var intervalId2; // va con ayuda2, sirve para contar en tiempo real las bolas
var contenidoOpciones = []; // contenido de las opciones
var bolaResultados; // Numero de resultados que seleciona el usuario
function crearBolas() {
    document.querySelector('.g').disabled = false;
    var resultados1Element = document.getElementById("resultados1");
    var resultados2Element = document.getElementById("resultados2");
    bolaResultados = document.getElementById("numResultados").value; // Para detener toda la wea xd
    resultados1Element.value = "" // Limpiamos el contenido
    resultados2Element.value = "" // Limpiamos el contenido
    ayuda = true;
    ayuda2 = true;
    ordenBolas = [];
    contenidoOpciones = [];
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
        const aparecerAltura = 250;
        const x = Math.random() * (limiteX - 40) + 20;
        const y = limiteY / 2 - aparecerAltura + Math.random() * 80;

        const bola = Bodies.circle(x, y, 20, {
            restitution: 0.9,
            friction: 0.1,
            label: 'Circle Body',
            render: {
                fillStyle: getRandomColor(),
                text: {
                    content: `${i + 1}`, // agregamos para saber el orden de las bolas
                },
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
                if (ayuda) {
                    const posicion = bola.position;
                    if (posicion.x < 0 || posicion.x > limiteX || posicion.y < 0 || posicion.y > 579) {
                        // Reiniciar la posición de la bola si está fuera
                        Body.setPosition(bola, { x: Math.random() * (limiteX - 40) + 20, y });
                    }
                } else {
                    const posicion = bola.position;
                    //console.log(posicion.x, limiteX, posicion.y, limiteY);
                    if (posicion.y > 579) {
                        // Reiniciar la posición de la bola si está fuera
                        //ordenBolas.push(texto.innerHTML);
                        texto.innerHTML = "";
                    }
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

    const grosorParedes = 60;
    const paredes = [
        Bodies.rectangle(limiteX / 2, 0, limiteX, grosorParedes, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }), // Pared superior
        Bodies.rectangle(limiteX / 4, limiteY, limiteX / 2 - 60, grosorParedes, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }), // Pared inferior izquierda

        Bodies.rectangle((3 * limiteX) / 4, limiteY, limiteX / 2 - 60, grosorParedes, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }), // Pared inferior dereha
        Bodies.rectangle(0, limiteY / 2, grosorParedes, limiteY, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }), // Pared izquierda
        Bodies.rectangle(limiteX, limiteY / 2, grosorParedes, limiteY, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }), // Pared derecha
    ];
    contexto();

    World.add(world, paredes);
    //engine.timing.timeScale = 0.5;

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

var rampa, cuadradoAbajo;
function contexto() {
    const x = 600, y = 600;
    rampa = [
        Bodies.rectangle(x / 2 - 163, y / 2 + 203, 270, 20, {
            isStatic: true,
            restitution: 1,
            angle: Math.PI / 11,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.rectangle(x / 2 + 163, y / 2 + 203, 270, 20, {
            isStatic: true,
            restitution: 1,
            angle: -Math.PI / 11,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.rectangle(x / 2 + 165, y / 2 + 254, 270, 45, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.rectangle(x / 2 - 165, y / 2 + 254, 270, 45, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.polygon(x / 2 + 250, y / 2 + 220, 3, 40, {
            isStatic: true,
            restitution: 1,
            angle: Math.PI / 2,
            render: { fillStyle: '#04201e' },
            vertices: [{ x: 20, y: 250 }, { x: -100, y: -100 }, { x: 50, y: -50 }]
        }),
        Bodies.polygon(x / 2 - 250, y / 2 + 215, 3, 50, {
            isStatic: true,
            restitution: 1,
            angle: -Math.PI / 2,
            render: { fillStyle: '#04201e' },
            vertices: [{ x: -20, y: 250 }, { x: 100, y: -100 }, { x: -50, y: -50 }]
        }),
    ];
    World.add(world, rampa);
    //World.remove(world, partesJuego1);//no se puede borrar porque todavia no ha sido definido
}
function generarCuadrado() {
    const x = 600, y = 600;
    cuadradoAbajo =
        Bodies.rectangle(x / 2, y / 2 + 266, 600, 69, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' },
            //render: { fillStyle: 'red' },
        });
    World.add(world, cuadradoAbajo);
    //World.remove(world, juego1_1);
}
function getRandomColor() {
    var r = Math.floor(Math.random() * 100) + 155;
    var g = Math.floor(Math.random() * 100) + 155;
    var b = Math.floor(Math.random() * 100) + 155;

    var colorHex = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return colorHex;
}


function comenzar() {
    generarCuadrado();
    ordenBolas = []; // lipiamos
    contenidoOpciones = []; // lipiamos
    if (window.matchMedia("(max-width: 768px)").matches) {
        const alturaTotal = document.documentElement.scrollHeight;
        window.scrollTo({
            top: alturaTotal,
            behavior: 'smooth'
        });
    }
    const contenido = document.getElementById("numBolas").value; // Obtenemos el contenido de textarea opciones
    const lineas = contenido.split('\n'); // Separamos por lineas contenido

    lineas.forEach((linea, index) => {
        const lineaId = index + 1;
        contenidoOpciones.push({ id: lineaId.toString(), texto: linea.trim() }); // asignamos id unico y lo juntamos con el contenido
    });

    console.log(contenidoOpciones);

    const bolaVelocidad = document.getElementById("velocidad").value;
    const bolaDuracion = document.getElementById("duracion").value * 1000;
    const bolaSonido = document.getElementById("sonido").checked;

    engine.timing.timeScale = 0.5; // Volverlo mas lento cuando gira
    setTimeout(() => {
        engine.timing.timeScale = 1; // Volverlo mas rapido cuando caen
    }, bolaDuracion);

    setTimeout(() => {
        World.remove(world, cuadradoAbajo); // eliminar cuadrado que limmita
        configurarSensor(world); // agregar el sensor para eliminar y contar las bolas en orden
    }, bolaDuracion + 500);

    //console.log(bolaVelocidad, bolaDuracion, bolaResultados, bolaSonido);
    if (bolaVelocidad == 'normal') {
        numV = 0.2;
    } else if (bolaVelocidad == 'rapido') {
        numV = 0.3;
    }

    if (bolaSonido == true) {
        switch (bolaDuracion) {
            case 3000:
                var audio = new Audio('./assets/audio/eee3.mp3');
                break;
            case 4000:
                var audio = new Audio('./assets/audio/eee4.mp3');
                break;
            case 5000:
                var audio = new Audio('./assets/audio/eee5.mp3');
                break;
            default:
                console.error('No hay un caso para bolaSonido igual a', bolaSonido);
        }
        audio.volume = 0.2;
        audio.play();
        setTimeout(function () {
            audio.pause();
        }, bolaDuracion + 1600);
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
    ayuda2 = false;
    const verificandoBolas = world.bodies.filter(body => body.label === 'Circle Body').length; // oobtenemos bolas totales
    console.log(bolaResultados);
    document.querySelector('.g').disabled = true;

    intervalId2 = setInterval(() => {
        const bolasEnElMundo = world.bodies.filter(body => body.label === 'Circle Body');
        if ((bolasEnElMundo.length == (verificandoBolas - bolaResultados)) || (bolasEnElMundo.length === 0 && !ayuda2)) {
            // 
            if (bolasEnElMundo.length === 0) {
                console.log("¡Todas las bolas han sido eliminadas!");
            }
            //console.log("Num de resultados: ", bolaResultados);
            console.log(ordenBolas); // Bolas ordendas
            ayuda2 = true;
            obteniendoResultados();
            clearInterval(intervalId2); // Detener el conteo de bolas
        } else if (!ayuda2) {
            //console.log(`Quedan ${bolasEnElMundo.length} bolas en el mundo.`);
        }
    }, 1000); // Guardar bolas eliminadas tambien
}
function obteniendoResultados() {
    const resultadosFinales = [];

    // Verificar si ambos arrays tienen la misma longitud
    if (ordenBolas.length >= bolaResultados) {
        // Mapear el texto de contenidoOpciones según el orden de ordenBolas
        ordenBolas.forEach(id => {
            // Buscar el objeto en contenidoOpciones con el id correspondiente
            const opcion = contenidoOpciones.find(opcion => opcion.id === id);

            // Si se encuentra la opción, agregar su texto a resultadosFinales
            if (opcion) {
                resultadosFinales.push(opcion.texto);
            }
        });
        var resultados1Element = document.getElementById("resultados1");
        var resultados2Element = document.getElementById("resultados2");
        var resultados = [];
        resultados1Element.value = ""
        resultados2Element.value = ""
        resultados1Element.readOnly = false;
        resultados2Element.readOnly = false;
        for (var i = 0; i < bolaResultados; i++) {
            resultados[i] = i + 1 + '. ' + resultadosFinales[i];
        }
        agregarDatos(resultados, "resultados1");
        agregarDatos(resultados, "resultados2");
        resultados1Element.addEventListener("keydown", function (event) {
            event.preventDefault();
        });

        resultados2Element.addEventListener("keydown", function (event) {
            event.preventDefault();
        });
        console.log(resultadosFinales);
    } else {
        console.error('Los arrays ordenBolas y contenidoOpciones deben tener la misma longitud.');
    }
}

// Función para configurar el sensor
function configurarSensor(world) {
    ordenBolas = []; // limpiamos 
    ayuda = false; // se acmbia a false para que no reposicione las bolas fuera del limite
    const limiteX = 600, limiteY = 600;

    const sensor = Bodies.rectangle(limiteX / 2, limiteY, 60, 1, {
        isSensor: true,
        isStatic: true,
        render: { fillStyle: 'red' }
    });

    World.add(world, sensor);

    Events.on(engine, 'collisionStart', (event) => {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair.bodyA === sensor && pair.bodyB.label === 'Circle Body') {
                const textoBola = pair.bodyB.render.text.content;
                ordenBolas.push(textoBola);
                eliminarBola(world, pair.bodyB);
            } else if (pair.bodyB === sensor && pair.bodyA.label === 'Circle Body') {
                const textoBola = pair.bodyA.render.text.content;
                ordenBolas.push(textoBola);
                eliminarBola(world, pair.bodyA);
            }
        }
    });
}

function eliminarBola(world, bola) {
    const textoAsociado = bola.render.text;
    if (textoAsociado) {
        World.remove(world, textoAsociado);
    }
    World.remove(world, bola);
    World.remove(world, bola);
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