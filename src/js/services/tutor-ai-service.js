/**
 * Tutor IA conversacional — Stub local con lógica inteligente.
 * Diseñado para integrar Whisper (STT) + OpenAI (chat) + Web Speech API (TTS).
 * Sin API key funciona en modo demo con respuestas predefinidas.
 */

import { speak } from '../utils/speech.js';
import { logActivity } from './activity-service.js';
import { getCurrentLocale } from '../utils/i18n.js';
import { detectCategory } from './tutor-keywords.js';

const TUTOR_KEY = 'elnino_tutor_history';
const TUTOR_ENABLED_KEY = 'elnino_tutor_enabled';

const PERSONALITIES = {
  drako: { name: 'Drako', emoji: '🐉', tone: 'valiente y energético' },
  robi: { name: 'Robi', emoji: '🤖', tone: 'lógico y curioso' },
  michi: { name: 'Michi', emoji: '🐱', tone: 'amable y paciente' },
  zork: { name: 'Zork', emoji: '👽', tone: 'misterioso y divertido' },
};

/**
 * Respuestas demo por categoría (modo stub sin API).
 * En producción esto se reemplaza por llamada a OpenAI/Claude.
 */
const DEMO_RESPONSES = {
  matematicas: [
    'Las matematicas son como un juego de puzles. El numero 0 fue inventado en la India hace mas de 1500 anos.',
    'Para sumar con llevada, imagina que juntas monedas en una alcancia. Cada 10 monedas hacen una moneda grande.',
    'Las restas son como devolver caramelos prestados. Si tienes 5 y devuelves 2, te quedan 3.',
    'Un triangulo siempre tiene 180 grados. Si uno mide 90, los otros dos deben sumar 90 tambien.',
    'La multiplicacion es suma rapida: 4 x 3 es sumar 4 tres veces. 4 + 4 + 4 = 12.',
    'Las fracciones son como repartir una pizza. 1/2 significa partir en 2 y quedarte con 1 pedazo.',
    'Los numeros primos son como los atomos de las matematicas. Todo numero se puede descomponer en primos.',
    'El perimetro de un circulo se llama circunferencia: pi x diametro, y pi vale aproximadamente 3.14159.',
    'Para resolver ecuaciones, piensa en una balanza. Lo que haces a un lado, debes hacerlo al otro.',
    'Los porcentajes son fracciones con denominador 100. 25% es 25 de cada 100, o sea 1/4.',
    'Un numero negativo es como deber dinero. Si tienes -3 euros, debes 3 euros.',
    'La potencia de 2 crece rapido: 2, 4, 8, 16, 32, 64, 128... En 10 pasos llegas a 1024.',
  ],
  historia: [
    'Cleopatra vivio mas cerca de la llegada a la Luna que de la construccion de las piramides.',
    'Los romanos inventaron los caminos pavimentados. Algunos todavia existen hoy, 2000 anos despues.',
    'Cristobal Colon llego a America en 1492, pero los vikingos ya habian estado en Canada 500 anos antes.',
    'La Gran Muralla China no es visible desde la Luna, pero si desde el espacio con una camara potente.',
    'Leonardo da Vinci escribia al reves, de derecha a izquierda. Era zurdo y usaba escritura espejo.',
    'Las piramides de Egipto fueron construidas por trabajadores pagados, no por esclavos como se creia antes.',
    'En la antigua Grecia, los Juegos Olimpicos duraban 5 dias y los atletas competian desnudos.',
    'Isabel I de Inglaterra nunca se caso y por eso la llamaron "la Reina Virgen". Goberno 44 anos.',
    'La Revolucion Francesa empezo en 1789 con la toma de la Bastilla. Cambio para siempre Europa.',
    'El telegrafo electrico revoluciono la comunicacion en el siglo XIX. Un mensaje tardaba minutos, no semanas.',
    'En la Edad Media, muchas personas nunca viajaron mas alla de 30 km de su lugar de nacimiento.',
    'La Primera Guerra Mundial duro de 1914 a 1918. Introdujo aviones, tanques y gas mostaza.',
  ],
  ciencia: [
    'Un rayo es 5 veces mas caliente que la superficie del Sol.',
    'Las abejas pueden ver colores que nosotros no podemos, como el ultravioleta. Las flores les brillan como neones.',
    'El agua es la unica sustancia natural que existe en tres estados en la Tierra: solido, liquido y gas.',
    'Tu cuerpo tiene aproximadamente 37 billones de celulas.',
    'La luz tarda 8 minutos y 20 segundos en viajar del Sol a la Tierra.',
    'Los pulpos tienen tres corazones y sangre azul. Son criaturas increiblemente inteligentes.',
    'El sonido no puede viajar en el espacio vacio porque no hay aire para transportar las ondas.',
    'Las plantas son verdes porque el clorofilo absorbe rojo y azul, y refleja el verde.',
    'Una gota de lluvia cae a unos 25 km/h. No es muy rapida, pero cae constantemente.',
    'El ADN de los humanos y los platanos es un 60% identico. Compartimos muchos genes con las plantas.',
    'Los arcoiris son circulos completos, pero normalmente solo vemos la mitad desde el suelo.',
    'Los diamantes son carbono puro, igual que el grafito de los lapices. La diferencia esta en los atomos.',
    'La Tierra no es una esfera perfecta: es mas ancha en el ecuador que de polo a polo por la rotacion.',
    'Los tiburones existen desde antes que los arboles. Han nadado en los oceanos durante mas de 400 millones de anos.',
    'Si pudieras viajar al Sol en coche a 100 km/h, tardarias 170 anos en llegar.',
  ],
  motivacion: [
    'Estas haciendo un trabajo increible. Cada error es una pista secreta para resolver el siguiente nivel.',
    'Recuerda: todos los grandes heroes empezaron como principiantes. Tu estas en el camino correcto.',
    'No te rindas. Los cerebros mas brillantes del mundo cometieron miles de errores antes de acertar.',
    'El progreso no siempre es una linea recta. A veces retrocedes para impulsarte mas fuerte despues.',
    'Tu cerebro es como un musculo: cuanto mas lo entrenas, mas fuerte se vuelve.',
    'Cada vez que practicas algo dificil, estas construyendo un puente neural en tu cerebro. Es como subir de nivel.',
    'No compares tu capitulo 1 con el capitulo 20 de otra persona. Cada uno va a su propio ritmo.',
    'La palabra "imposible" contiene "posible". A veces solo necesitas ver las cosas desde otro angulo.',
    'Thomas Edison fallo 1.000 veces antes de inventar la bombilla. Cada fallo era un paso mas cerca.',
    'Hoy puedes no entender algo, pero dentro de una semana te preguntaras por que te costo tanto.',
    'La confianza no viene de acertar siempre. Viene de saber que puedes levantarte cuando caes.',
    'Descansar tambien es entrenar. Tu cerebro necesita tiempo para procesar lo que aprende.',
  ],
  geografia: [
    'Rusia es tan grande que tiene 11 zonas horarias diferentes.',
    'El desierto del Sahara es mas grande que Estados Unidos. En el pasado fue un oceano lleno de vida.',
    'El rio Amazonas tiene tanto agua que representa el 20% de todo el agua dulce que llega al mar.',
    'Australia es el unico continente que es tambien un pais, y no tiene volcanes activos.',
    'El Monte Everest crece unos 4 milimetros cada ano porque las placas tectonicas siguen empujandolo.',
    'El punto mas profundo del oceano es la Fosa de las Marianas: 11 km bajo el agua.',
    'Islandia no tiene mosquitos. Ninguno. El clima frio no les permite vivir.',
    'La Antartida es el desierto mas grande del mundo porque casi no llueve.',
    'Canada tiene mas lagos que el resto del mundo juntos.',
    'Tokio es la ciudad mas poblada del mundo con mas de 37 millones de habitantes.',
  ],
  ingles: [
    '"Because" se escribe B-E-C-A-U-S-E: Big Elephants Can Always Understand Small Elephants.',
    'Los verbos irregulares no siguen reglas. "Go" en pasado es "went", no "goed". Hay que memorizarlos.',
    'En ingles, el orden es Sujeto + Verbo + Objeto: "I eat apples", no "Apples eat I".',
    'El presente continuo se forma con "to be" + verbo + -ing. "I am playing" = estoy jugando ahora.',
    '"Much" va con incontables (water) y "many" con contables (apples).',
    'Los adjetivos van ANTES del sustantivo: "a big dog", no "a dog big".',
    '"There is" con singular y "there are" con plural.',
    'Los animales tienen sonidos diferentes: perros "woof", gatos "meow", gallinas "cluck".',
    'Las preguntas empiezan con What, Where, When, Why, Who y How.',
    'El "ph" suena como "f": phone = "fon", photograph = "fotograf".',
  ],
  tecnologia: [
    'La primera computadora, ENIAC, ocupaba una habitacion entera en 1945. Tu movil es miles de veces mas potente.',
    'Internet empezo como ARPANET en 1969, conectando solo 4 universidades en Estados Unidos.',
    'Cada letra en pantalla se representa como un numero. La "A" mayuscula es el numero 65 en binario.',
    'Los QR codes pueden almacenar hasta 7.089 numeros o 4.296 letras.',
    'Los emojis fueron inventados en Japon en 1999: "e" (imagen) + "moji" (caracter).',
    'Un bit es la unidad mas pequena: 0 o 1. Un byte son 8 bits.',
    'Los videojuegos antiguos tenian graficos de 8 bits: 256 colores en la paleta.',
    'La nube no esta en el cielo: son miles de computadoras en edificios llamados centros de datos.',
    'Los robots mas avanzados pueden reconocer rostros, caminar, hablar y crear arte. Pero aun no entienden el humor.',
    'Los navegadores usan HTML para estructura, CSS para diseno y JavaScript para interactividad.',
  ],
  arte: [
    'Vincent van Gogh solo vendio un cuadro en vida. Hoy sus obras valen millones.',
    'Leonardo da Vinci tardo 4 anos en pintar la Mona Lisa. Y nunca la entrego al cliente.',
    'El color azul era tan dificil de obtener en la antiguedad que a veces valia mas que el oro.',
    'Pablo Picasso pinto mas de 50.000 obras: mas de 2 obras por dia durante 70 anos.',
    'La musica clasica puede mejorar la concentracion. Se llama el "Efecto Mozart".',
    'En el arte abstracto no se busca parecerse a la realidad, sino expresar emociones con colores y formas.',
    'El ballet requiere tanta fuerza que un bailarin salta el equivalente a un edificio de 5 pisos en una funcion.',
    'Frida Kahlo pinto autorretratos porque pasaba mucho tiempo sola debido a sus dolores de espalda.',
    'Los grafitis mas antiguos datan del Imperio Romano. Hasta los romanos escribian en las paredes.',
    'El teatro griego nacio hace 2500 anos. Las mascaras ayudaban a proyectar la voz y mostrar el personaje.',
  ],
  deportes: [
    'En futbol, el balon debe pesar entre 410 y 450 gramos al inicio del partido.',
    'Los Juegos Olimpicos modernos empezaron en 1896 en Atenas, pero los originales datan del 776 a.C.',
    'Michael Phelps tiene 23 medallas de oro olimpicas. Mas que muchos paises enteros.',
    'En baloncesto, el aro esta a exactamente 3.05 metros. Eso no ha cambiado desde 1891.',
    'El tenis se origino en Francia en el siglo XII. Se jugaba con las manos y se llamaba "jeu de paume".',
    'Usain Bolt es el hombre mas rapido de la historia. Su record en 100 metros es de 9.58 segundos.',
    'El ajedrez es considerado un deporte por el COI. Los mejores piensan 10-15 jugadas adelante.',
    'En rugby, un try vale 5 puntos, pero la conversion posterior solo 2. La importancia esta en llegar a la zona.',
    'Las maratonas tienen exactamente 42.195 kilometros. La distancia conmemora un mensajero griego.',
    'El yoga fortalece musculos, mejora la flexibilidad y reduce el estres.',
  ],
  default: [
    'Hola! Soy tu tutor personal. En que tema te gustaria que te ayude hoy?',
    'Puedo explicarte matematicas, historia, ciencia, geografia, ingles, tecnologia, arte o deportes.',
    'Estoy aqui para ayudarte. Preguntame lo que quieras o dime si necesitas una pista.',
    'Bienvenido de nuevo! Cada pregunta es una oportunidad para aprender algo nuevo.',
    'Hola! Veo que tienes curiosidad. Eso es la mejor senal de un cerebro en crecimiento.',
    'Que gusto verte! El aprendizaje es un viaje, y yo soy tu companero en el camino.',
    'Hola aventurero del conocimiento! Que tema te interesa explorar hoy?',
    'Bienvenido! No hay preguntas tontas, solo respuestas que aun no hemos descubierto.',
    'Interesante pregunta. Intenta reformularla con palabras de matematicas, historia, ciencia o geografia.',
    'Buena pregunta! Aunque no tenga la respuesta exacta aqui, te animo a investigarlo. Aprender a buscar es una habilidad superpoderosa.',
  ],
};

