# 🚀 Portafolio de Ingeniería Full-Stack MEAN — Fredy Martinez

Bienvenido al repositorio central de proyectos y desarrollos de **Fredy Martinez** (*Full-Stack Software Developer & Scrum Master*).  
El repositorio cuenta con un **Portafolio Web Interactivo** en [`index.html`](./index.html) desde el cual se puede explorar y ejecutar cada proyecto.

---

## 🖥️ Cómo abrir el Portafolio Interactivo

1. Abre directamente el archivo [`index.html`](./index.html) en tu navegador web (o mediante *Live Server* en VS Code).
2. Desde el panel principal puedes:
   - Filtrar los **36+ módulos y proyectos** por categoría (*Full-Stack & Producto*, *Backend Node/TS & MongoDB*, *Angular SPA*, *JavaScript & APIs*, *Clones UI* y *Fundamentos Web*).
   - Abrir cualquier proyecto frontend en vivo usando el botón **▶ Vista Previa Interactiva**.
   - Inspeccionar el código fuente y la arquitectura de los proyectos Backend, TypeScript, Angular y MongoDB.

---

## 📦 Contenido de Cada Proyecto del Repositorio

### 1. 🌟 Productos Integradores y Full-Stack

| Carpeta / Archivo | Descripción General | Contenido y Estructura |
| :--- | :--- | :--- |
| [`proyectoBit/`](./proyectoBit/index.html) | **Procrastination Nightmare**: Suite web de productividad y organización en equipo. | • [`index.html`](./proyectoBit/index.html), [`pomodoro.html`](./proyectoBit/pomodoro.html) y [`js/carlos.js`](./proyectoBit/js/carlos.js): Temporizador Pomodoro con modos Trabajo (25 min) y Descanso (5 min).<br>• [`to-do-list.html`](./proyectoBit/to-do-list.html) y [`js/main.js`](./proyectoBit/js/main.js): Gestor dinámico de lista de tareas.<br>• [`calendario.html`](./proyectoBit/calendario.html): Vista de calendario mensual de actividades.<br>• [`habitos.html`](./proyectoBit/habitos.html): Tracker semanal de hábitos.<br>• [`roadMapTareas.html`](./proyectoBit/roadMapTareas.html) y [`js/roadMapTareas.js`](./proyectoBit/js/roadMapTareas.js): Tablero de seguimiento de tareas con clase POO `taskData` y ordenamiento por nombre, fecha y estado.<br>• [`landing-full-bootstrap/index.html`](./proyectoBit/landing-full-bootstrap/index.html): Landing page promocional con carrusel de testimonios y galería. |
| [`procastination-nightmare/`](./procastination-nightmare/package.json) | **Procrastination Nightmare (Angular 15)**: SPA con calendario interactivo. | • Proyecto Angular 15 configurado con `@fullcalendar/angular` (`daygrid`, `timegrid`, `interaction`), `@ng-bootstrap/ng-bootstrap` y `sweetalert2`.<br>• Incluye módulo principal [`src/app/app.module.ts`](./procastination-nightmare/src/app/app.module.ts), componente raíz y sistema de diseño en [`src/styles.css`](./procastination-nightmare/src/styles.css). |
| [`Proyecto_Bit/`](./Proyecto_Bit/TurismoBack/index.js) | **Plataforma de Turismo Full-Stack (MEAN)**: Backend Express + Frontend Angular. | • `TurismoBack/`: Servidor REST en [`index.js`](./Proyecto_Bit/TurismoBack/index.js), conexión a MongoDB en [`config/db.js`](./Proyecto_Bit/TurismoBack/config/db.js) y rutas CRUD en [`routes/routes.js`](./Proyecto_Bit/TurismoBack/routes/routes.js).<br>• `TurismoFront/`: Aplicación SPA en Angular 15 ([`src/app/app.module.ts`](./Proyecto_Bit/TurismoFront/src/app/app.module.ts)). |

---

### 2. ⚙️ Backend Node.js, Express, TypeScript & MongoDB

