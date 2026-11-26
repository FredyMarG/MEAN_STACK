/**
 * ============================================================================
 * ARCHIVO: script.js (Tienda_Online/script.js)
 * DESCRIPCIÓN: Motor interactivo de catálogo, filtrado por categorías del
 *              Mega-Menu, buscador en tiempo real y carrito de compras.
 * ============================================================================
 */

// Catálogo estático de productos disponibles en la tienda
const PRODUCTS = [
  {
    id: 1,                                                // Identificador único
    name: "Laptop Pro Dev 16\" (32GB RAM / 1TB SSD)",     // Nombre comercial
    category: "promociones",                              // Categoría para filtros
    price: 4850000,                                       // Precio actual en COP
    oldPrice: 5600000,                                    // Precio anterior tachado
    icon: "laptop_mac",                                   // Ícono Material Symbols
    badge: "Oferta -15%"                                  // Etiqueta superior
  },
  {
    id: 2,
    name: "Monitor UltraWide 34\" IPS 144Hz",
    category: "promociones",
    price: 1690000,
    oldPrice: 2100000,
    icon: "desktop_windows",
    badge: "Oferta -20%"
  },
  {
    id: 3,
    name: "Teclado Mecánico RGB Hot-Swap",
    category: "accesorios",
    price: 340000,
    oldPrice: null,                                       // Sin precio anterior
    icon: "keyboard",
    badge: "Más Vendido"
  },
  {
    id: 4,
    name: "Audífonos Noise Cancelling Studio",
    category: "accesorios",
    price: 520000,
    oldPrice: 650000,
    icon: "headphones",
    badge: "Promoción"
  },
  {
    id: 5,
    name: "Mouse Ergonómico Inalámbrico Pro",
    category: "accesorios",
    price: 260000,
    oldPrice: null,
    icon: "mouse",
    badge: "Nuevo"
  },
  {
    id: 6,
    name: "Servidor Mini PC HomeLab (Ryzen 7)",
    category: "promociones",
    price: 2450000,
    oldPrice: 2890000,
    icon: "dns",
    badge: "Oferta -15%"
  }
];

// Clave de almacenamiento en localStorage para conservar el carrito
const CART_STORAGE_KEY = "tienda_online_cart_v1";
let cart = [];

// Recupera el carrito guardado evitando fallos si el JSON está corrupto
try {
  const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  if (Array.isArray(savedCart)) cart = savedCart;
} catch {}

/** Guarda el estado actual del carrito en `localStorage`. */
function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Estado actual de filtros en el catálogo
let activeFilter = "all";
let searchQuery = "";

// Referencias a elementos clave del DOM
const grid = document.getElementById("productsGrid");
const resultsCount = document.getElementById("resultsCount");
const cartCountBadge = document.getElementById("cartCountBadge");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalValue = document.getElementById("cartTotalValue");
const aboutBanner = document.getElementById("aboutBanner");
const sectionTitle = document.getElementById("sectionTitle");

/** Formatea un número como moneda colombiana (COP). */
function formatCOP(val) {
  return "$" + val.toLocaleString("es-CO") + " COP";
}

/** Filtra los productos según categoría y texto, y los dibuja en pantalla. */
function renderCatalog() {
  // Muestra u oculta el banner institucional si se eligió "nosotros"
  if (activeFilter === "nosotros") {
    aboutBanner.classList.remove("d-none");
    sectionTitle.textContent = "Nuestra Identidad & Equipos Destacados";
  } else {
    aboutBanner.classList.add("d-none");
    sectionTitle.textContent =
      activeFilter === "promociones"
        ? "🔥 Promociones Especiales"
        : activeFilter === "accesorios"
        ? "🎧 Periféricos & Soporte"
        : "Catálogo Completo de Tecnología";
  }

  // Aplica filtro combinado de categoría y búsqueda por nombre
  const filtered = PRODUCTS.filter((p) => {
    const matchCategory =
      activeFilter === "all" || activeFilter === "nosotros" || p.category === activeFilter;
    const matchSearch =
      !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Actualiza el contador visible de resultados
  resultsCount.textContent = `${filtered.length} productos disponibles`;

  // Construye las tarjetas HTML del catálogo
  grid.innerHTML = filtered
    .map(
      (p) => `
      <div class="col-md-6 col-lg-4">
        <div class="card product-card shadow-sm h-100">
          <div class="product-icon-box position-relative">
            <span class="badge bg-primary position-absolute top-0 start-0 m-3">${p.badge}</span>
            <span class="material-symbols-outlined">${p.icon}</span>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">${p.name}</h5>
            <div class="mt-auto pt-3">
              ${
                p.oldPrice
                  ? `<small class="text-muted text-decoration-line-through d-block">${formatCOP(p.oldPrice)}</small>`
                  : ""
              }
              <div class="d-flex justify-content-between align-items-center mt-1">
                <span class="fs-5 fw-bold text-success">${formatCOP(p.price)}</span>
                <button class="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center gap-1" onclick="addToCart(${p.id})">
                  <span class="material-symbols-outlined fs-6">add_shopping_cart</span>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

/** Agrega un producto al carrito o incrementa su cantidad si ya existe. */
window.addToCart = function (productId) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }
  saveCart();
  renderCart();
};

/** Suma o resta unidades de un ítem del carrito; si llega a 0 lo elimina. */
window.updateCartQty = function (productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }
  saveCart();
  renderCart();
};

/** Elimina por completo un producto del carrito según su ID. */
window.removeFromCart = function (productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
};

/** Renderiza el panel lateral del carrito con cantidades y total acumulado. */
function renderCart() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  cartCountBadge.textContent = totalItems;
  cartTotalValue.textContent = formatCOP(totalPrice);

  // Estado vacío del carrito
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center text-muted py-5">
        <span class="material-symbols-outlined fs-1 d-block mb-2">production_quantity_limits</span>
        Tu carrito está vacío.
      </div>
    `;
    return;
  }

  // Lista de productos agregados con botones de control
  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <div class="fw-semibold small">${item.name}</div>
          <div class="text-muted small">${item.qty} x ${formatCOP(item.price)}</div>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span class="px-1 small fw-bold">${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQty(${item.id}, 1)">+</button>
          <button class="btn btn-sm btn-outline-danger ms-1" onclick="removeFromCart(${item.id})">&times;</button>
        </div>
      </div>
    `
    )
    .join("");
}

// Eventos de clic en las tarjetas de categoría del Mega-Menú
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category-card").forEach((c) => c.classList.remove("active-cat"));
    card.classList.add("active-cat");
    activeFilter = card.getAttribute("data-filter");
    renderCatalog();
  });
});

// Evento de búsqueda en vivo al escribir
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderCatalog();
  });
}

// Evento de confirmación de compra (vacía el carrito y muestra resumen)
const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<div class="alert alert-warning py-2 small">Agrega al menos un producto al carrito antes de finalizar.</div>`;
      return;
    }
    const totalPaid = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    cart = [];
    saveCart();
    renderCart();
    cartItemsContainer.innerHTML = `<div class="alert alert-success py-3 text-center"><strong>¡Pedido confirmado!</strong><br>Total: ${formatCOP(totalPaid)}</div>`;
  });
}

// Renderizado inicial al abrir la tienda
renderCatalog();
renderCart();
