function createVideo(id, title, channel = "YouTube") {
  return {
    id,
    title,
    channel,
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  };
}

export const youtubePlaylists = [
  {
    title: "Lista 1: Los Reyes del Entretenimiento",
    description: "Humor, variedad, carisma, edición dinámica y partidas llenas de risas para pasar un buen rato.",
    videos: [
      createVideo("2ZPgJRNm6x0", "Video destacado de entretenimiento 1"),
      createVideo("vPAKpEFQ2p0", "Video destacado de entretenimiento 2"),
      createVideo("b_9zcgfbs08", "Video destacado de entretenimiento 3"),
      createVideo("A-dvR9jn9Hw", "Video destacado de entretenimiento 4"),
      createVideo("rBoa9eQec0M", "Video destacado de entretenimiento 5"),
      createVideo("P3rAIy28kYw", "Video destacado de entretenimiento 6"),
      createVideo("xv56qM4P19A", "Video destacado de entretenimiento 7"),
      createVideo("l2-mkyGPHzo", "Video destacado de entretenimiento 8"),
      createVideo("-6LZMizP2YU", "Video destacado de entretenimiento 9"),
      createVideo("dwA716rQafk", "Video destacado de entretenimiento 10"),
      createVideo("6jHJZ3AmKVA", "Video destacado de entretenimiento 11"),
      createVideo("HdccnA0Njn8", "Video destacado de entretenimiento 12")
    ]
  },
  {
    title: "Lista 2: Análisis, Lore y Curiosidades",
    description: "Teorías, secretos, historia de los juegos y contenido para entender mejor cada aventura.",
    videos: [
      createVideo("Cg5tOkW6Vus", "Video destacado de análisis 2"),
      createVideo("YdOXS_9_P4U", "Video destacado de análisis 4"),
      createVideo("2yn06fCvGmc", "Video destacado de análisis 5"),
      createVideo("wGSrT8owIAI", "Video destacado de análisis 6"),
      createVideo("dNajqAokx3I", "Video destacado de análisis 7"),
      createVideo("1-mKvbuJPgY", "Video destacado de análisis 8"),
      createVideo("RQWpF2Gb-gU", "Video destacado de análisis 9"),
      createVideo("4acH43NjSqY", "Video destacado de análisis 11"),
      createVideo("I0KYawk98KA", "Video destacado de análisis 12"),
      createVideo("lRSUYUZIC2E", "Video destacado de análisis nuevo 1"),
      createVideo("8SL_2uKEfHU", "Video destacado de análisis nuevo 2"),
      createVideo("QdQeaqk_enk", "Video destacado de análisis nuevo 3")
    ]
  },
  {
    title: "Lista 3: Guías y Mejora Competitiva",
    description: "Tutoriales, estrategias y consejos para mejorar el rendimiento en juegos competitivos.",
    videos: [
      createVideo("7gCoxLTNzm4", "Video destacado de guías 1"),
      createVideo("9gGY4DOn-Ig", "Video destacado de guías 2"),
      createVideo("Vt59hHC9ibk", "Video destacado de guías 3"),
      createVideo("fJG4ReZ7Hjs", "Video destacado de guías 4"),
      createVideo("_imSx91vQOM", "Video destacado de guías 5"),
      createVideo("AD5GY6_1e1M", "Video destacado de guías 6"),
      createVideo("x9VLOMMNIas", "Video destacado de guías 7"),
      createVideo("R1t06fQTido", "Video destacado de guías 8")
    ]
  },
  {
    title: "Lista 4: La Élite Hispana",
    description: "Grandes referentes de España y Latinoamérica que dominan el gaming en español.",
    videos: [
      createVideo("wbuGj3dDrKg", "Video destacado de la élite hispana 2"),
      createVideo("iEhofueeSKs", "Video destacado de la élite hispana 3"),
      createVideo("z4e6RdiTtYQ", "Video destacado de la élite hispana 4"),
      createVideo("e8afUMpAZLM", "Video destacado de la élite hispana 5"),
      createVideo("-yPKDsoDmUo", "Video destacado de la élite hispana 6"),
      createVideo("1zlkT53b5wg", "Video destacado de la élite hispana 7")
    ]
  },
  {
    title: "Lista 5: Indies, Terror y Experiencias Únicas",
    description: "Joyas ocultas, juegos narrativos, terror, curiosidades y experiencias diferentes.",
    videos: [
      createVideo("MJSFIzPdpAE", "Video destacado de terror e indies 1"),
      createVideo("pOOFGDT4kUY", "Video destacado de terror e indies 2"),
      createVideo("ekdiEDVl5Co", "Video destacado de terror e indies 3"),
      createVideo("nmxbGZCLYr4", "Video destacado de terror e indies 4"),
      createVideo("2IoDnuQOMJ4", "Video destacado de terror e indies 5"),
      createVideo("KR5aJfv7C7w", "Video destacado de terror e indies 6"),
      createVideo("2WgcP_jjCO4", "Video destacado de terror e indies 7"),
      createVideo("R2XAcKxvAEg", "Video destacado de terror e indies 8"),
      createVideo("1IL4LgKSUzk", "Video destacado de terror e indies 9"),
      createVideo("f7aV46LLgEA", "Video destacado de terror e indies 10")
    ]
  },
  {
    title: "Lista 6: Los Más Vistos del Mundo",
    description: "Contenido viral, Shorts, Minecraft, GTA y fenómenos globales del mundo gamer.",
    videos: [
      createVideo("R83V5sAhDWY", "Video destacado global 1"),
      createVideo("uTX--zje45Q", "Video destacado global 2"),
      createVideo("IeG7yquP2zY", "Video destacado global 3"),
      createVideo("Unej5rXw5mQ", "Video destacado global 4"),
      createVideo("jk4XzpRfnwc", "Video destacado global 5"),
      createVideo("X7dOVuoYHCQ", "Video destacado global 6"),
      createVideo("9dYFeNFSLy0", "Video destacado global 7"),
      createVideo("ukmXfZvAO6o", "Video destacado global 8"),
      createVideo("d1h93jQuBBQ", "Video destacado global 9"),
      createVideo("zpq_K6cdmQc", "Video destacado global 10")
    ]
  }
];