| Carpeta / Archivo | Descripción General | Contenido y Estructura |
| :--- | :--- | :--- |
| [`is-Error-main/`](./is-Error-main/src/app.js) | **Bit-Shop REST API**: Backend de E-Commerce con autenticación JWT. | • [`src/app.js`](./is-Error-main/src/app.js) y [`src/database.js`](./is-Error-main/src/database.js): Servidor Express y conexión a MongoDB Atlas con Mongoose.<br>• [`src/Models/Product.js`](./is-Error-main/src/Models/Product.js) y [`src/Models/User.js`](./is-Error-main/src/Models/User.js): Esquemas de productos y usuarios con permisos de rol.<br>• [`src/controllers/ProductsController.js`](./is-Error-main/src/controllers/ProductsController.js) y [`src/controllers/UsersController.js`](./is-Error-main/src/controllers/UsersController.js): Lógica CRUD de catálogo, registro y login con firma de JWT.<br>• [`src/middlewares/auth.js`](./is-Error-main/src/middlewares/auth.js): Middleware `verifyToken` para proteger endpoints privados. |
| [`ts_api/`](./ts_api/app.ts) | **API REST en TypeScript**: Servidor Express modular con tipado estático. | • [`app.ts`](./ts_api/app.ts) y [`tsconfig.json`](./ts_api/tsconfig.json): Configuración del servidor y compilador TypeScript.<br>• `controllers/` y `routes/`: Módulos independientes para autenticación (`login`), constantes (`math`), calculadora aritmética (`operaciones`) y usuarios (`user`) exportados mediante barriles (`index.ts`). |
| [`Mongo/mongodb.js`](./Mongo/mongodb.js) | **Scripts CRUD en MongoDB**: Operaciones sobre la colección `characters` (`DBZ-V2`). | • Consultas y comandos `mongosh` para creación (`insertOne`, `insertMany`), lectura con filtros (`$eq`, `$gt`), actualización (`updateOne`, `updateMany` con `$set` e `$inc`) y eliminación (`deleteOne`, `deleteMany`). |
| [`simpsons-DB.txt`](./simpsons-DB.txt) | **Dataset NoSQL Los Simpsons**: Colección JSON de personajes. | • Más de 50 documentos JSON con campos `nombre`, `genero`, `id_padres`, `mascotas`, `residencia`, `empleo`, `casado` y `estado_vida`. |
| [`Primera-sesion-node/`](./Primera-sesion-node/hello-world.js) | **Algoritmos en Node.js**: Scripts de lógica ejecutables por consola. | • 8 funciones en [`hello-world.js`](./Primera-sesion-node/hello-world.js): signo numérico, paridad, múltiplos FizzBuzz (`multiplosXD`), cuadrado hueco de asteriscos, tabla de multiplicar, reloj digital 24h, serie numérica y números primos. |
| [`TypeScript/`](./TypeScript/script.ts) | **Fundamentos de TypeScript**: Tipado estático e interfaces. | • [`script.ts`](./TypeScript/script.ts) y su salida compilada [`script.js`](./TypeScript/script.js) con tipos primitivos e interfaz `Developer`. |

---

### 3. 🅰️ Aplicaciones Single Page (SPA) en Angular

| Carpeta / Archivo | Descripción General | Contenido y Estructura |
| :--- | :--- | :--- |
| [`Ejercicio_Angular/`](./Ejercicio_Angular/src/app/app.module.ts) | **SPA Multirruta en Angular 15**: Navegación y formularios con `FormsModule`. | • Configuración de rutas en [`app-routing.module.ts`](./Ejercicio_Angular/src/app/app-routing.module.ts) y 5 componentes en `src/app/router/`: `nav-bar`, `home`, verificador de `edad`, `calculadora` aritmética y detector de números `primos`. |
| [`Portafolio/`](./Portafolio/src/app/app.module.ts) | **Portafolio Personal en Angular**: Arquitectura basada en componentes. | • Compuesto por los componentes reutilizables `nav-bar`, `sobre-mi` y `portafolio` dentro de `src/app/components/`. |
| [`Never-Give-Up/`](./Never-Give-Up/src/app/app.module.ts) | **Componentes Reutilizables en Angular**: Encapsulamiento UI. | • Workspace Angular con el componente personalizado `ButtonComponent` (`src/app/components/button/`) que recibe propiedades vía `@Input()`. |

---

### 4. ⚡ JavaScript, Algoritmos, DOM y Consumo de APIs

