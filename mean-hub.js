/**
 * ============================================================================
 * CONTROLADOR DEL CENTRO DE PRÁCTICAS MEAN STACK (mean-hub.js)
 * ============================================================================
 * Propósito: Renderizar el catálogo de módulos del curso MEAN Stack, filtrar
 * por categoría o búsqueda y abrir vistas previas o instrucciones CLI de forma
 * segura (sin interpolación de handlers inline ni XSS).
 */

const COURSE_MODULES = [
  // Full-Stack MEAN
  {
    title: "Turismo MEAN (Full-Stack)",
    folder: "Turismo_MEAN/",
    category: "fullstack",
    tags: ["Angular 16", "Express", "MongoDB/JSON"],
    description: "Plataforma completa de gestión de destinos turísticos con API CRUD + filtros en puerto 4000 y cliente Angular con respaldo offline.",
    runCmd: "# Terminal 1 (Backend con nodemon):\ncd Turismo_MEAN/TurismoBack && npm run dev\n\n# Terminal 2 (Frontend Angular):\ncd Turismo_MEAN/TurismoFront && npm run dev"
  },
  {
    title: "Procrastination Nightmare (Suite Web)",
    folder: "proyectoBit/",
    category: "fullstack",
    tags: ["HTML5", "Bootstrap 5", "JavaScript", "localStorage"],
    description: "Suite de productividad: Pomodoro (25/5m), To-Do List, Calendario, Tracker de Hábitos y Roadmap POO con persistencia local.",
    previewUrl: "proyectoBit/index.html"
  },
  {
    title: "Procrastination Nightmare (Angular)",
    folder: "procrastination-nightmare/",
    category: "fullstack",
    tags: ["Angular 16", "Bootstrap 5", "localStorage"],
    description: "Versión SPA en Angular con temporizador Pomodoro y lista de tareas persistente.",
    runCmd: "cd procrastination-nightmare && npm run dev"
  },

  // Backend Node, TS & MongoDB
  {
    title: "BitShop_API (REST + JWT + RBAC)",
    folder: "BitShop_API/",
    category: "backend",
    tags: ["Node.js", "Express", "JWT", "scrypt", "MongoDB/JSON"],
    description: "API E-Commerce con autenticación JWT, hashing scrypt, control de roles admin/client, interfaz Login-first en / y /docs, y respaldo local JSON.",
    runCmd: "cd BitShop_API && npm run dev\n# Panel visual (Login-first): http://localhost:5000 (y /docs)\n# Demo admin: admin@bitshop.local / Admin123*"
  },
  {
    title: "API REST Modular en TypeScript",
    folder: "ts_api/",
    category: "backend",
    tags: ["TypeScript", "Express", "nodemon", "Strict Mode"],
    description: "Servidor Express modular en TypeScript estricto con interfaz Login-first en / (rutas /api/math, /api/saludo, /api/operaciones, /api/login).",
    runCmd: "cd ts_api && npm run dev\n# Panel visual: http://localhost:3000 (o respaldo 3001)\n# Demo: demo_dev / demo@tsapi.local / Demo123*"
  },
  {
    title: "Práctica CRUD MongoDB (DBZ-V2)",
    folder: "Mongo/",
    category: "backend",
    tags: ["MongoDB", "mongosh", "Node.js", "Playground Web"],
    description: "Comandos mongosh CRUD, simulador Node.js con operadores ($eq, $ne, $gte, $lt, $in, $or, $set, $inc, $unset, $push) y Playground Web en puerto 3002.",
    runCmd: "cd Mongo && npm run dev\n# Playground Web: http://localhost:3002\n# Solo consola: npm run demo"
  },
  {
    title: "Simpsons DB Explorer (NoSQL + CRUD)",
    folder: "simpsons-db/",
    category: "backend",
    tags: ["JSON", "NoSQL", "Node.js", "CRUD"],
    description: "Explorador web y API REST en Node.js para la colección de 50 personajes de Los Simpsons (simpsons.json + simpsons-DB.txt).",
    runCmd: "cd simpsons-db && npm run dev\n# Explorador Web: http://localhost:3003"
  },
  {
    title: "Algoritmos en Node.js",
    folder: "Primera-sesion-node/",
    category: "backend",
    tags: ["Node.js", "Algoritmos", "Lab Interactivo"],
    description: "8 funciones exportables con vista web interactiva: paridad, FizzBuzz, figuras ASCII, reloj 24h y números primos en O(n sqrt(n)).",
    previewUrl: "Primera-sesion-node/index.html",
    runCmd: "cd Primera-sesion-node && npm run dev\n# Vista Node: http://localhost:3005\n# Solo consola: npm start"
  },
  {
    title: "Fundamentos de TypeScript",
    folder: "TypeScript/",
    category: "backend",
    tags: ["TypeScript", "Interfaces", "Genéricos", "Clases"],
    description: "Tipado estático, tuplas, Union Types, interfaces, genéricos <T>, clases encapsuladas y compilación estricta.",
    previewUrl: "TypeScript/index.html",
    runCmd: "cd TypeScript && npm run dev\n# Pruebas: npm test"
  },

  // Angular SPA
  {
    title: "SPA Multirruta Angular",
    folder: "Ejercicio_Angular/",
    category: "angular",
    tags: ["Angular", "FormsModule", "Routing"],
    description: "Aplicación multirruta con verificador de edad, calculadora de 4 operaciones y detector de números primos.",
    runCmd: "cd Ejercicio_Angular && npm run dev"
  },
  {
    title: "Vitrina de Proyectos Angular",
    folder: "proyectos-angular/",
    category: "angular",
    tags: ["Angular", "Routing", "Componentes"],
    description: "Ejercicio de arquitectura por componentes y navegación entre vistas con filtros.",
    runCmd: "cd proyectos-angular && npm run dev"
  },
  {
    title: "Componente Botón @Input/@Output",
    folder: "angular-input-output/",
    category: "angular",
    tags: ["Angular", "@Input", "@Output"],
    description: "Demostración de comunicación padre-hijo mediante propiedades de entrada y eventos personalizados.",
    runCmd: "cd angular-input-output && npm run dev"
  },

  // JavaScript & APIs
  {
    title: "Suite de 7 Ejercicios de Lógica",
    folder: "ejercicios-logica/",
    category: "js",
    tags: ["JavaScript", "DOM", "Bootstrap 5"],
    description: "Sumatoria O(1) de Gauss, par/impar, pizzería, menús, tablas de multiplicar y cálculo de descuentos.",
    previewUrl: "ejercicios-logica/index.html"
  },
  {
    title: "Explorador Rick & Morty API",
    folder: "rickandmorty_api/",
    category: "js",
    tags: ["async/await", "Fetch API", "Paginación"],
    description: "Buscador en tiempo real con debounce y paginación completa consumiendo la API oficial.",
    previewUrl: "rickandmorty_api/index.html"
  },
  {
    title: "Consumo de API con Fetch",
    folder: "fetch_api/",
    category: "js",
    tags: ["Fetch", "Promesas"],
    description: "Consulta HTTP con promesas .then/.catch, indicador de carga y tarjetas Bootstrap.",
    previewUrl: "fetch_api/index.html"
  },
  {
    title: "Formulario Dinámico de Aspirantes",
    folder: "Formulario/",
    category: "js",
    tags: ["Validación", "JSON", "localStorage"],
    description: "Registro de aspirantes con validación de correo/salario y persistencia local.",
    previewUrl: "Formulario/index.html"
  },
  {
    title: "Buscador del Siguiente Primo",
    folder: "JS-BIT-programing/",
    category: "js",
    tags: ["Algoritmos", "O(sqrt(n))"],
    description: "Evaluación de primalidad optimizada y cálculo del próximo número primo.",
    previewUrl: "JS-BIT-programing/index.html"
  },
  {
    title: "Extractor de Query Params (Hackathon)",
    folder: "hackathon/",
    category: "js",
    tags: ["URLSearchParams", "Strings"],
    description: "Comparativa entre parser manual de QueryString y la API nativa URLSearchParams.",
    previewUrl: "hackathon/index.html"
  },
  {
    title: "Dashboard Sidebar + To-Do List",
    folder: "Navbar-todolist/",
    category: "js",
    tags: ["Sidebar", "localStorage", "Bootstrap Icons"],
    description: "Panel lateral interactivo combinado con gestor de tareas persistente.",
    previewUrl: "Navbar-todolist/index.html"
  },
  {
    title: "Práctica de LocalStorage",
    folder: "Local_Storage/",
    category: "js",
    tags: ["Web Storage", "JSON"],
    description: "Serialización y deserialización segura con JSON.stringify y JSON.parse.",
    previewUrl: "Local_Storage/index.html"
  },
  {
    title: "My Page Console (Terminal JS)",
    folder: "my-page-console/",
    category: "js",
    tags: ["Sandbox", "Console"],
    description: "Emulador de consola JS en navegador con captura de console.log e historial con flechas.",
    previewUrl: "my-page-console/index.html"
  },
  {
    title: "Repaso Algoritmos JS (ROT13 & Sort)",
    folder: "repaso-js/",
    category: "js",
    tags: ["Node.js", "ROT13", "Bubble Sort"],
    description: "Cifrado ROT13 con rotación alfabética exacta, Bubble Sort optimizado y laboratorio web interactivo.",
    previewUrl: "repaso-js/index.html",
    runCmd: "cd repaso-js && npm start\n# Pruebas: npm test"
  },

  // Maquetación & UI
  {
    title: "BIT Shop — Tienda Online",
    folder: "Tienda_Online/",
    category: "ui",
    tags: ["Bootstrap 5", "Carrito", "localStorage"],
    description: "Catálogo interactivo con búsqueda, filtros de categoría y carrito persistente con control de cantidades.",
    previewUrl: "Tienda_Online/index.html"
  },
  {
    title: "E-Commerce Proyecto Guiado",
    folder: "Proyecto_Guiado/",
    category: "ui",
    tags: ["Bootstrap Grid", "Carrito"],
    description: "Layout responsivo y catálogo con carrito persistente en localStorage.",
    previewUrl: "Proyecto_Guiado/ecommerce.html"
  },
  {
    title: "Landing Page Bootstrap",
    folder: "proyectoBit/landing-full-bootstrap/",
    category: "ui",
    tags: ["Bootstrap 5", "Landing"],
    description: "Página promocional responsiva para la suite Procrastination Nightmare.",
    previewUrl: "proyectoBit/landing-full-bootstrap/index.html"
  },
  {
    title: "Clon Instagram Login",
    folder: "Instagram/",
    category: "ui",
    tags: ["CSS3", "Positioning", "Responsive"],
    description: "Réplica de pantalla de acceso de Instagram con formulario interactivo.",
    previewUrl: "Instagram/index.html"
  },
  {
    title: "Clon Microsoft Account Login",
    folder: "Microsoft_Login/",
    category: "ui",
    tags: ["Bootstrap 5", "Formularios"],
    description: "Tarjeta responsiva de inicio de sesión estilo Microsoft con validación.",
    previewUrl: "Microsoft_Login/index.html"
  },
  {
    title: "Modal de Autenticación Bootstrap",
    folder: "Login/",
    category: "ui",
    tags: ["Modal", "localStorage"],
    description: "Ventana modal de login con alertas de error y persistencia de sesión.",
    previewUrl: "Login/index.html"
  },
  {
    title: "Clon Spotify Premium",
    folder: "Spotify/",
    category: "ui",
    tags: ["CSS3", "Cards"],
    description: "Landing page promocional con grilla de beneficios y tarjetas de planes.",
    previewUrl: "Spotify/index.html"
  },
  {
    title: "Clon Snapchat Web",
    folder: "Snapchat/",
    category: "ui",
    tags: ["CSS3", "Navbar"],
    description: "Página promocional con barra superior fija y secciones temáticas.",
    previewUrl: "Snapchat/index.html"
  },

  // Fundamentos
  {
    title: "Diagramación Semántica Flexbox",
    folder: "html5_exercise/flexbox/",
    category: "html",
    tags: ["HTML5", "Flexbox"],
    description: "Distribución de header, nav, section, article, aside y footer con Flexbox.",
    previewUrl: "html5_exercise/flexbox/index.html"
  },
  {
    title: "Responsive Design & Media Queries",
    folder: "Media_querys/",
    category: "html",
    tags: ["CSS3", "Media Queries"],
    description: "Simulador interactivo de breakpoints (Móvil, Tablet y Desktop).",
    previewUrl: "Media_querys/index.html"
  },
  {
    title: "Tablas y Formularios HTML/CSS",
    folder: "Html-Css-Basic/",
    category: "html",
    tags: ["Tablas", "DOM", "localStorage"],
    description: "Tabla dinámica con inserción segura y persistencia en localStorage.",
    previewUrl: "Html-Css-Basic/index.html"
  },
  {
    title: "Fundamentos HTML5",
    folder: "Html-Basic/",
    category: "html",
    tags: ["HTML5", "Formularios"],
    description: "Controles nativos de formulario, listas y estructura semántica.",
    previewUrl: "Html-Basic/index.html"
  }
];