function getHistory() {
  try {
    const raw = localStorage.getItem(TUTOR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(TUTOR_KEY, JSON.stringify(history.slice(-50)));
  } catch {
    // Silencioso
  }
}

/**
 * Genera una respuesta del tutor.
 * Stub local — en producción llamar a OpenAI API.
 */
export async function askTutor(question, personalityId = 'drako') {
  const personality = PERSONALITIES[personalityId] || PERSONALITIES.drako;
  const history = getHistory();

  // Guardar pregunta del usuario
  history.push({
    role: 'user',
    content: question,
    timestamp: Date.now(),
  });

  // Generar respuesta demo con anti-repeticion
  const category = detectCategory(question);
  const responses = DEMO_RESPONSES[category] || DEMO_RESPONSES.default;
  const lastKey = 'elnino_tutor_last_' + category;
  let lastIndex = -1;
  try { lastIndex = parseInt(localStorage.getItem(lastKey), 10); } catch { /* no-op */ }
  let idx;
  if (responses.length > 1) {
    do { idx = Math.floor(Math.random() * responses.length); }
    while (idx === lastIndex);
  } else {
    idx = 0;
  }
  try { localStorage.setItem(lastKey, String(idx)); } catch { /* no-op */ }
  const responseText = responses[idx];

  // Añadir toque de personalidad
  const prefixed = `${personality.emoji} ${personality.name}: ${responseText}`;

  history.push({
    role: 'assistant',
    content: prefixed,
    timestamp: Date.now(),
  });

  saveHistory(history);
  logActivity('tutor', `Pregunta a ${personality.name}`, question.slice(0, 40));

  return {
    text: prefixed,
    personality,
    category,
  };
}

/**
 * Lee la respuesta del tutor en voz alta.
 */
export function speakTutorResponse(text, options = {}) {
  const cleanText = text.replace(/^[^:]+:\s*/, '');
  const locale = getCurrentLocale();
  speak(cleanText, { rate: 0.85, lang: locale, ...options });
}

/**
 * Obtiene el historial de conversación.
 */
export function getTutorHistory() {
  return getHistory();
}

/**
 * Limpia el historial.
 */
export function clearTutorHistory() {
  localStorage.removeItem(TUTOR_KEY);
  // Limpiar indices de anti-repeticion
  Object.keys(DEMO_RESPONSES).forEach(cat => {
    try { localStorage.removeItem('elnino_tutor_last_' + cat); } catch { /* no-op */ }
  });
}

/**
 * Activa o desactiva el tutor.
 */
export function setTutorEnabled(enabled) {
  localStorage.setItem(TUTOR_ENABLED_KEY, enabled ? '1' : '0');
}

export function isTutorEnabled() {
  return localStorage.getItem(TUTOR_ENABLED_KEY) !== '0';
}

/**
 * Obtiene las personalidades disponibles.
 */
export function getPersonalities() {
  return PERSONALITIES;
}
