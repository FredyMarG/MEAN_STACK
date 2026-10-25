/**
 * ============================================================================
 * MOTOR DEL PORTAFOLIO MAESTRO MEAN STACK (portfolio-app.js)
 * ============================================================================
 * Catálogo estructurado de los 37 módulos y proyectos del workspace MEAN_STACK
 * de Fredy Martinez, describiendo el contenido técnico, arquitectura y archivos
 * de cada proyecto, con vista previa interactiva en iframe e inspector de código.
 */

const PORTFOLIO_PROJECTS = [
  // ==========================================================================
  // 1. FULL-STACK & PRODUCTOS INTEGRADORES
  // ==========================================================================
  {
    id: "proyecto-bit",
    title: "Procrastination Nightmare (Suite de Productividad)",
    folder: "proyectoBit/",
    category: "fullstack",
    categoryLabel: "Producto Integrador",
    stack: ["HTML5", "CSS3 Variables", "Bootstrap 5", "JavaScript POO", "Pomodoro", "Landing Page"],
    description: "Aplicación web integral de gestión de productividad en equipo con 6 módulos interactivos conectados mediante barra de navegación lateral expandible.",
    review: "Contiene: Temporizador Pomodoro (`index.html`, `pomodoro.html` y `js/carlos.js`), Gestor de Lista de Tareas (`to-do-list.html` y `js/main.js`), Calendario de Eventos (`calendario.html`), Tracker Semanal de Hábitos (`habitos.html`), Roadmap de Tareas con programación orientada a objetos y filtros de ordenamiento (`roadMapTareas.html` y `js/roadMapTareas.js`) y Landing Page corporativa (`landing-full-bootstrap/index.html`).",
    previewUrl: "proyectoBit/index.html",
    extraLinks: [
      { label: "Landing Page", url: "proyectoBit/landing-full-bootstrap/index.html" },
      { label: "Roadmap Tareas", url: "proyectoBit/roadMapTareas.html" },
      { label: "Hábitos", url: "proyectoBit/habitos.html" },
      { label: "Calendario", url: "proyectoBit/calendario.html" },
      { label: "To-Do List", url: "proyectoBit/to-do-list.html" }
    ]
  },
  {
    id: "procastination-nightmare-angular",
    title: "Procrastination Nightmare (SPA en Angular 15 + FullCalendar)",
    folder: "procastination-nightmare/",
    category: "angular",
    categoryLabel: "Frontend Angular",
    stack: ["Angular 15", "TypeScript", "FullCalendar v6", "ng-bootstrap", "SweetAlert2"],
    description: "Versión Single Page Application (SPA) en Angular 15 de la suite Procrastination Nightmare con integración de calendario interactivo y componentes Bootstrap.",
    review: "Contiene la configuración de Angular CLI (`angular.json`, `package.json`, `tsconfig.json`), el módulo raíz (`src/app/app.module.ts`, `app-routing.module.ts`, `app.component.ts`), integración con `@fullcalendar/angular` (`daygrid`, `timegrid`, `interaction`), `@ng-bootstrap/ng-bootstrap`, `sweetalert2` y hoja de estilos global (`src/styles.css`).",
    codeSnippet: `// procastination-nightmare/package.json (Dependencias clave del proyecto Angular 15)
{
  "name": "front",
  "dependencies": {
    "@angular/core": "^15.2.0",
    "@angular/router": "^15.2.0",
    "@fullcalendar/angular": "^6.1.6",
    "@fullcalendar/daygrid": "^6.1.6",
    "@fullcalendar/interaction": "^6.1.6",
    "@fullcalendar/timegrid": "^6.1.6",
    "@ng-bootstrap/ng-bootstrap": "^14.1.1",
    "bootstrap": "^5.2.3",
    "sweetalert2": "^11.7.3"
  }
}`
  },
  {
    id: "proyecto-bit-turismo",
    title: "Plataforma de Turismo Full-Stack (MEAN)",
    folder: "Proyecto_Bit/",
    category: "fullstack",
    categoryLabel: "Full-Stack MEAN",
    stack: ["MongoDB", "Express.js", "Angular 15", "Node.js", "CORS", "dotenv"],
    description: "Arquitectura Full-Stack desacoplada para gestión de destinos turísticos dividida en servidor Backend REST y cliente Frontend SPA.",
    review: "Contiene dos subproyectos: `TurismoBack/` (servidor Node.js + Express en `index.js`, conexión a MongoDB con Mongoose en `config/db.js` y endpoints CRUD en `routes/routes.js`) y `TurismoFront/` (aplicación cliente en Angular 15 con `AppModule` y `AppComponent`).",
    codeSnippet: `// Proyecto_Bit/TurismoBack/index.js
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();
conectarDB();

app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/routes'));

app.get('/', (req, res) => {
    res.send('Servidor Backend de Turismo activo');
});

app.listen(4000, () => {
    console.log("El servidor está arriba en el puerto 4000");
});`
  },

  // ==========================================================================
  // 2. BACKEND NODE.JS, EXPRESS, TYPESCRIPT & MONGODB
  // ==========================================================================
  {
    id: "is-error-main",
    title: "Bit-Shop REST API (Express + MongoDB + JWT Auth)",
    folder: "is-Error-main/",
    category: "backend",
    categoryLabel: "Backend Node.js & JWT",
    stack: ["Node.js", "Express.js", "MongoDB Atlas", "Mongoose", "JWT", "Morgan", "CORS"],
    description: "API RESTful para comercio electrónico con autenticación basada en JSON Web Tokens (JWT) y control de permisos por rol de administrador.",
    review: "Contiene en `src/`: punto de entrada Express (`app.js`), conexión a MongoDB Atlas (`database.js`), modelos de datos Mongoose (`Models/Product.js` y `Models/User.js`), controladores CRUD y de login (`controllers/ProductsController.js` y `UsersController.js`), middleware de verificación de token (`middlewares/auth.js`) y enrutadores (`routes/ProductsRoutes.js` y `UserRoutes.js`).",
    codeSnippet: `// is-Error-main/src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw "No puedes ingresar sin un token!";
    if (token.startsWith("Bearer ")) token = token.slice(7).trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.pato = decoded; // Payload con user_id, email y permissions
    return next();
  } catch (error) {
    res.status(401).json({ error });
  }
};`
  },
  {
    id: "ts-api",
    title: "API REST Modular en TypeScript & Express",
    folder: "ts_api/",
    category: "backend",
    categoryLabel: "Backend TypeScript",
    stack: ["TypeScript", "Express.js", "Modular Routing", "Barrel Exports"],
    description: "Servidor Express fuertemente tipado con TypeScript organizado bajo arquitectura modular de rutas y controladores.",
    review: "Contiene: servidor principal (`app.ts`), configuración de compilador (`tsconfig.json`), 4 controladores en `controllers/` (`login.controller.ts`, `math.controller.ts`, `operaciones.controller.ts`, `user.controllers.ts` + `index.ts`) y 4 módulos de rutas en `routes/` (`login.routes.ts`, `math.routes.ts`, `operaciones.routes.ts`, `user.routes.ts` + `index.ts`).",
    codeSnippet: `// ts_api/controllers/operaciones.controller.ts
import Express from "express";

export function validar(num1: number, num2: number, res: Express.Response): boolean {
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        res.status(400).json({ msg: "Uno o ambos parámetros no son números válidos" });
        return false;
    }
    return true;
}

export const division = (req: Express.Request, res: Express.Response) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    if (!validar(num1, num2, res)) return;
    if (num2 === 0) return res.status(400).json({ msg: "No es posible dividir entre cero" });
    res.status(200).json({ msg: \`La división es igual a \${num1 / num2}\`, resultado: num1 / num2 });
};`
  },
  {
    id: "mongo-crud",
    title: "Scripts CRUD en MongoDB (Colección Dragon Ball Z)",
    folder: "Mongo/mongodb.js",
    category: "backend",
    categoryLabel: "Base de Datos NoSQL",
    stack: ["MongoDB", "mongosh", "NoSQL CRUD", "Operators ($eq, $gt, $set, $inc)"],
    description: "Script de operaciones NoSQL para `mongosh` sobre la base de datos `DBZ-V2` y la colección `characters`.",
    review: "Contiene ejemplos prácticos de las 4 operaciones fundamentales en MongoDB: `CREATE` (`insertOne`, `insertMany`), `READ` (`find` con filtros `$eq` y `$gt`), `UPDATE` (`updateOne` y `updateMany` con `$set` e `$inc`) y `DELETE` (`deleteOne` y `deleteMany`).",
    codeSnippet: `// Mongo/mongodb.js
use("DBZ-V2")

// READ con operadores
db.characters.find({ species: { $eq: "Namekian" } })
db.characters.find({ species: "Saiyan", edad: { $gt: 20 } })

// UPDATE
db.characters.updateOne(
    { name: "Vegeta" },
    { $set: { powerLevel: 1200000 }, $inc: { edad: 1 } }
)

// DELETE
db.characters.deleteOne({ name: "Pan" })`
  },
  {
    id: "simpsons-db",
    title: "Dataset NoSQL: Personajes de Los Simpsons",
    folder: "simpsons-DB.txt",
    category: "backend",
    categoryLabel: "Dataset NoSQL / JSON",
    stack: ["JSON", "MongoDB Dataset", "Schema Modeling"],
    description: "Colección estructurada de más de 50 documentos JSON con información de los personajes de la serie Los Simpsons lista para importar en MongoDB.",
    review: "Contiene el modelado de documentos con atributos: `nombre`, `genero`, relaciones genealógicas en arreglos (`id_padres`), `mascotas`, `residencia`, `empleo`, booleano `casado` y `estado_vida`.",
    codeSnippet: `// simpsons-DB.txt
[
  {
    "nombre": "Homer Simpson",
    "genero": "hombre",
    "id_padres": ["Abraham Simpson", "Mona Simpson"],
    "mascotas": ["Ayudante de Santa", "Gato Snowball II"],
    "residencia": "742 Evergreen Terrace",
    "empleo": "planta nuclear de Springfield",
    "casado": true,
    "estado_vida": "vivo"
  },
  {
    "nombre": "Marge Simpson",
    "genero": "mujer",
    "id_padres": ["Jack Bouvier", "Patty Bouvier"],
    "mascotas": ["Gato Snowball II"],
    "residencia": "742 Evergreen Terrace",
    "empleo": "ama de casa",
    "casado": true,
    "estado_vida": "vivo"
  }
]`
  },
  {
    id: "primera-sesion-node",
    title: "Algoritmos y Lógica en Consola con Node.js",
    folder: "Primera-sesion-node/",
    category: "backend",
    categoryLabel: "Node.js CLI",
    stack: ["Node.js", "JavaScript ES6", "Algoritmos", "CLI"],
    description: "Colección de 8 algoritmos de lógica de programación ejecutables directamente desde la terminal con Node.js.",
    review: "Contiene en `hello-world.js`: evaluación de signo numérico, verificación de paridad, variante FizzBuzz (`multiplosXD`), dibujo de cuadrado hueco con asteriscos (`dibujarCuadrado`), generador de tabla de multiplicar, simulador de reloj digital 24h, serie numérica y buscador de números primos.",
    codeSnippet: `// Primera-sesion-node/hello-world.js
function dibujarCuadrado(lado = 5) {
    for (let i = 0; i <= lado; i++) {
        let fila = "";
        for (let j = 0; j <= lado; j++) {
            fila += (i === 0 || i === lado || j === 0 || j === lado) ? "*" : " ";
        }
        console.log(fila);
    }
}`
  },
  {
    id: "typescript-intro",
    title: "Fundamentos de TypeScript y Transpilación",
    folder: "TypeScript/",
    category: "backend",
    categoryLabel: "TypeScript",
    stack: ["TypeScript", "tsc", "Interfaces", "Static Typing"],
    description: "Módulo introductorio al tipado estático en TypeScript y su transpilación a JavaScript estándar.",
    review: "Contiene el código fuente en TypeScript (`script.ts`) con declaraciones tipadas e interfaz `Developer`, junto con su archivo transpilado (`script.js`).",
    codeSnippet: `// TypeScript/script.ts
interface Developer {
    name: string;
    stack: string[];
    active: boolean;
}

const developer: Developer = {
    name: "Fredy Martinez",
    stack: ["MongoDB", "Express", "Angular", "Node.js"],
    active: true
};`
  },

  // ==========================================================================
  // 3. FRONTEND ANGULAR SPAs
  // ==========================================================================
  {
    id: "ejercicio-angular",
    title: "Aplicación SPA Multirruta en Angular",
    folder: "Ejercicio_Angular/",
    category: "angular",
    categoryLabel: "Frontend Angular",
    stack: ["Angular 15", "Angular Router", "FormsModule", "TypeScript"],
    description: "Aplicación Angular 15 con navegación SPA mediante `RouterModule` y formularios reactivos con two-way data binding (`[(ngModel)]`).",
    review: "Contiene `AppModule`, `AppRoutingModule` y 5 componentes en `src/app/router/`: barra de navegación (`nav-bar`), pantalla de bienvenida (`home`), verificador de mayoría de edad (`edad`), calculadora aritmética (`calculadora`) y validador de números primos (`primos`).",
    codeSnippet: `// Ejercicio_Angular/src/app/app-routing.module.ts
const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "edad", component: EdadComponent },
  { path: "calculadora", component: CalculadoraComponent },
  { path: "primo", component: PrimosComponent }
];`
  },
  {
    id: "portafolio-angular",
    title: "Portafolio Personal Basado en Componentes (Angular)",
    folder: "Portafolio/",
    category: "angular",
    categoryLabel: "Frontend Angular",
    stack: ["Angular 15", "Component Architecture", "TypeScript"],
    description: "SPA de portafolio profesional estructurada mediante componentes modulares en Angular 15.",
    review: "Contiene en `src/app/components/`: barra de navegación (`nav-bar`), sección de perfil profesional (`sobre-mi`) y vitrina de proyectos (`portafolio`), integrados en la vista principal `app.component.html`.",
    codeSnippet: `<!-- Portafolio/src/app/app.component.html -->
<app-nav-bar></app-nav-bar>
<app-sobre-mi></app-sobre-mi>
<app-portafolio></app-portafolio>
<router-outlet></router-outlet>`
  },
  {
    id: "never-give-up-angular",
    title: "Never-Give-Up (Componentes Reutilizables en Angular)",
    folder: "Never-Give-Up/",
    category: "angular",
    categoryLabel: "Frontend Angular",
    stack: ["Angular 15", "Custom Components", "TypeScript"],
    description: "Proyecto en Angular 15 enfocado en la creación de componentes de interfaz reutilizables con entradas y eventos personalizados.",
    review: "Contiene el módulo principal (`src/app/app.module.ts`) y el componente reutilizable `ButtonComponent` (`src/app/components/button/`) con decoradores `@Input()` y `@Output()`.",
    codeSnippet: `// Never-Give-Up/src/app/app.module.ts
@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent
  ],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }`
  },

  // ==========================================================================
  // 4. JAVASCRIPT INTERACTIVO, LÓGICA & CONSUMO DE APIS
  // ==========================================================================
  {
    id: "ejercicios-logica",
    title: "Suite de 7 Ejercicios de Lógica en JavaScript",
    folder: "Ejercicios de lógica/",
    category: "js",
    categoryLabel: "JavaScript & DOM",
    stack: ["JavaScript ES6", "DOM Manipulation", "Bootstrap 5", "Algoritmos"],
    description: "Portal web interactivo con 7 aplicaciones prácticas para entrenar condicionales, ciclos, formularios y manipulación del DOM.",
    review: "Contiene 8 vistas HTML (`index.html`, `suma_numeros.html`, `par_impar.html`, `pizza.html`, `menu.html`, `menu_checkbox.html`, `tablas_multiplicar.html`, `descuentos.html`) y 2 scripts (`js/script.js` y `js/sumar_numeros.js`) que resuelven sumatorias, paridad, premios por edad/género, pedidos de menú, tablas de multiplicar y descuentos de matrícula por promedio.",
    previewUrl: "Ejercicios de lógica/index.html"
  },
  {
    id: "rickandmorty-api",
    title: "Buscador de Personajes - The Rick and Morty API",
    folder: "rickandmorty_api/",
    category: "js",
    categoryLabel: "APIs & Async/Await",
    stack: ["Fetch API", "Async/Await", "REST API", "Bootstrap 5"],
    description: "Explorador dinámico de personajes conectado a la API REST oficial de Rick & Morty con filtrado en tiempo real.",
    review: "Contiene la interfaz con barra de búsqueda (`index.html`) y la lógica asíncrona (`script.js`) que consulta `https://rickandmortyapi.com/api/character/` usando `async/await` y renderiza tarjetas con foto, especie, origen y estado vital.",
    previewUrl: "rickandmorty_api/index.html"
  },
  {
    id: "fetch-api",
    title: "Consumo de API con Fetch y Promesas (.then / .catch)",
    folder: "fetch_api/",
    category: "js",
    categoryLabel: "APIs & Fetch",
    stack: ["JavaScript", "Fetch API", "Promises", "Bootstrap 5"],
    description: "Aplicación de consulta HTTP GET mediante promesas nativas (`fetch().then().catch()`) para renderizar personajes específicos.",
    review: "Contiene `index.html` con grilla Bootstrap y `script.js` que consume el endpoint `/character/1,183` y construye las tarjetas dinámicamente en el contenedor `#printer`.",
    previewUrl: "fetch_api/index.html"
  },
  {
    id: "formulario-aspirantes",
    title: "Formulario Dinámico de Aspirantes con Lista JSON",
    folder: "Formulario/",
    category: "js",
    categoryLabel: "JavaScript & Formularios",
    stack: ["JavaScript", "Form Validation", "JSON List", "Bootstrap 5"],
    description: "Formulario interactivo de postulación laboral con campos condicionales, estilos dinámicos y almacenamiento en memoria en formato JSON.",
    review: "Contiene el formulario (`index.html`), estilos personalizados (`style.css`) y controlador (`script.js`) que habilita el input 'Otro cargo' según selección, adapta el color del botón por género, valida campos requeridos y lista los aspirantes registrados.",
    previewUrl: "Formulario/index.html"
  },
  {
    id: "js-bit-programing",
    title: "Algoritmo Buscador del Siguiente Número Primo",
    folder: "JS-BIT-programing/",
    category: "js",
    categoryLabel: "Algoritmos JS",
    stack: ["JavaScript", "Teoría de Números", "Bootstrap 5"],
    description: "Herramienta matemática que evalúa si un número entero es primo y determina cuál es el siguiente número primo inmediato.",
    review: "Contiene la vista interactiva (`index.html`) y el motor de cálculo (`js/script.js`) con funciones de verificación de primalidad y búsqueda incremental.",
    previewUrl: "JS-BIT-programing/index.html"
  },
  {
    id: "hackathon-url",
    title: "Reto Hackathon: Extractor de Query Params de URL",
    folder: "hackathon/",
    category: "js",
    categoryLabel: "Algoritmos & Strings",
    stack: ["JavaScript", "String.search()", "String.slice()", "Bootstrap 5"],
    description: "Analizador de cadenas URL que extrae el valor de cualquier parámetro de consulta (`?nombre=Miguel&edad=125`).",
    review: "Contiene la interfaz de prueba (`index.html`) y el algoritmo de extracción de subcadenas (`script.js`) basado en los métodos `search()` y `slice()`.",
    previewUrl: "hackathon/index.html"
  },
  {
    id: "lista-de-tareas",
    title: "Gestor de Lista de Tareas (Vanilla JS To-Do App)",
    folder: "Lista-de-Tareas-master/",
    category: "js",
    categoryLabel: "JavaScript & DOM",
    stack: ["HTML5", "CSS3", "Vanilla JS", "DOM Events"],
    description: "Aplicación de lista de tareas pendientes con creación y eliminación dinámica de elementos en el DOM.",
    review: "Contiene la maquetación (`index.html`), hoja de estilos (`style.css`) y lógica de eventos (`main.js`) para agregar ítems `<li>`, adjuntar el botón de borrado `addDeleteBtn()` y alternar el mensaje de lista vacía.",
    previewUrl: "Lista-de-Tareas-master/index.html"
  },
  {
    id: "navbar-todolist",
    title: "Dashboard con Sidebar Expandible + To-Do List",
    folder: "Navbar-todolist/",
    category: "js",
    categoryLabel: "Dashboard UI & DOM",
    stack: ["Bootstrap 5", "Material Icons", "CSS Transitions", "JavaScript"],
    description: "Panel de administración que combina una barra de navegación superior, un menú lateral colapsable con animaciones CSS y un módulo de tareas.",
    review: "Contiene `index.html`, estilos de transición del sidebar (`css/style.css`) y el controlador de tareas (`js/main.js`).",
    previewUrl: "Navbar-todolist/index.html"
  },
  {
    id: "local-storage",
    title: "Persistencia en Navegador con LocalStorage y JSON",
    folder: "Local_Storage/",
    category: "js",
    categoryLabel: "Web Storage API",
    stack: ["LocalStorage", "JSON.stringify", "JSON.parse", "Bootstrap 5"],
    description: "Módulo de almacenamiento persistente en el navegador utilizando la API `window.localStorage` y serialización JSON.",
    review: "Contiene la interfaz interactiva (`index.html`) y el script (`script.js`) que guarda, recupera (`JSON.parse`) y elimina colecciones de datos en el almacenamiento local del navegador.",
    previewUrl: "Local_Storage/index.html"
  },
  {
    id: "my-page-console",
    title: "My Page Console (Sandbox Interactivo de JavaScript)",
    folder: "my-page-console/",
    category: "js",
    categoryLabel: "JS Sandbox",
    stack: ["HTML5", "CSS3 Terminal UI", "JavaScript Evaluation"],
    description: "Consola interactiva en el navegador con estética de terminal para ejecutar expresiones JavaScript en vivo.",
    review: "Contiene la interfaz de consola (`index.html`) y su tema oscuro tipo terminal (`assets/css/styles.css`).",
    previewUrl: "my-page-console/index.html"
  },
  {
    id: "repaso-js",
    title: "Repaso JS: Cifrado ASCII ROT13 y Bubble Sort",
    folder: "Repaso JS/",
    category: "js",
    categoryLabel: "Algoritmos Clásicos",
    stack: ["JavaScript ES6", "ASCII charCodeAt", "Bubble Sort", "Arrow Functions"],
    description: "Scripts de algoritmos clásicos en JavaScript enfocados en manipulación de caracteres ASCII y ordenamiento de arreglos.",
    review: "Contiene dos archivos: `for.js` (transformación de cadenas sumando +13 al código ASCII con `charCodeAt` y `fromCharCode`, más funciones flecha) y `repasojs.js` (implementación del algoritmo de ordenamiento burbuja *Bubble Sort*).",
    codeSnippet: `// Repaso JS/for.js (Cifrado por desplazamiento ASCII +13)
let txt = "Michael";
let ert = "";
for (let pos of txt) {
    let ascci = pos.charCodeAt(0) + 13;
    ert += String.fromCharCode(ascci);
}
console.log(\`Original: \${txt} -> Cifrado: \${ert}\`);`
  },

  // ==========================================================================
  // 5. CLONES UI & MAQUETACIÓN AVANZADA
  // ==========================================================================
  {
    id: "my-cv",
    title: "CV Web Personal — Fredy Martinez",
    folder: "My CV/",
    category: "ui",
    categoryLabel: "Portafolio / CV",
    stack: ["HTML5", "CSS3 Flexbox", "Material Icons", "Responsive Cards"],
    description: "Currículum web personal de Fredy Martinez con presentación ejecutiva, fotografía y tarjetas de áreas de especialidad.",
    review: "Contiene la estructura semántica (`index.html`), estilos Flexbox y tarjetas con sombras (`style.css`) y recursos gráficos en `assets/img/`.",
    previewUrl: "My CV/index.html"
  },
  {
    id: "instagram-clone",
    title: "Clon de Inicio de Sesión de Instagram",
    folder: "Instagram/",
    category: "ui",
    categoryLabel: "Clon UI",
    stack: ["HTML5", "CSS3 Positioning", "Flexbox", "Font Awesome"],
    description: "Maquetación de la página de acceso de Instagram para escritorio con composición de capturas móviles y formulario de login.",
    review: "Contiene `index.html`, hoja de estilos `assets/css/style.css` con posicionamiento relativo/absoluto (`z-index`) y activos visuales en `assets/img/`.",
    previewUrl: "Instagram/index.html"
  },
  {
    id: "spotify-clone",
    title: "Clon de Spotify Premium Colombia",
    folder: "Spotify/",
    category: "ui",
    categoryLabel: "Clon UI",
    stack: ["HTML5 Semántico", "CSS3 Flexbox", "Font Awesome", "Pasarelas de Pago"],
    description: "Landing page promocional de Spotify Premium con sección de beneficios, métodos de pago y comparativa de 4 planes de suscripción.",
    review: "Contiene `index.html` (333 líneas de estructura semántica), hoja de estilos `assets/css/style.css` e iconografía en `assets/img/` (disponible también en `Proyecto-HTML-CSS-spotify/`).",
    previewUrl: "Spotify/index.html"
  },
  {
    id: "snapchat-clone",
    title: "Clon de Landing Page de Snapchat Web",
    folder: "Snapchat/",
    category: "ui",
    categoryLabel: "Clon UI",
    stack: ["HTML5", "Bootstrap 5", "CSS3", "Material Symbols"],
    description: "Réplica de la interfaz promocional de Snapchat con navegación de Historias, Spotlight, Chat, Lentes y Mapa.",
    review: "Contiene `index.html`, estilos corporativos en `assets/css/style.css` y activos gráficos en `assets/img/`.",
    previewUrl: "Snapchat/index.html"
  },
  {
    id: "microsoft-login",
    title: "Clon de Inicio de Sesión de Microsoft Account",
    folder: "Microsoft_Login/",
    category: "ui",
    categoryLabel: "Clon UI",
    stack: ["HTML5", "Bootstrap 5 Local", "Material Symbols"],
    description: "Réplica minimalista de la ventana de autenticación de cuentas Microsoft.",
    review: "Contiene `index.html`, hoja de estilos `assets/css/style.css`, distribución local de Bootstrap 5 y logotipo oficial en `assets/img/`.",
    previewUrl: "Microsoft_Login/index.html"
  },
  {
    id: "login-modal",
    title: "Ventana Modal de Autenticación (Bootstrap 5)",
    folder: "Login/",
    category: "ui",
    categoryLabel: "Componente UI",
    stack: ["HTML5", "Bootstrap 5 Modal", "CSS3 Gradient"],
    description: "Componente de inicio de sesión desplegado dentro de un diálogo modal animado de Bootstrap 5.",
    review: "Contiene `index.html` con estructura `.modal.fade` y `style.css` con fondo degradado y tarjeta estilizada.",
    previewUrl: "Login/index.html"
  },
  {
    id: "tienda-online",
    title: "BIT Shop — Mega Menú de Tienda Online",
    folder: "Tienda_Online/",
    category: "ui",
    categoryLabel: "Maquetación E-Commerce",
    stack: ["HTML5", "Bootstrap 5 Collapse", "Material Symbols"],
    description: "Cabecera de tienda virtual con barra de búsqueda y panel desplegable de categorías.",
    review: "Contiene `index.html` con tarjetas de acceso rápido a Promociones, Nosotros, Catálogo y Soporte.",
    previewUrl: "Tienda_Online/index.html"
  },
  {
    id: "proyecto-guiado",
    title: "Layout de Administración E-Commerce (Bootstrap Grid)",
    folder: "Proyecto_Guiado/",
    category: "ui",
    categoryLabel: "Maquetación Bootstrap",
    stack: ["HTML5", "Bootstrap 5 Grid", "Flexbox Sidebar"],
    description: "Maquetación de panel administrativo y catálogo de productos utilizando el sistema de grillas de Bootstrap 5.",
    review: "Contiene la vista principal con barra lateral de perfil (`index.html`), vista de catálogo de productos (`ecommerce.html`), estilos (`assets/css/style.css`) e imágenes en `assets/img/`.",
    previewUrl: "Proyecto_Guiado/index.html",
    extraLinks: [
      { label: "Catálogo E-Commerce", url: "Proyecto_Guiado/ecommerce.html" }
    ]
  },

  // ==========================================================================
  // 6. FUNDAMENTOS HTML5, CSS3, FLEXBOX, MEDIA QUERIES & GIT
  // ==========================================================================
  {
    id: "html5-flexbox",
    title: "Diagramación Semántica HTML5 con Flexbox",
    folder: "html5_exercise/flexbox/",
    category: "html",
    categoryLabel: "Fundamentos CSS3",
    stack: ["HTML5 Semántico", "CSS3 Flexbox", "Box Model"],
    description: "Maquetación de estructura clásica de bloques semánticos HTML5 utilizando `display: flex`.",
    review: "Contiene `index.html` y `styles/style.css` diagramando `<header>`, `<nav>`, `<section>`, `<article>`, `<aside>` y `<footer>`.",
    previewUrl: "html5_exercise/flexbox/index.html"
  },
  {
    id: "media-querys",
    title: "Laboratorio de Responsive Design con Media Queries",
    folder: "Media_querys/",
    category: "html",
    categoryLabel: "Responsive CSS3",
    stack: ["HTML5", "CSS3 @media", "Mobile-First"],
    description: "Ejercicio demostrativo de diseño web adaptable según el ancho de la ventana del navegador.",
    review: "Contiene `index.html` y `assets/css/style.css` con reglas `@media (min-width: 600px)` y `@media (min-width: 900px)`.",
    previewUrl: "Media_querys/index.html"
  },
  {
    id: "html-css-basic",
    title: "Fundamentos de Listas y Tablas Estilizadas",
    folder: "Html-Css-Basic/",
    category: "html",
    categoryLabel: "Fundamentos HTML/CSS",
    stack: ["HTML5 Tables", "Ordered/Unordered Lists", "CSS3"],
    description: "Práctica de estructuración y estilizado de listas ordenadas, desordenadas y tablas de datos en HTML5.",
    review: "Contiene `index.html` y `style.css` con ejemplos de listas con viñetas personalizadas, numeración romana y tablas con bordes.",
    previewUrl: "Html-Css-Basic/index.html"
  },
  {
    id: "html-basic",
    title: "Catálogo de Inputs y Etiquetas Semánticas HTML5",
    folder: "Html-Basic/",
    category: "html",
    categoryLabel: "Fundamentos HTML5",
    stack: ["HTML5 Forms", "Semantic Tags", "Typography"],
    description: "Muestrario de elementos nativos de formularios HTML5, jerarquía tipográfica y etiquetas de texto.",
    review: "Contiene `index.html` con controles `color`, `radio`, `range`, `select`, `email`, `checkbox`, encabezados `h1`-`h6` y listas de definición (`dl`, `dt`, `dd`).",
    previewUrl: "Html-Basic/index.html"
  },
  {
    id: "git-day-0",
    title: "Control de Versiones con Git (Práctica de Commits)",
    folder: "git-day-0/",
    category: "html",
    categoryLabel: "Git & Flujo de Trabajo",
    stack: ["Git", "Version Control", "Markdown"],
    description: "Repositorio de práctica de inicialización y seguimiento de versiones con Git.",
    review: "Contiene `README.md` y `file.txt` con el registro de prácticas de `git init`, `git add` y `git commit`.",
    codeSnippet: `# git-day-0/file.txt
hola  mi quinto commit

# Comandos practicados en este módulo:
git init
git status
git add .
git commit -m "hola mi quinto commit"
git log --oneline`
  }
];