let activeCategory = "all";
let searchQuery = "";

const grid = document.getElementById("projectsGrid");
const countBadge = document.getElementById("projectCountBadge");
const searchInput = document.getElementById("searchInput");

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function renderProjects() {
  const filtered = COURSE_MODULES.filter((mod) => {
    const matchCat = activeCategory === "all" || mod.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      mod.title.toLowerCase().includes(q) ||
      mod.description.toLowerCase().includes(q) ||
      mod.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  countBadge.textContent = `${filtered.length} de ${COURSE_MODULES.length} módulos`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-secondary py-5">No se encontraron módulos con ese filtro.</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((mod, idx) => {
      const globalIndex = COURSE_MODULES.indexOf(mod);
      const tagsHtml = mod.tags
        .map((t) => `<span class="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25">${escapeHtml(t)}</span>`)
        .join("");

      const actionBtn = mod.previewUrl
        ? `<button type="button" class="btn btn-info btn-sm fw-semibold text-dark preview-btn" data-index="${globalIndex}">▶ Vista Previa</button>`
        : `<button type="button" class="btn btn-outline-success btn-sm fw-semibold info-btn" data-index="${globalIndex}">⚡ Cómo Ejecutar</button>`;

      return `
        <div class="col-md-6 col-lg-4">
          <div class="project-card d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-dark border border-secondary text-info">${escapeHtml(mod.folder)}</span>
            </div>
            <h5 class="fw-bold mb-2">${escapeHtml(mod.title)}</h5>
            <p class="text-secondary small flex-grow-1">${escapeHtml(mod.description)}</p>
            <div class="d-flex flex-wrap gap-1 mb-3">${tagsHtml}</div>
            <div class="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
              ${actionBtn}
              ${mod.previewUrl ? `<a href="${encodeURI(mod.previewUrl)}" target="_blank" class="btn btn-link btn-sm text-secondary text-decoration-none">Abrir ↗</a>` : `<span class="small text-secondary">CLI / Server</span>`}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

grid.addEventListener("click", (e) => {
  const previewBtn = e.target.closest(".preview-btn");
  const infoBtn = e.target.closest(".info-btn");

  // Abre la vista previa en iframe modal o el modal de comandos CLI según el botón pulsado
  if (previewBtn) {
    const mod = COURSE_MODULES[Number(previewBtn.dataset.index)];
    if (!mod || !mod.previewUrl) return;
    document.getElementById("previewModalTitle").textContent = mod.title;
    document.getElementById("previewFrame").src = mod.previewUrl;
    document.getElementById("previewOpenNewTab").href = mod.previewUrl;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("previewModal")).show();
  } else if (infoBtn) {
    const mod = COURSE_MODULES[Number(infoBtn.dataset.index)];
    if (!mod) return;
    document.getElementById("infoModalTitle").textContent = mod.title;
    document.getElementById("infoModalDesc").textContent = mod.description;
    document.getElementById("infoModalCmd").textContent = mod.runCmd || `Carpeta: ${mod.folder}`;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("infoModal")).show();
  }
});

// Filtro por categoría de módulo
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderProjects();
  });
});

// Búsqueda en vivo por título, carpeta, descripción o etiquetas
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderProjects();
});

// Actualiza contadores globales y renderiza la grilla inicial
document.getElementById("totalModulesStat").textContent = String(COURSE_MODULES.length);
document.getElementById("liveDemosStat").textContent = String(COURSE_MODULES.filter((m) => m.previewUrl).length);
renderProjects();
