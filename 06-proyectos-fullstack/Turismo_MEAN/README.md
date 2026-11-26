# ✈️ Turismo MEAN — Plataforma Full-Stack de Destinos Turísticos

Proyecto integrador del curso **MEAN Stack** (**MongoDB • Express.js • Angular 16 • Node.js**) para la gestión de destinos turísticos de Colombia.

## 🧩 Arquitectura

- **`TurismoBack/`**: API RESTful en Node.js + Express + Mongoose con respaldo automático en archivo JSON local (`data/destinos.json`) cuando MongoDB no está disponible.
- **`TurismoFront/`**: Aplicación SPA en Angular 16 conectada a `http://localhost:4000/api/destinos` con respaldo automático en `localStorage`, ordenamiento, métricas en vivo y CRUD completo.

## 📡 Endpoints de la API (`TurismoBack`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Estado del servidor y modo de base de datos activo (`mongodb` o `local-json`) |
| `GET` | `/api/destinos` | Lista destinos; soporta `?q=`, `?ciudad=`, `?minPrecio=`, `?maxPrecio=` y `?sort=` |
| `GET` | `/api/destinos/stats/resumen` | Retorna total, precio promedio, calificación promedio y ciudades únicas |
| `GET` | `/api/destinos/:id` | Obtiene un destino específico por su ID |
| `POST` | `/api/destinos` | Crea un nuevo destino validado |
| `PUT` | `/api/destinos/:id` | Actualiza parcialmente un destino existente |
| `DELETE` | `/api/destinos/:id` | Elimina un destino por su ID |

## 🚀 Cómo ejecutar

```bash
# 1. Iniciar Backend (puerto 4000)
cd Turismo_MEAN/TurismoBack
npm install
npm start

# 2. Iniciar Frontend Angular (puerto 4200)
cd Turismo_MEAN/TurismoFront
npm install
npm start
```
