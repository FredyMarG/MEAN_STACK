/**
 * ============================================================================
 * ARCHIVO: main.js (proyectoBit/landing-full-bootstrap)
 * DESCRIPCIÓN: Inicialización del carrusel de testimonios (Swiper) y visor
 *              de galería (GLightbox).
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.portfolio-lightbox' });
  }

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
});
