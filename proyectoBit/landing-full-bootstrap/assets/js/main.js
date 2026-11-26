/**
 * ============================================================================
 * ARCHIVO: main.js (proyectoBit/landing-full-bootstrap)
 * DESCRIPCIÓN: Inicialización de galería (GLightbox), carrusel (Swiper),
 *              menú móvil responsivo y botón volver arriba (`.back-to-top`).
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializa GLightbox si la librería CDN cargó correctamente
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.portfolio-lightbox' });
  }

  // 2. Inicializa el carrusel de testimonios/módulos con Swiper
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  }

  // 3. Menú móvil responsivo: alterna `.navbar-mobile` y el ícono hamburguesa/X
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.getElementById('navbar');
  if (mobileToggle && navbar) {
    mobileToggle.addEventListener('click', () => {
      navbar.classList.toggle('navbar-mobile');
      mobileToggle.classList.toggle('bi-list');
      mobileToggle.classList.toggle('bi-x');
    });

    // Cierra automáticamente el menú móvil al hacer clic en un enlace de sección
    navbar.querySelectorAll('a.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile');
          mobileToggle.classList.add('bi-list');
          mobileToggle.classList.remove('bi-x');
        }
      });
    });
  }

  // 4. Botón flotante "volver arriba": se muestra al bajar más de 120px
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('active', window.scrollY > 120);
    };
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();
  }
});
