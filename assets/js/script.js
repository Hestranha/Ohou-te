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
    entradas = numLineasNumBolas;
    var input = document.getElementById("numResultados");
    input.value = entradas;
    // if (input.value.length < 2) {
    //     input.value = "0" + input.value;
    // }
    //actualizarBolasEnTiempoReal();
}
function actualizarBolasEnTiempoReal() {
    const numBolasInput = document.getElementById("numBolas");
    const nuevoValor = parseInt(numBolasInput.value);

    // Verificar si el valor de entradas ha cambiado
    if (nuevoValor !== entradas) {
        // Actualizar el valor de entradas
        entradas = nuevoValor;

        // Eliminar las bolas existentes
        eliminarTodasLasBolas(world);

        // Crear nuevas bolas con el nuevo número
        crearBolas();
    }
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
let ayuda, ayuda2, ayuda3 = true; // ayuda3 = ayuda a detener la verificacion de conteo de bolas
function iniciarMatter() {
    engine = Engine.create();
    world = engine.world;
}

crearBolas();
var ordenBolas = []; // tenemos el orden de bolas que cayeron
var intervalId2; // va con ayuda2, sirve para contar en tiempo real las bolas
var contenidoOpciones = []; // contenido de las opciones
var bolaResultados; // Numero de resultados que seleciona el usuario
var borrarBolas = false; // Para empezar a borrar bolas si es que hay en el mundo
var k = 0; // nos ayuda a asignar el orden de resultados al momento de eliminar la bola
var moverBolasConMouse = false;
function crearBolas() {
    //Copiar texto
    document.querySelector('.boton2Copiar').disabled = true;
    document.querySelector('.Btn').disabled = true;

    container_confetti.remove();
    ayuda3 = false;
    document.querySelector('.g').disabled = false;
    var resultados1Element = document.getElementById("resultados1");
    var resultados2Element = document.getElementById("resultados2");

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
    if (borrarBolas) {
        eliminarTodasLasBolas(world);
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
            restitution: 0.8,
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
        texto.innerHTML = `<strong>${i + 1}<strong>`;
        texto.style.position = 'absolute';
        texto.style.color = "#000000";
        bolasContainer.appendChild(texto);


        texto.addEventListener('mouseover', () => {
            if (moverBolasConMouse) {
                moverBola(bola);
            }
        });


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

    const grosorParedes = 80;
    const paredes = [
        Bodies.rectangle(limiteX / 2, 0, limiteX, grosorParedes, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }), // Pared superior
        Bodies.rectangle(limiteX / 4, limiteY, limiteX / 2 - 80, grosorParedes, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }), // Pared inferior izquierda

        Bodies.rectangle((3 * limiteX) / 4, limiteY, limiteX / 2 - 80, grosorParedes, {
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
    borrarBolas = true;
}
function activarMovimiento() {
    console.log("click papi");
    moverBolasConMouse = !moverBolasConMouse;
}
function moverBola(bola) {
    const fuerzaX = (Math.random() - 0.5) * 0.3;
    const fuerzaY = (Math.random() - 0.5) * 0.3;
    Body.applyForce(bola, bola.position, { x: fuerzaX, y: fuerzaY });
}

function eliminarTodasLasBolas(world) {
    const bolasEnElMundo = world.bodies.filter(body => body.label === 'Circle Body');

    for (const bola of bolasEnElMundo) {
        const textoAsociado = bola.render.text;
        if (textoAsociado) {
            World.remove(world, textoAsociado);
        }
        World.remove(world, bola);
    }
}

var rampa, cuadradoAbajo;
function contexto() {
    const x = 600, y = 600;
    rampa = [
        Bodies.rectangle(x / 2 - 173, y / 2 + 203, 270, 20, {
            isStatic: true,
            restitution: 1,
            angle: Math.PI / 11,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.rectangle(x / 2 + 173, y / 2 + 203, 270, 20, {
            isStatic: true,
            restitution: 1,
            angle: -Math.PI / 11,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.rectangle(x / 2 + 175, y / 2 + 254, 270, 45, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.rectangle(x / 2 - 175, y / 2 + 254, 270, 45, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' }
        }),
        Bodies.polygon(x / 2 + 270, y / 2 + 220, 3, 40, {
            isStatic: true,
            restitution: 1,
            angle: Math.PI / 2,
            render: { fillStyle: '#04201e' },
            vertices: [{ x: 20, y: 250 }, { x: -100, y: -100 }, { x: 50, y: -50 }]
        }),
        Bodies.polygon(x / 2 - 270, y / 2 + 215, 3, 50, {
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

function changeIcon() {
    var resultTextarea1 = document.getElementById('resultados1');
    resultTextarea1.select();
    document.execCommand('copy');
    //var texto1Element = document.getElementById('copiado1');
    //texto1Element.innerText = 'Copiado';
    window.getSelection().removeAllRanges();
    var iconContainer = document.getElementById('iconContainer');
    iconContainer.innerHTML = '<svg fill="white" viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm124.1 191.1L207.3 380.8c-4.686 4.686-12.28 4.686-16.97 0L131.9 324.9c-4.686-4.686-4.686-12.28 0-16.97 4.686-4.686 12.28-4.686 16.97 0l46.04 46.04 134.5-134.5c4.686-4.686 12.28-4.686 16.97 0 4.686 4.686 4.686 12.28 0 16.97z"></path></svg>';
    setTimeout(function () {
        iconContainer.innerHTML = '<svg fill="white" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>';
        //texto1Element.innerText = 'Copiar';
    }, 2500);
}
function changeIcon1() {
    var resultTextarea1 = document.getElementById('resultados2');
    resultTextarea1.select();
    document.execCommand('copy');
    //var texto1Element = document.getElementById('copiado2');
    //texto1Element.innerText = 'Copiado';
    window.getSelection().removeAllRanges();
    var iconContainer = document.getElementById('iconContainer1');
    iconContainer.innerHTML = '<svg fill="white" viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm124.1 191.1L207.3 380.8c-4.686 4.686-12.28 4.686-16.97 0L131.9 324.9c-4.686-4.686-4.686-12.28 0-16.97 4.686-4.686 12.28-4.686 16.97 0l46.04 46.04 134.5-134.5c4.686-4.686 12.28-4.686 16.97 0 4.686 4.686 4.686 12.28 0 16.97z"></path></svg>';
    setTimeout(function () {
        iconContainer.innerHTML = '<svg fill="white" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>';
        //texto1Element.innerText = 'Copiar';
    }, 2500);
}
function comenzar() {
    crearBolas();
    const bolaMovimiento = document.getElementById("movimiento").checked;
    bolaResultados = document.getElementById("numResultados").value; // Para detener toda la wea xd
    const bolaVelocidad = document.getElementById("velocidad").value;
    const bolaDuracion = document.getElementById("duracion").value * 1000;
    const bolaSonido = document.getElementById("sonido").checked;
    if (!bolaMovimiento) {
        var linea = Bodies.rectangle(600 / 2, 600 / 2 - 100, 600, 10, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: '#04201e' },
            //render: { fillStyle: 'red' },
        });
        World.add(world, linea);
        setTimeout(() => {
            World.remove(world, linea);
        }, bolaDuracion - 1500);
    }
    document.querySelector('.g').disabled = true;
    document.querySelector('.cB').disabled = true;
    setTimeout(() => {
        document.querySelector('.cB').disabled = false;
    }, 2000);
    setTimeout(() => {
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

        //console.log(contenidoOpciones);
        /// aqui estaban antes las declaraciones iniciales de esta funcion
        engine.timing.timeScale = 0.35; // Volverlo mas lento cuando gira
        setTimeout(() => {
            engine.timing.timeScale = 1; // Volverlo mas rapido cuando caen
        }, bolaDuracion - 1500);

        setTimeout(() => {
            World.remove(world, cuadradoAbajo); // eliminar cuadrado que limmita
            configurarSensor(world); // agregar el sensor para eliminar y contar las bolas en orden
        }, bolaDuracion - 500);

        //console.log(bolaVelocidad, bolaDuracion, bolaResultados, bolaSonido);
        if (bolaVelocidad == 'normal') {
            numV = 0.18;
        } else if (bolaVelocidad == 'rapido') {
            numV = 0.3;
        }
        if (!bolaMovimiento) {
            console.log('se cambia a 0');
            engine.timing.timeScale = 1;
            numV = 0;
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
            }, bolaDuracion + 2000);
        } else if (bolaSonido == false) {
            console.log('sin sonido :c');
        }

        agitar = true;

        setTimeout(() => {
            agitar = false;

        }, bolaDuracion - 2000);

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
        //console.log(bolaResultados);

        setTimeout(() => {
            intervalId2 = setInterval(() => {
                const bolasEnElMundo = world.bodies.filter(body => body.label === 'Circle Body');
                //console.log(`Quedan ${bolasEnElMundo.length} aaaaaaaaaaaaaaaa.`);
                //console.log(bolasEnElMundo.length, verificandoBolas - bolaResultados);
                if (((bolasEnElMundo.length == (verificandoBolas - bolaResultados)) || (bolasEnElMundo.length === 0)) && !ayuda2) {
                    // 
                    if (bolasEnElMundo.length === 0) {
                        console.log("¡Todas las bolas han sido eliminadas!");
                    } else {
                        console.log("Bolas quedando", bolasEnElMundo.length);
                    }
                    //console.log("Num de resultados: ", bolaResultados);
                    //console.log(ordenBolas); // Bolas ordendas
                    ayuda2 = true;
                    //obteniendoResultados();
                    //Activar lo de abajo si quieres fuegos artificales
                    /*
                    if (window.innerWidth > 768) {
                        fireworks(2, 300);
                    }
                    */
                    document.querySelector('.g').disabled = false;
                    var elemento = document.querySelector('.zoomResultado');
                    var elemento1 = document.querySelector('.zoomResultado1');
                    // elemento.style.transform = 'scale(1.003)';
                    elemento.style.backgroundColor = '#79ffe9';
                    elemento.style.color = 'white';
                    // elemento1.style.transform = 'scale(1.003)';
                    elemento1.style.backgroundColor = '#79ffe9';
                    elemento1.style.color = 'white';
                    setTimeout(function () {
                        // elemento.style.transform = 'scale(1)';
                        elemento.style.backgroundColor = '#3fb19e';
                        elemento.style.color = 'black';
                        // elemento1.style.transform = 'scale(1)';
                        elemento1.style.backgroundColor = '#3fb19e';
                        elemento1.style.color = 'black';
                        document.querySelector('.Btn').disabled = false;
                        document.querySelector('.boton2Copiar').disabled = false;
                    }, 1000);
                    clearInterval(intervalId2); // Detener el conteo de bolas
                } else if (!ayuda2) {
                    console.log(`Quedan ${bolasEnElMundo.length} bolas en el mundo.`);
                } else {
                    console.log('xd');
                    if (!ayuda3) {
                        clearInterval(intervalId2);
                        ayuda3 = true;
                    }
                }
            }, 20); // Guardar bolas eliminadas tambien

        }, bolaDuracion);
    }, 500);


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
        //resultados1Element.value = ""
        //resultados2Element.value = ""
        //resultados1Element.readOnly = false;
        //resultados2Element.readOnly = false;
        for (var i = 0; i < bolaResultados; i++) {
            resultados[i] = i + 1 + '. ' + resultadosFinales[i];
        }
        //agregarDatos(resultados, "resultados1");
        //agregarDatos(resultados, "resultados2");
        resultados1Element.addEventListener("keydown", function (event) {
            event.preventDefault();
        });

        resultados2Element.addEventListener("keydown", function (event) {
            event.preventDefault();
        });
        //console.log(resultadosFinales);
    } else {
        console.error('Los arrays ordenBolas y contenidoOpciones deben tener la misma longitud.');
    }
}

// Función para configurar el sensor
function configurarSensor(world) {
    ordenBolas = []; // limpiamos 
    ayuda = false; // se acmbia a false para que no reposicione las bolas fuera del limite
    const limiteX = 600, limiteY = 600;

    const sensor = Bodies.rectangle(limiteX / 2, limiteY, 80, 1, {
        isSensor: true,
        isStatic: true,
        render: { fillStyle: 'red' }
    });

    World.add(world, sensor);
    k = 0; // ayuda a colocar indice antes de cada texto que se coloco en el contenido
    var jeje = true; // ayuda a desactivar el seguir subiendo contenido en el textare en tiempo real
    const jeje2 = world.bodies.filter(body => body.label === 'Circle Body').length;
    // jeje2 -> fijo para medir si las bolas pasaron el limite
    Events.on(engine, 'collisionStart', (event) => {
        const pairs = event.pairs;
        const bolasEnElMundoXD = world.bodies.filter(body => body.label === 'Circle Body').length;
        //console.log('sipapi', bolasEnElMundoXD);
        if (bolasEnElMundoXD == jeje2 - bolaResultados) {
            jeje = false;
        }
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if ((pair.bodyB === sensor && pair.bodyA.label === 'Circle Body') || (pair.bodyA === sensor && pair.bodyB.label === 'Circle Body')) {
                const textoBola = pair.bodyA.render.text.content;
                if (jeje) {
                    for (const opcion of contenidoOpciones) {
                        if (textoBola === opcion.id) {
                            //console.log(`Bola con ID ${textoBola} coincide con la opción ${opcion.texto}`);
                            //console.log('bbbbbbbbbbbbbbb');
                            const resultados1Element = document.getElementById("resultados1");
                            const resultados2Element = document.getElementById("resultados2");
                            resultados1Element.readOnly = false;
                            resultados2Element.readOnly = false;
                            //console.log(k+1, bolaResultados);
                            resultados1Element.value += `${k + 1}. ${opcion.texto}`;
                            resultados2Element.value += `${k + 1}. ${opcion.texto}`;
                            if (k < bolaResultados - 1) {
                                resultados1Element.value += `\r\n`;
                                resultados2Element.value += `\r\n`;
                            }
                            k = k + 1;
                            var audio2 = new Audio("./assets/audio/finPop.mp3");
                            audio2.play();
                            audio2.volume = 0.2;
                            setTimeout(function () {
                                audio2.pause();
                            }, 500);
                            function preventDefaultActions(event) {
                                event.preventDefault();
                            }
                            resultados1Element.addEventListener("keydown", preventDefaultActions);
                            resultados1Element.addEventListener("dragover", preventDefaultActions);
                            resultados2Element.addEventListener("keydown", preventDefaultActions);
                            resultados2Element.addEventListener("dragover", preventDefaultActions);
                        }
                    }
                }
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