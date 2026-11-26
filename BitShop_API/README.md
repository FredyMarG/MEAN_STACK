# 🛒 BitShop_API (REST API + JWT + Studio)

API RESTful de comercio electrónico construida con **Node.js, Express, JWT y Mongoose**, con respaldo automático a **base de datos local JSON (`data/db.json`)** cuando no hay una instancia de MongoDB disponible, y un panel visual interactivo en **`/docs`**.

## 🚀 Cómo ejecutar

```bash
cd BitShop_API
npm install   # (si no existe node_modules)
npm start     # o npm run dev
```

- **API JSON:** `http://localhost:5000` (cambia automáticamente a `5001` si el `5000` está ocupado).
- **Panel Visual (API Studio):** `http://localhost:5000/docs` (o `http://localhost:5001/docs`).

## 🗄️ Base de datos y usuarios semilla

Si `USE_LOCAL_DB=true` (o si MongoDB no responde), se inicializa automáticamente `data/db.json` con 3 productos y 2 usuarios de prueba:
- **Admin:** `admin@bitshop.local` / `Admin123*`
- **Cliente:** `cliente@bitshop.local` / `Cliente123*`

## 🔐 Endpoints principales

- `GET /` — Healthcheck y modo de base de datos activo.
- `GET /docs` — Interfaz visual interactiva (BitShop_API Studio).
- `POST /api/user/login` — Inicia sesión y retorna JWT (expira en 2h).
- `POST /api/user/create-user` — Registro público (rol `client`).
- `GET /api/user/get-users` *(JWT)* — Lista usuarios sin exponer `password`.
- `GET /api/products/get-products` — Lista el catálogo público (soporta `?q=` para filtrar).
- `POST /api/products/create-product` *(JWT)* — Crea producto.
- `PUT /api/products/update-product/:productId` *(JWT)* — Actualiza producto.
- `DELETE /api/products/delete-product/:productId` *(JWT Admin)* — Elimina producto.
