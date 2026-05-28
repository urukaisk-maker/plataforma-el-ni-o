function createMovie(id, title, description = "") {
  return {
    id,
    title,
    description,
    url: `https://www.youtube.com/watch?v=${id}`,
    embed: `https://www.youtube.com/embed/${id}`,
    thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  };
}

export const movies = [
  createMovie("LJydiEcLl6g", "La Guerra de los Orcos"),
  createMovie("U0Mw-JSRt58", "Horda Inmortal"),
  createMovie("Hde1Nt7wLMc", "El Último Guerrero Orco"),
  createMovie("n1JkFZIEY_k", "Reino de Sangre y Orcos"),
  createMovie("e6UGFKwYJOg", "La Furia de la Horda"),
  createMovie("a2tQ3GAdLiA", "Orco: El Origen"),
  createMovie("9w4XlK5QzQU", "El Clan Orco"),
  createMovie("FJyVxtK1AX8", "Guerreros de la Oscuridad"),
  createMovie("UntxHy6KCtk", "La Leyenda del Orco"),
  createMovie("tSszhBL1DE8", "Imperio Orco"),
  createMovie("SiwiBUI-FFc", "El Despertar de la Horda"),
  createMovie("rrxToVn1wLc", "Orcos: Batalla Final"),
  createMovie("V0nxRnf2Izs", "El Rey Orco"),
  createMovie("vyU0Tj3TpQk", "Sangre Orca"),
  createMovie("VBlAzTSR5Qs", "La Marcha de los Orcos"),
  createMovie("-PAZk_l09uM", "Guerrero sin Miedo"),
  createMovie("9eGzFLWuSmY", "El Destino del Orco"),
  createMovie("XDI_Cf_MKPw", "Tierras de Orcos"),
  createMovie("9s8mHqnmlg8", "La Ira de la Horda"),
  createMovie("ggrOumy-iek", "Orco Eterno"),
  createMovie("wB2Iubu8IVc", "El Guerrero Verde"),
  createMovie("eKJnD83yC_k", "Horda Salvaje"),
  createMovie("ADQQ4zx3Qbg", "El Legado Orco"),
  createMovie("Ff_Xk6G-OWM", "Victoria de la Horda")
];
