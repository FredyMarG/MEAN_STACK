# 🏆 Reto Hackathon: Extractor de Query Params (`hackathon/`)

Práctica comparativa entre el parseo manual de QueryStrings (`indexOf`, `slice`, `split`) y la API estándar del navegador (`URL` + `URLSearchParams`).

## ✨ Funcionalidades
- **Comparativa en vivo:** muestra lado a lado el objeto extraído manualmente y el generado por `URLSearchParams`.
- **Anatomía de la URL:** desglosa `protocol`, `host`, `pathname` y `hash`.
- **Tabla segura clave/valor:** renderiza cada parámetro con `textContent` (sin XSS).
- **Constructor de parámetros:** permite añadir nuevas parejas `clave=valor` codificando espacios y caracteres especiales automáticamente.

## ▶️ Cómo probarlo
Abre [`index.html`](./index.html) en tu navegador o desde la **Vista Previa** del Hub principal.
