# 🛸 The Rick and Morty API Explorer (`rickandmorty_api/`)

Práctica de consumo de API REST externa con JavaScript moderno (`fetch` + `async/await`).

## ✨ Funcionalidades
- **Búsqueda en tiempo real** con *debounce* de 350 ms.
- **Filtros combinados** de la API oficial: estado (`Alive`, `Dead`, `unknown`) y género (`Male`, `Female`, `Genderless`, `unknown`).
- **Paginación** completa con total de resultados.
- **Favoritos persistentes** en `localStorage` (`rm_favorites_v1`) con filtro dedicado.
- **Modal de detalle** con origen, ubicación y cantidad de episodios, con protección anti-XSS (`escapeHtml`).

## ▶️ Cómo probarlo
Abre [`index.html`](./index.html) en tu navegador o desde la **Vista Previa** del Hub principal.