| Carpeta / Archivo | Descripción General | Contenido y Estructura |
| :--- | :--- | :--- |
| [`Ejercicios de lógica/`](./Ejercicios%20de%20l%C3%B3gica/index.html) | **Suite de 7 Ejercicios de Lógica**: Aplicaciones interactivas con DOM y Bootstrap. | • 8 páginas HTML y 2 scripts ([`js/script.js`](./Ejercicios%20de%20l%C3%B3gica/js/script.js) y [`js/sumar_numeros.js`](./Ejercicios%20de%20l%C3%B3gica/js/sumar_numeros.js)): sumatoria de números, verificador par/impar, pizzería por edad/género, menú por texto, menú con checkboxes, tablas de multiplicar y descuentos de matrícula. |
| [`rickandmorty_api/`](./rickandmorty_api/index.html) | **Explorador Rick & Morty API**: Buscador asíncrono de personajes. | • [`index.html`](./rickandmorty_api/index.html) y [`script.js`](./rickandmorty_api/script.js) con consumo `async/await` de la API REST oficial y filtrado en tiempo real por nombre. |
| [`fetch_api/`](./fetch_api/index.html) | **Consumo de API con Fetch**: Peticiones HTTP con promesas. | • [`index.html`](./fetch_api/index.html) y [`script.js`](./fetch_api/script.js) que consultan personajes específicos mediante `fetch().then().catch()` y los pintan en tarjetas Bootstrap. |
| [`Formulario/`](./Formulario/index.html) | **Formulario Dinámico de Aspirantes**: Validación y registro en JSON. | • [`index.html`](./Formulario/index.html), [`style.css`](./Formulario/style.css) y [`script.js`](./Formulario/script.js) con activación condicional de campos, cambio de estilo según género y listado de registros en formato JSON. |
| [`JS-BIT-programing/`](./JS-BIT-programing/index.html) | **Buscador del Siguiente Número Primo**: Algoritmo matemático en JS. | • [`index.html`](./JS-BIT-programing/index.html) y [`js/script.js`](./JS-BIT-programing/js/script.js) para evaluar primalidad y hallar el siguiente primo en la recta numérica. |
| [`hackathon/`](./hackathon/index.html) | **Extractor de Parámetros URL**: Procesamiento de cadenas QueryString. | • [`index.html`](./hackathon/index.html) y [`script.js`](./hackathon/script.js) que extraen el valor de cualquier clave en una URL usando `search()` y `slice()`. |
| [`Lista-de-Tareas-master/`](./Lista-de-Tareas-master/index.html) | **To-Do List en Vanilla JS**: Gestión de tareas en el DOM. | • [`index.html`](./Lista-de-Tareas-master/index.html), [`style.css`](./Lista-de-Tareas-master/style.css) y [`main.js`](./Lista-de-Tareas-master/main.js) con creación y eliminación dinámica de nodos `<li>`. |
| [`Navbar-todolist/`](./Navbar-todolist/index.html) | **Dashboard con Sidebar + To-Do List**: Panel lateral animado. | • [`index.html`](./Navbar-todolist/index.html), [`css/style.css`](./Navbar-todolist/css/style.css) y [`js/main.js`](./Navbar-todolist/js/main.js) integrando menú lateral expandible y lista de tareas. |
| [`Local_Storage/`](./Local_Storage/index.html) | **Persistencia con LocalStorage**: Almacenamiento en el navegador. | • [`index.html`](./Local_Storage/index.html) y [`script.js`](./Local_Storage/script.js) demostrando `localStorage.setItem`, `getItem`, `JSON.stringify` y `JSON.parse`. |
| [`my-page-console/`](./my-page-console/index.html) | **My Page Console**: Emulador de terminal JS en el navegador. | • [`index.html`](./my-page-console/index.html) y [`assets/css/styles.css`](./my-page-console/assets/css/styles.css) para evaluar expresiones JavaScript e inspeccionar su salida. |
| [`Repaso JS/`](./Repaso%20JS/for.js) | **Repaso de Algoritmos JS**: Cifrado ASCII y ordenamiento burbuja. | • [`for.js`](./Repaso%20JS/for.js) (desplazamiento de caracteres ASCII +13 con `charCodeAt` y `fromCharCode`) y [`repasojs.js`](./Repaso%20JS/repasojs.js) (algoritmo *Bubble Sort*). |

---

### 5. 🎨 Clones UI, Maquetación y Fundamentos Web

