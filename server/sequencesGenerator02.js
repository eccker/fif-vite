// Importa la librería necesaria para generar números aleatorios únicos
const crypto = require('crypto');
const seedrandom = require('seedrandom');

// Variable global para mantener la función generadora aleatoria
let rng = seedrandom();

// Función para establecer la semilla para la generación aleatoria
function establecerSemilla(semilla) {
  rng = seedrandom(semilla);
}

// Función para generar un número aleatorio en un rango utilizando la semilla
function randomInRange(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// Función para verificar si hay una coincidencia entre dos mitades de una combinación
function hayCoincidencia(primeraMitad, segundaMitad) {
  return primeraMitad.some((num) => segundaMitad.includes(num));
}

// Función para generar una combinación válida de 12 números
function generarCombinacion(limite) {
  let numeros = new Set();
  while (numeros.size < 6) {
    const randomValueToAdd = randomInRange(1, limite);
    numeros.add(randomValueToAdd);
  }
  const primeraMitad = Array.from(numeros);
  numeros = new Set();
  // Genera los siguientes 6 números únicos (que no estén repetidos entre los últimos 6)
  while (numeros.size < 6) {
    const randomValue = randomInRange(1, limite);
    numeros.add(randomValue);
  }

  const segundaMitad = Array.from(numeros);

  return [...primeraMitad, ...segundaMitad];
}

const getRandomNumber = (min, max) => {
  const range = max - min;
  return min + rng() * range;
};



// Función principal para generar la matriz
function generarMatriz(levels) {
  const matriz = [];
  const tiempos = [];
  const MIN_TIME = 3; // Tiempo mínimo en segundos
  const MIN_RAN_TIME = 4; // Tiempo random mínimo en segundos
  const INITIAL_MIN_TIME = 12;
  const INITIAL_RAN_TIME = 36;
  let minTime = INITIAL_MIN_TIME; // Valor inicial de minTime en segundos
  let ranTime = INITIAL_RAN_TIME; // Valor inicial de ranTime en segundos

  const MAX_LEVELS = levels;
  for (let intento = 1; intento <= MAX_LEVELS; intento++) {
    const limite = intento + 10;
    let coincidenciasRequeridas = Math.round(((128 - (intento / 2 - 1)) / 2) + 1);
    let coincidenciasActuales = 0;
    const combinacionesConCoincidencia = [];
    const combinacionesSinCoincidencia = [];

    const MAX_SHUFFLES_PER_TRY = 256;
    while (combinacionesConCoincidencia.length + combinacionesSinCoincidencia.length < MAX_SHUFFLES_PER_TRY) {
      let combinacion = generarCombinacion(limite);
      let primeraMitad = combinacion.slice(0, 6);
      let segundaMitad = combinacion.slice(6);

      if (coincidenciasActuales < coincidenciasRequeridas) {
        if (hayCoincidencia(primeraMitad, segundaMitad)) {
          combinacionesConCoincidencia.push(combinacion);
          coincidenciasActuales++;
        }
      } else {
        if (limite > 12) {
          while (hayCoincidencia(primeraMitad, segundaMitad)) {
            combinacion = generarCombinacion(limite);
            primeraMitad = combinacion.slice(0, 6);
            segundaMitad = combinacion.slice(6);
          }
        }
        combinacionesSinCoincidencia.push(combinacion);
      }
    }

    // Mezclar combinaciones para distribuir aleatoriamente las que tienen coincidencia
    const todasLasCombinaciones = [...combinacionesConCoincidencia, ...combinacionesSinCoincidencia];
    for (let i = todasLasCombinaciones.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [todasLasCombinaciones[i], todasLasCombinaciones[j]] = [todasLasCombinaciones[j], todasLasCombinaciones[i]];
    }

    matriz.push(todasLasCombinaciones);

    // Calcular el tiempo para el intento actual
    const currentExpireTime = 1000 * getRandomNumber(minTime, minTime + ranTime);
    tiempos.push(currentExpireTime);

    // Decrementar minTime y ranTime hasta llegar a sus valores mínimos
    minTime = Math.max(MIN_TIME, minTime - (INITIAL_MIN_TIME / 256));
    ranTime = Math.max(MIN_RAN_TIME, ranTime - (INITIAL_RAN_TIME / 256));
  }

  return { matriz, tiempos };
}

// Función para verificar cuántas coincidencias hay por intento y obtener sus posiciones
function verificarCoincidencias(matriz) {
  const resultados = [];

  matriz.forEach((combinaciones, intento) => {
    let totalCoincidencias = 0;
    const posicionesCoincidencias = [];

    combinaciones.forEach((combinacion, index) => {
      const primeraMitad = combinacion.slice(0, 6);
      const segundaMitad = combinacion.slice(6);
      if (hayCoincidencia(primeraMitad, segundaMitad)) {
        totalCoincidencias++;
        posicionesCoincidencias.push(index);
      }
    });

    resultados.push({ intento: intento + 1, coincidencias: totalCoincidencias, posiciones: posicionesCoincidencias });
  });

  return resultados;
}

// Establecer la semilla y ejecutar la función para generar la matriz
establecerSemilla('mi_semilla_unica1');
const MAX_LEVELS = 60;

const { matriz: matrizGenerada, tiempos } = generarMatriz(MAX_LEVELS);

let gameSpace = []
matrizGenerada.slice(0, MAX_LEVELS + 1).forEach((fila, index) => {
  let samples = []
  for (let index = 0; index < fila.length; index++) {
    const decks = {
      "topDeck": fila[index].slice(0, 6),
      "bottomDeck": fila[index].slice(6, 12)
    }
    samples.push(decks)
  }

  const level = {
    "timeLimit": tiempos[index],
     "samples": samples 
  }
  
  gameSpace.push(level)

});

const fs = require('fs');
fs.writeFile('deckSamples.json',JSON.stringify(gameSpace), 'utf8', ( )=>{ });

const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const getRandomInt = (max) => {
    return crypto.randomInt(max);
};

const processFiles = async () => {
    try {
        const images = [];
        const files = await readdir('./data'); // Leer la lista de archivos en el directorio
        for (let index = 0; index < 256; index++) {
            const filetoopen = files[getRandomInt(files.length)];
            const data = await readFile(`./data/${filetoopen}`, 'utf8'); // Leer el contenido del archivo
            const objectFromFile = JSON.parse(data); // Parsear el JSON
            const objFromFile = objectFromFile[getRandomInt(objectFromFile.length)];
            images.push(objFromFile.urls.thumb); // Agregar la URL al array de imágenes
        }
        const obj = { "images": images }; // Crear el objeto final
        await writeFile('imageUrls.json', JSON.stringify(obj), 'utf8'); // Escribir el archivo JSON
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

processFiles();