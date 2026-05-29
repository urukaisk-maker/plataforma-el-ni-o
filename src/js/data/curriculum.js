/**
 * Contenido curricular adaptado por pais.
 * Mapea temas educativos a los programas de cada Secretaria de Educacion.
 */

const CURRICULUM_BY_COUNTRY = {
  mx: {
    name: 'Mexico',
    authority: 'SEP',
    grades: ['Preescolar', 'Primaria 1-6', 'Secundaria 1-3'],
    subjects: {
      matematicas: ['Numeros', 'Formas', 'Medida', 'Proporcionalidad', 'Probabilidad y estadistica'],
      historia: ['Mexico prehispanico', 'Conquista', 'Independencia', 'Reforma y Revolucion', 'Mexico contemporaneo'],
      ciencias: ['Seres vivos', 'Materia y energia', 'Tierra y universo', 'Tecnologia'],
      espanol: ['Lectura', 'Escritura', 'Comunicacion oral', 'Pensamiento literario'],
    },
    keywords: ['maestra', 'maestro', 'examen', 'calificacion', 'boleta', 'tarea', 'cuaderno'],
    culturalRefs: ['Chapultepec', 'Alebrijes', 'Dia de Muertos', 'Lucha libre', 'Mariachi'],
  },
  co: {
    name: 'Colombia',
    authority: 'MEN',
    grades: ['Preescolar', 'Basica primaria 1-5', 'Basica secundaria 6-9', 'Media 10-11'],
    subjects: {
      matematicas: ['Pensamiento numerico', 'Pensamiento espacial', 'Pensamiento metrico', 'Pensamiento aleatorio'],
      sociales: ['Territorio colombiano', 'Democracia', 'Economia', 'Relaciones internacionales'],
      ciencias: ['Seres vivos', 'Materia y energia', 'Tierra y universo'],
      espanol: ['Comprension lectora', 'Produccion textual', 'Comunicacion oral'],
    },
    keywords: ['docente', 'evaluacion', 'logro', 'periodo', 'nota', 'area'],
    culturalRefs: ['Carnaval de Barranquilla', 'Arepa', 'Cafe', 'Vallenato', 'Orquidea'],
  },
  ar: {
    name: 'Argentina',
    authority: 'Ministerio de Educacion',
    grades: ['Inicial', 'Primaria 1-6', 'Secundaria 1-6'],
    subjects: {
      matematicas: ['Numeros', 'Geometria', 'Medida', 'Estadistica y probabilidad'],
      sociales: ['Sociedades americanas', 'Colonizacion', 'Nacion argentina', 'Mundo contemporaneo'],
      ciencias: ['Seres vivos', 'Materia y energia', 'Tierra y espacio', 'Tecnologia'],
      lengua: ['Lectura', 'Escritura', 'Oralidad', 'Literatura'],
    },
    keywords: ['docente', 'evaluacion', 'promocion', 'trimestre', 'materia', 'cuaderno'],
    culturalRefs: ['Mate', 'Dulce de leche', 'Tango', 'Asado', 'Patagonia'],
  },
  es: {
    name: 'Espana',
    authority: 'LOMLOE',
    grades: ['Infantil', 'Primaria 1-6', 'ESO 1-4', 'Bachillerato'],
    subjects: {
      matematicas: ['Numeros', 'Algebra', 'Geometria', 'Estadistica y probabilidad'],
      historia: ['Prehistoria', 'Antigua', 'Medieval', 'Moderna', 'Contemporanea'],
      ciencias: ['Biologia', 'Geologia', 'Fisica y quimica', 'Tecnologia'],
      lengua: ['Lengua castellana', 'Literatura', 'Lenguas extranjeras'],
    },
    keywords: ['profesor', 'profesora', 'evaluacion', 'trimestre', 'nota', 'asignatura'],
    culturalRefs: ['Sagrada Familia', 'Paella', 'Flamenco', 'Falla', 'Tortilla de patatas'],
  },
  br: {
    name: 'Brasil',
    authority: 'MEC / BNCC',
    grades: ['Educacao infantil', 'Ensino fundamental 1-9', 'Ensino medio'],
    subjects: {
      matematica: ['Numeros', 'Algebra', 'Geometria', 'Estatistica e probabilidade'],
      historia: ['Historia do Brasil', 'Historia geral'],
      ciencias: ['Ciencias da natureza', 'Fisica', 'Quimica', 'Biologia'],
      portugues: ['Leitura', 'Escrita', 'Comunicacao oral', 'Literatura'],
    },
    keywords: ['professor', 'professora', 'avaliacao', 'bimestre', 'nota', 'materia'],
    culturalRefs: ['Carnaval', 'Feijoada', 'Futebol', 'Capoeira', 'Amazonia'],
  },
  us: {
    name: 'United States',
    authority: 'Common Core State Standards',
    grades: ['Pre-K', 'Kindergarten', 'Grade 1-5', 'Middle School 6-8', 'High School 9-12'],
    subjects: {
      math: ['Counting', 'Operations', 'Algebra', 'Geometry', 'Statistics'],
      ela: ['Reading', 'Writing', 'Speaking', 'Listening', 'Language'],
      science: ['Life science', 'Physical science', 'Earth science', 'Engineering'],
      social: ['History', 'Geography', 'Civics', 'Economics'],
    },
    keywords: ['teacher', 'grade', 'test', 'quiz', 'homework', 'report card'],
    culturalRefs: ['Baseball', 'Hamburger', 'Hollywood', 'Thanksgiving', 'Super Bowl'],
  },
};

export function getCurriculum(countryCode) {
  return CURRICULUM_BY_COUNTRY[countryCode] || CURRICULUM_BY_COUNTRY['es'];
}

export function getAvailableCountries() {
  return Object.entries(CURRICULUM_BY_COUNTRY).map(([code, data]) => ({
    code,
    name: data.name,
    authority: data.authority,
  }));
}

export function getSubjectsForCountry(countryCode) {
  const curriculum = getCurriculum(countryCode);
  return Object.entries(curriculum.subjects).map(([key, topics]) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    topics,
  }));
}

export function getCulturalRefs(countryCode) {
  return getCurriculum(countryCode).culturalRefs || [];
}