// ============================================================================
// LÓGICA DE RENDERIZADO Y FILTRADO DEL PORTAFOLIO
// ============================================================================

const gridContainer = document.getElementById("projectsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("projectSearch");
const countBadge = document.getElementById("projectCountBadge");

let currentCategory = "all";
let currentSearch = "";

/**
 * Renderiza las tarjetas de proyectos según el filtro de categoría y búsqueda activa.
 */
function renderPortfolio() {
  const filtered = PORTFOLIO_PROJECTS.filter((proj) => {
    const matchesCategory = currentCategory === "all" || proj.category === currentCategory;
    const query = currentSearch.toLowerCase();
    const matchesSearch =
      !query ||
      proj.title.toLowerCase().includes(query) ||
      proj.folder.toLowerCase().includes(query) ||
      proj.description.toLowerCase().includes(query) ||
      proj.stack.some((s) => s.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} proyectos mostrados`;
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <h4 class="text-secondary">No se encontraron proyectos con ese filtro.</h4>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered
    .map((proj) => {
      const stackBadges = proj.stack
        .map((tech) => `<span class="tech-tag">${tech}</span>`)
        .join("");

      const extraLinksHtml = (proj.extraLinks || [])
        .map(
          (lnk) =>
            `<button type="button" class="btn btn-sm btn-outline-info py-1 px-2" onclick="openPreviewModal('${proj.title} — ${lnk.label}', '${lnk.url}')">${lnk.label}</button>`
        )
        .join("");

      const actionButton = proj.previewUrl
        ? `<div class="d-flex flex-wrap gap-2 mt-auto pt-3">
             <button type="button" class="btn btn-info btn-sm fw-bold text-dark flex-grow-1" onclick="openPreviewModal('${proj.title}', '${proj.previewUrl}')">
               ▶ Vista Previa Interactiva
             </button>
             <a href="${proj.previewUrl}" target="_blank" class="btn btn-outline-light btn-sm" title="Abrir en pestaña nueva">
               ↗ Abrir
             </a>
           </div>`
        : `<div class="d-flex flex-wrap gap-2 mt-auto pt-3">
             <button type="button" class="btn btn-outline-warning btn-sm fw-semibold w-100" onclick="openCodeModal('${proj.id}')">
               &lt;/&gt; Inspeccionar Código y Arquitectura
             </button>
           </div>`;

      return `
      <div class="col-lg-4 col-md-6">
        <article class="project-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="cat-badge cat-${proj.category}">${proj.categoryLabel}</span>
            <span class="file-path-tag">📁 ${proj.folder}</span>
          </div>

          <h5 class="fw-bold mb-2 text-white">${proj.title}</h5>
          <p class="small text-secondary mb-2">${proj.description}</p>

          <div class="review-box">
            <strong class="text-info d-block mb-1">📦 Contenido del Proyecto:</strong>
            ${proj.review}
          </div>

          <div class="d-flex flex-wrap gap-1 mb-2">
            ${stackBadges}
          </div>

          ${extraLinksHtml ? `<div class="d-flex flex-wrap gap-1 mb-2">${extraLinksHtml}</div>` : ""}

          ${actionButton}
        </article>
      </div>
      `;
    })
    .join("");
}

/**
 * Abre el modal con un iframe en vivo para interactuar con el proyecto seleccionado.
 */
window.openPreviewModal = function (title, url) {
  const modalTitle = document.getElementById("previewModalTitle");
  const iframe = document.getElementById("previewIframe");
  const externalLink = document.getElementById("previewExternalLink");
  const codeContainer = document.getElementById("codeInspectorContainer");
  const iframeContainer = document.getElementById("iframeContainer");

  modalTitle.textContent = title;
  externalLink.href = url;
  externalLink.classList.remove("d-none");
  codeContainer.classList.add("d-none");
  iframeContainer.classList.remove("d-none");
  iframe.src = url;

  const modal = new bootstrap.Modal(document.getElementById("portfolioModal"));
  modal.show();
};

/**
 * Abre el modal mostrando el código fuente comentado y la arquitectura para proyectos Backend/Angular.
 */
window.openCodeModal = function (projectId) {
  const proj = PORTFOLIO_PROJECTS.find((p) => p.id === projectId);
  if (!proj) return;

  const modalTitle = document.getElementById("previewModalTitle");
  const externalLink = document.getElementById("previewExternalLink");
  const codeContainer = document.getElementById("codeInspectorContainer");
  const iframeContainer = document.getElementById("iframeContainer");
  const codeBlock = document.getElementById("codeBlockContent");
  const reviewNotes = document.getElementById("codeReviewNotes");

  modalTitle.textContent = `${proj.title} (${proj.folder})`;
  externalLink.classList.add("d-none");
  iframeContainer.classList.add("d-none");
  codeContainer.classList.remove("d-none");

  reviewNotes.textContent = proj.review;
  codeBlock.textContent = proj.codeSnippet || "// Código documentado en la carpeta " + proj.folder;

  const modal = new bootstrap.Modal(document.getElementById("portfolioModal"));
  modal.show();
};

// Limpiar el iframe al cerrar el modal
document.getElementById("portfolioModal").addEventListener("hidden.bs.modal", () => {
  document.getElementById("previewIframe").src = "about:blank";
});

// Eventos de filtrado por categoría
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-category");
    renderPortfolio();
  });
});

// Evento de búsqueda en tiempo real
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim();
    renderPortfolio();
  });
}

// Renderizado inicial
renderPortfolio();
