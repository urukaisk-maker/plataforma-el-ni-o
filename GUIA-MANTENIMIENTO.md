# Guía rápida de mantenimiento

Esta guía explica cómo mantener la plataforma gamer El Niño sin romper la estructura principal.

## Archivos principales

- `index.html`: página de inicio.
- `youtube.html`: zona multimedia y reproductor de playlists.
- `recuerdos.html`: galería de recuerdos especiales.
- `sorpresa.html`: página de sorpresa, listas y experiencia completa.
- `proyecto.html`: explicación del proyecto y plataforma.
- `src/styles/main.css`: diseño global, colores, tarjetas, botones, modales y responsive.

## Cambiar videos de YouTube

Los videos principales de la zona YouTube están en:

```text
src/js/data/youtube-playlist.js
```

Cada video usa este formato:

```js
createVideo('ID_DEL_VIDEO', 'Título del video');
```

El ID sale de una URL como esta:

```text
https://www.youtube.com/watch?v=NEW4w8zR0hc
```

En ese caso el ID es:

```text
NEW4w8zR0hc
```

## Cambiar recuerdos

Los recuerdos están en:

```text
src/js/data/memories.js
```

Cada recuerdo puede tener:

- `title`: nombre del recuerdo.
- `type`: tipo o insignia.
- `icon`: emoji visible.
- `description`: texto corto.
- `story`: historia larga para el modal.
- `reward`: recompensa desbloqueada.
- `videoId`: ID del video de YouTube.

## Cambiar estilos y colores

El diseño global está en:

```text
src/styles/main.css
```

Variables principales:

```css
--primary: #00f5ff;
--secondary: #ff2bd6;
--accent: #ffe45c;
--success: #7cff6b;
--violet: #8a5cff;
```

Para mantener la estética gamer, evita colores planos sin brillo y usa degradados o variables existentes.

## Footer global

El footer está repetido en las páginas HTML. Si se cambia un enlace importante, conviene aplicarlo en todas las páginas principales.

En el footer hay dos enlaces importantes:

- `Descargar proyecto para El Niño`: descarga el ZIP desde GitHub.
- `Ver proyecto en GitHub`: abre el repositorio.

## Archivos de producción

- `robots.txt`: indica a buscadores qué pueden rastrear.
- `sitemap.xml`: lista páginas importantes del sitio.
- `netlify.toml`: configuración para despliegue en Netlify.

Si se cambia el dominio final, actualizar las URLs en:

- `robots.txt`
- `sitemap.xml`

## Subir cambios a GitHub

Desde la carpeta del proyecto:

```bash
git status
git add -A
git commit -m "Descripción clara del cambio"
git push origin main
```

## Revisión antes de producción

Antes de publicar, revisar:

- Que `youtube.html` tenga solo un `<script type="module" src="./src/js/app.js"></script>`.
- Que los videos carguen correctamente.
- Que los enlaces del footer funcionen.
- Que la web se vea bien en móvil.
- Que no haya claves privadas o API keys en archivos públicos.

## Recomendación

Cuando se añadan muchas páginas o cambios repetidos, valorar pasar el proyecto a un generador estático como Astro, Eleventy o Vite para reutilizar header/footer y reducir duplicación.