| Carpeta / Archivo | Descripción General | Contenido y Estructura |
| :--- | :--- | :--- |
| [`My CV/`](./My%20CV/index.html) | **CV Web Personal**: Página de presentación profesional de Fredy Martinez. | • [`index.html`](./My%20CV/index.html) y [`style.css`](./My%20CV/style.css) con cabecera de perfil, biografía profesional, tarjetas de servicios y sección de contacto. |
| [`Instagram/`](./Instagram/index.html) | **Clon de Instagram Login**: Maquetación de pantalla de acceso Desktop. | • [`index.html`](./Instagram/index.html) y [`assets/css/style.css`](./Instagram/assets/css/style.css) con superposición de imágenes móviles (`z-index`), formulario de login y pie de página. |
| [`Spotify/`](./Spotify/index.html) y [`Proyecto-HTML-CSS-spotify/`](./Proyecto-HTML-CSS-spotify/index.html) | **Clon de Spotify Premium Colombia**: Landing page promocional. | • [`index.html`](./Spotify/index.html) y [`assets/css/style.css`](./Spotify/assets/css/style.css) con hero promocional, grilla de beneficios, pasarelas de pago y 4 tarjetas de planes (Individual, Duo, Familiar, Universitario). |
| [`Snapchat/`](./Snapchat/index.html) | **Clon de Snapchat Web**: Página promocional con barra de secciones. | • [`index.html`](./Snapchat/index.html) y [`assets/css/style.css`](./Snapchat/assets/css/style.css) con barra fija superior amarilla (`#FFFC00`), accesos a Historias, Spotlight, Chat, Lentes y Mapa. |
| [`Microsoft_Login/`](./Microsoft_Login/index.html) | **Clon de Microsoft Account Login**: Tarjeta de inicio de sesión. | • [`index.html`](./Microsoft_Login/index.html) y [`assets/css/style.css`](./Microsoft_Login/assets/css/style.css) con diseño minimalista y opciones de llave de seguridad. |
| [`Login/`](./Login/index.html) | **Modal de Autenticación**: Diálogo emergente con Bootstrap 5. | • [`index.html`](./Login/index.html) y [`style.css`](./Login/style.css) con ventana modal de ingreso de credenciales. |
| [`Tienda_Online/`](./Tienda_Online/index.html) | **BIT Shop**: Barra de navegación E-Commerce con panel colapsable. | • [`index.html`](./Tienda_Online/index.html) con buscador y tarjetas de acceso a Promociones, Nosotros, Catálogo y Soporte. |
| [`Proyecto_Guiado/`](./Proyecto_Guiado/index.html) | **Layout E-Commerce con Bootstrap Grid**: Panel y catálogo de productos. | • [`index.html`](./Proyecto_Guiado/index.html) (layout con grilla y barra lateral de perfil), [`ecommerce.html`](./Proyecto_Guiado/ecommerce.html) (catálogo de productos) y [`assets/css/style.css`](./Proyecto_Guiado/assets/css/style.css). |
| [`html5_exercise/flexbox/`](./html5_exercise/flexbox/index.html) | **Diagramación Semántica con Flexbox**: Bloques estructurales HTML5. | • [`index.html`](./html5_exercise/flexbox/index.html) y [`styles/style.css`](./html5_exercise/flexbox/styles/style.css) con distribución de `header`, `nav`, `section`, `article`, `aside` y `footer`. |
| [`Media_querys/`](./Media_querys/index.html) | **Responsive Design con Media Queries**: Adaptación por ancho de pantalla. | • [`index.html`](./Media_querys/index.html) y [`assets/css/style.css`](./Media_querys/assets/css/style.css) con puntos de quiebre en `600px` y `900px`. |
| [`Html-Css-Basic/`](./Html-Css-Basic/index.html) y [`Html-Basic/`](./Html-Basic/index.html) | **Fundamentos de HTML5 y CSS3**: Tablas, listas y formularios nativos. | • Ejemplos prácticos de tablas (`thead`, `tbody`), listas con numeración romana, jerarquía de títulos y controles de formulario (`color`, `range`, `radio`, `select`, `email`). |
| [`git-day-0/`](./git-day-0/file.txt) | **Práctica de Git**: Control de versiones. | • [`README.md`](./git-day-0/README.md) y [`file.txt`](./git-day-0/file.txt) con ejercicios de commits en Git. |
