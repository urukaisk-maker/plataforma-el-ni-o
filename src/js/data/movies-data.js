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
  createMovie("LJydiEcLl6g", "Película de orcos 1"),
  createMovie("U0Mw-JSRt58", "Película de orcos 2"),
  createMovie("Hde1Nt7wLMc", "Película de orcos 3"),
  createMovie("n1JkFZIEY_k", "Película de orcos 4"),
  createMovie("e6UGFKwYJOg", "Película de orcos 5"),
  createMovie("a2tQ3GAdLiA", "Película de orcos 6"),
  createMovie("9w4XlK5QzQU", "Película de orcos 7"),
  createMovie("FJyVxtK1AX8", "Película de orcos 8"),
  createMovie("UntxHy6KCtk", "Película de orcos 9"),
  createMovie("tSszhBL1DE8", "Película de orcos 10"),
  createMovie("SiwiBUI-FFc", "Película de orcos 11"),
  createMovie("rrxToVn1wLc", "Película de orcos 12"),
  createMovie("V0nxRnf2Izs", "Película de orcos 13"),
  createMovie("vyU0Tj3TpQk", "Película de orcos 14"),
  createMovie("VBlAzTSR5Qs", "Película de orcos 15"),
  createMovie("-PAZk_l09uM", "Película de orcos 16"),
  createMovie("9eGzFLWuSmY", "Película de orcos 17"),
  createMovie("XDI_Cf_MKPw", "Película de orcos 18"),
  createMovie("9s8mHqnmlg8", "Película de orcos 19"),
  createMovie("ggrOumy-iek", "Película de orcos 20"),
  createMovie("wB2Iubu8IVc", "Película de orcos 21"),
  createMovie("eKJnD83yC_k", "Película de orcos 22"),
  createMovie("ADQQ4zx3Qbg", "Película de orcos 23"),
  createMovie("Ff_Xk6G-OWM", "Película de orcos 24")
];
