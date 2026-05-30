# Pelishome

Website estático para visualizar películas y series usando Vidking.

## Qué hace

- Muestra un catálogo de películas y series desde `catalog.json`.
- Permite alternar de forma simple entre **Películas** y **Series**.
- Reproduce contenido con:
  - Películas: `https://www.vidking.net/embed/movie/{tmdbId}`
  - Series: `https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}`
- Incluye en la página de inicio un formulario para cargar:
  - Código TMDB
  - Nombre
  - Tipo (película o serie)
  - Foto opcional

## Repositorio de texto del catálogo

El catálogo base se guarda en el archivo versionado `catalog.json`.

Desde la web puedes agregar elementos y usar **"Descargar catálogo actualizado"** para generar un nuevo `catalog.json`, luego reemplazar el archivo del repositorio y hacer commit para que quede guardado en GitHub.

## Auto deploy en GitHub Pages

El repositorio incluye el workflow `.github/workflows/deploy-pages.yml`, que despliega automáticamente al hacer push a `main`.

Asegúrate de tener GitHub Pages habilitado en el repositorio (Build and deployment: GitHub Actions).
