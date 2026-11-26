/**
 * ============================================================================
 * RETO HACKATHON: PARSER DE QUERY PARAMS EN URL (hackathon/script.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * - Extraer parámetros QueryString manualmente (`indexOf`, `slice`, `split`)
 *   y compararlos con la API estándar `URL` / `URLSearchParams`.
 * - Desglosar la anatomía de la URL (`protocol`, `host`, `pathname`, `hash`).
 * - Renderizar la tabla clave/valor de forma segura (`textContent`) y permitir
 *   añadir parámetros codificados automáticamente.
 */

/** Parsea manualmente los parámetros después de `?` sin usar `URLSearchParams`. */
function parseManualQuery(customLink) {
  const link = customLink || "https://urldelapagina.com?nombre=Miguel&edad=125";
  const qIndex = link.indexOf("?");
  if (qIndex === -1) return {}; // Si no hay '?', no existen query params

  // Extrae desde '?' hasta antes de cualquier fragmento '#'
  const queryStr = link.slice(qIndex + 1).split("#")[0];
  const result = {};

  for (const pair of queryStr.split("&")) {
    if (!pair) continue;
    const eqIdx = pair.indexOf("=");
    if (eqIdx === -1) {
      result[decodeURIComponent(pair)] = "";
    } else {
      const key = decodeURIComponent(pair.slice(0, eqIdx));
      // En QueryStrings clásicos el '+' representa un espacio en blanco
      const val = decodeURIComponent(pair.slice(eqIdx + 1).replace(/\+/g, " "));
      result[key] = val;
    }
  }
  return result;
}

/** Parsea los parámetros y la anatomía de URL usando la API nativa `URL` y `URLSearchParams`. */
function parseWithURLSearchParams(customLink) {
  const raw = customLink || "https://urldelapagina.com?nombre=Miguel&edad=125";
  try {
    const parsed = new URL(raw);
    return {
      anatomy: {
        protocol: parsed.protocol,
        host: parsed.host,
        pathname: parsed.pathname,
        hash: parsed.hash || "(sin hash)"
      },
      params: Object.fromEntries(parsed.searchParams.entries())
    };
  } catch {
    // Respaldo si el usuario escribe una ruta relativa sin protocolo http(s)://
    const qIndex = raw.indexOf("?");
    const qs = qIndex !== -1 ? raw.slice(qIndex + 1).split("#")[0] : raw;
    return {
      anatomy: { protocol: "(relativa)", host: "-", pathname: raw.split("?")[0], hash: "-" },
      params: Object.fromEntries(new URLSearchParams(qs).entries())
    };
  }
}

/** Dibuja de forma segura (sin XSS) las filas clave/valor en `#paramsTableBody`. */
function renderParamsTable(paramsObj) {
  const tbody = document.getElementById("paramsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const entries = Object.entries(paramsObj);
  if (entries.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.className = "text-center text-secondary py-3";
    td.textContent = "Esta URL no contiene parámetros (?clave=valor).";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  const frag = document.createDocumentFragment();
  entries.forEach(([k, v]) => {
    const tr = document.createElement("tr");
    const tdKey = document.createElement("td");
    const tdVal = document.createElement("td");
    tdKey.className = "text-info fw-semibold";
    tdKey.textContent = k;
    tdVal.textContent = v;
    tr.appendChild(tdKey);
    tr.appendChild(tdVal);
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

/** Renderiza la anatomía de la URL (`protocol`, `host`, `pathname`, `hash`). */
function renderAnatomy(anatomy) {
  const box = document.getElementById("urlAnatomy");
  if (!box) return;
  box.innerHTML = "";

  Object.entries(anatomy).forEach(([k, v]) => {
    const row = document.createElement("div");
    row.className = "d-flex justify-content-between border-bottom border-secondary py-1";
    const label = document.createElement("span");
    label.textContent = k;
    const val = document.createElement("code");
    val.className = "text-info";
    val.textContent = v;
    row.appendChild(label);
    row.appendChild(val);
    box.appendChild(row);
  });
}

/** Procesa la URL actual actualizando anatomía, tabla y comparativa JSON. */
function procesarUrl() {
  const inputEl = document.getElementById("urlInput");
  const outputEl = document.getElementById("output");
  if (!inputEl || !outputEl) return;

  const rawUrl = inputEl.value.trim();
  const manual = parseManualQuery(rawUrl);
  const { anatomy, params } = parseWithURLSearchParams(rawUrl);

  renderAnatomy(anatomy);
  renderParamsTable(params);

  outputEl.textContent = JSON.stringify(
    {
      metodo_manual: manual,
      URLSearchParams: params,
      valores: Object.values(params)
    },
    null,
    2
  );
}

// Eventos al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("urlInput");
  const addParamForm = document.getElementById("addParamForm");

  if (inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        procesarUrl();
      }
    });
  }

  // Botones de URLs de ejemplo
  document.querySelectorAll(".preset-url").forEach((btn) => {
    btn.addEventListener("click", () => {
      inputEl.value = btn.dataset.url;
      procesarUrl();
    });
  });

  // Constructor rápido para agregar un nuevo parámetro usando URL.searchParams.set()
  if (addParamForm) {
    addParamForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const key = document.getElementById("newKey").value.trim();
      const val = document.getElementById("newVal").value.trim();
      if (!key) return;

      try {
        const parsed = new URL(inputEl.value.trim() || "https://urldelapagina.com");
        parsed.searchParams.set(key, val);
        inputEl.value = parsed.toString();
      } catch {
        const sep = inputEl.value.includes("?") ? "&" : "?";
        inputEl.value = `${inputEl.value}${sep}${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
      }
      addParamForm.reset();
      procesarUrl();
    });
  }

  procesarUrl();
});
