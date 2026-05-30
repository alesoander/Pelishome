# Pelishome

Website estático para visualizar películas y series usando Vidking.

## Qué hace

- Muestra un catálogo de películas y series desde `catalog.json`.
- Permite alternar entre **Películas** y **Series** con pestañas en la interfaz.
- Permite buscar contenidos por nombre desde el catálogo con coincidencia parcial.
- Reproduce contenido con:
  - Películas: `https://www.vidking.net/embed/movie/{tmdbId}`
  - Series: `https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}`
- Incluye una portada estilo streaming y un contenido destacado reproducible.

## Catálogo

El catálogo base se guarda en el archivo versionado `catalog.json`.
La interfaz está orientada únicamente al usuario final y no incluye formularios de carga o edición manual.

## Auto deploy en GitHub Pages

El repositorio incluye el workflow `.github/workflows/deploy-pages.yml`, que despliega automáticamente al hacer push a `main`.

Asegúrate de tener GitHub Pages habilitado en el repositorio (Build and deployment: GitHub Actions).
