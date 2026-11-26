/**
 * ============================================================================
 * RESALTADO AUTOMÁTICO DE SECCIÓN ACTIVA (proyectoBit/js/nav-active.js)
 * ============================================================================
 * Propósito: Detectar la página actual (`window.location.pathname`) e iluminar
 * el enlace correspondiente en la barra lateral de navegación.
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".lateral-navbar .link-lateral-navbar").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("/").pop();
    if (href === currentFile) {
      link.classList.add("active-nav");
    }
  });
});
