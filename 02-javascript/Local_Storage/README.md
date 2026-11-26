# 💾 Persistencia con `localStorage` y JSON (`Local_Storage/`)

Práctica de **Web Storage API** enfocada en serialización segura con `JSON.stringify()` y `JSON.parse()`.

## ✨ Funcionalidades
- **Alta, eliminación individual y limpieza:** guarda nuevos valores, elimina ítems específicos con `×` o vacía la clave completa.
- **Restauración rápida:** botón **↺ Semilla** para volver al arreglo inicial `[1, 2, 3, 4, 5]`.
- **Métricas en vivo:** muestra la cantidad de ítems y el tamaño en bytes ocupado en `localStorage["llave"]`.
- **Prevención de XSS:** renderiza píldoras mediante `createElement` + `textContent`.

## ▶️ Cómo probarlo
Abre [`index.html`](./index.html) en tu navegador o desde la **Vista Previa** del Hub principal.
