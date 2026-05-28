# El Niño

Plataforma gamer personalizada para una experiencia de cumpleaños digital, interactiva y escalable.

## Estructura inicial

- `index.html`: entrada principal de la plataforma.
- `src/styles/main.css`: estilos visuales de la interfaz.
- `src/js/app.js`: arranque de la aplicación.
- `src/js/config/app-config.js`: configuración global del proyecto.
- `src/js/data/missions.js`: datos iniciales de misiones.
- `src/js/services/youtube-service.js`: servicio preparado para conectar con YouTube API.
- `src/js/ui/missions-view.js`: renderizado de secciones de interfaz.
- `.env.example`: plantilla de variables de entorno.
- `.env.local`: variables locales privadas, no debe subirse al repositorio.

## Variables de entorno

La clave de YouTube debe guardarse en `.env.local`:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_PLAYLIST_ID=your_playlist_id_here
```

El archivo `.env.local` está ignorado en `.gitignore`.

## Próximos pasos recomendados

1. Personalizar nombre, edad, colores y juegos favoritos del cumpleañero.
2. Añadir imágenes reales en una carpeta `assets/images`.
3. Solicitar una API key de YouTube desde Google Cloud Console.
4. Guardar claves privadas fuera del frontend cuando exista backend.
5. Evolucionar el proyecto hacia React, Vue, Astro o un backend con Node.js si se requieren usuarios, base de datos o panel administrativo.

## Mejoras inmediatas

| # | Mejora | Descripción |
|---|--------|-------------|
| 1 | Filtros por duración | Permitir filtrar videos por duración: cortos, medios y largos. |
| 2 | Ordenamiento dinámico | Añadir opciones para ordenar por más reciente, más visto, más largo o más antiguo. |
| 3 | Etiquetas por categoría | Añadir etiquetas como `#gameplay`, `#guía`, `#terror`, `#indie`, `#minecraft`, `#gta` y `#fnaf`. |
| 4 | Botón "Ver otro similar" | Añadir un botón que reemplace el video actual por otro similar del mismo canal o categoría. |
| 5 | Indicador de popularidad | Mostrar junto a cada video las visualizaciones, likes y ratio de interacción cuando esos datos estén disponibles. |
| 6 | Miniatura precargada | Mostrar la miniatura del video junto al título usando los datos de YouTube. |
| 7 | Fecha de publicación | Mostrar cuándo se subió cada video con formato relativo, por ejemplo: hace días, meses o años. |
| 8 | Idioma del contenido | Indicar si el video está en español, inglés o subtitulado. |

## Mejoras intermedias

| # | Mejora | Descripción |
|---|--------|-------------|
| 9 | Buscador interno | Buscar videos dentro de las listas por palabra clave, por ejemplo: Minecraft, FNAF o guía. |
| 10 | Listas personalizadas | Permitir que el usuario cree su propia lista arrastrando videos favoritos. |
| 11 | Marcar como "Visto" | Añadir un checkbox para que el usuario lleve un registro de los videos que ya vio. |
| 12 | Sistema de puntuación | Permitir valorar cada video del 1 al 5 y mostrar el promedio. |
| 13 | Comentarios por video | Añadir un pequeño espacio para que los usuarios dejen notas o comentarios sobre cada video. |
| 14 | Compartir lista | Generar un enlace único para compartir una lista completa con amigos. |
| 15 | Modo noche | Alternar entre tema claro y oscuro para mejorar la experiencia visual. |
| 16 | Videos relacionados automáticos | Al hacer clic en un video, sugerir 3 más de la misma categoría. |
| 17 | Exportar a CSV/TXT | Añadir un botón para descargar los enlaces de una lista en formato de texto o CSV. |
| 18 | Estadísticas de la lista | Mostrar total de videos, duración total estimada, promedio de visualizaciones y otros datos. |
| 19 | Actualización periódica | Crear un script que revise si hay videos nuevos de esos canales y los añada automáticamente. |
| 20 | Soporte para playlists de YouTube | Agrupar videos por playlist externa y mostrarlos integrados. |

## Mejoras avanzadas

| # | Mejora | Descripción |
|---|--------|-------------|
| 21 | Recomendación por IA | Usar un algoritmo simple que recomiende videos basado en lo que el usuario ha visto. |
| 22 | Integración con YouTube API | Traer automáticamente título, miniatura, visualizaciones, duración y likes en tiempo real. |
| 23 | Cuenta de usuario | Añadir registro/login para guardar listas personalizadas y progreso entre dispositivos. |
| 24 | Modo aleatorio | Añadir un botón "Sorpresa" que reproduzca un video aleatorio de cualquier lista. |
| 25 | Notificaciones | Alertar al usuario cuando un canal de sus listas suba un nuevo video relevante. |
| 26 | Ranking semanal | Mostrar los videos más vistos de la semana dentro de cada categoría. |
| 27 | Colaboraciones | Permitir que otros usuarios sugieran nuevos videos para añadir a las listas con moderación. |
| 28 | Versión en otros idiomas | Traducir la interfaz a inglés, portugués, francés y otros idiomas. |
| 29 | Modo "Maratón" | Reproducción automática continua de todos los videos de una lista en orden. |
| 30 | Panel de administración | Crear un dashboard para gestionar listas, añadir o quitar videos y editar títulos. |

## Tareas pendientes

- Completar `src/js/config/app-config.js` con un `defaultPlaylistId` válido para YouTube.
- Validar que la clave de API de YouTube esté activa y configurada en `.env.local`.
- Servir el sitio por HTTP/HTTPS en lugar de `file://` para permitir llamadas reales a la API.
- Confirmar que las páginas `Proyecto/index.html` y `Proyecto/demo.html` muestren el video temático correctamente.
- Revisar si hay más embeds de video o menú móvil en otros archivos que necesiten el mismo arreglo.
