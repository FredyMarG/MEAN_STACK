# 🔷 API REST Modular en TypeScript (`ts_api`)

Servidor Express estructurado con **TypeScript estricto**, controladores y rutas modulares exportadas mediante barriles (`index.ts`).

## 🚀 Scripts

```bash
cd ts_api
npm install
npm run build   # Compila a ./dist con tsc
npm start       # Ejecuta dist/app.js
npm run dev     # Desarrollo con nodemon + ts-node
```

## 📡 Endpoints

- `GET /` — Estado del servicio.
- `GET /api/math/...` — Constantes y utilidades matemáticas.
- `GET /api/saludo/...` — Rutas de usuario/saludo.
- `GET /api/operaciones/...` — Calculadora aritmética.
- `POST /api/login` — Validación de credenciales (`username`, `email`, `password`).
