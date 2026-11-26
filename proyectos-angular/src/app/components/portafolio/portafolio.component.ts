/**
 * ============================================================================
 * COMPONENTE PORTAFOLIO (Portafolio/src/app/components/portafolio/portafolio.component.ts)
 * ============================================================================
 * Propósito: Mostrar una vitrina interactiva de proyectos del curso MEAN Stack
 * con filtro por categoría (`Todos`, `Full-Stack`, `Backend`, `Angular`) y
 * búsqueda en vivo por título o tecnología.
 */

import { Component } from '@angular/core';

/** Contrato tipado para cada tarjeta de proyecto en el portafolio. */
export interface ProyectoItem {
  titulo: string;
  categoria: 'Full-Stack' | 'Backend' | 'Angular';
  tecnologias: string[];
  descripcion: string;
  comando: string;
}

@Component({
  selector: 'app-portafolio',
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.css']
})
export class PortafolioComponent {
  // Categoría activa seleccionada en los botones de filtro
  categoriaActiva: string = 'Todos';
  // Texto escrito en el buscador en tiempo real
  busqueda: string = '';

  // Lista de categorías disponibles para filtrar
  readonly categorias: string[] = ['Todos', 'Full-Stack', 'Backend', 'Angular'];

  // Catálogo tipado de proyectos destacados del curso
  readonly proyectos: ProyectoItem[] = [
    {
      titulo: 'Turismo MEAN (Full-Stack)',
      categoria: 'Full-Stack',
      tecnologias: ['Angular 16', 'Express', 'MongoDB/JSON'],
      descripcion: 'Plataforma de destinos turísticos con API CRUD en puerto 4000 y cliente Angular con respaldo offline.',
      comando: 'cd Turismo_MEAN/TurismoBack && npm run dev'
    },
    {
      titulo: 'BitShop_API (REST + JWT)',
      categoria: 'Backend',
      tecnologias: ['Node.js', 'Express', 'JWT', 'scrypt'],
      descripcion: 'API E-Commerce con autenticación JWT, hashing scrypt, control de roles y panel visual Login-first.',
      comando: 'cd BitShop_API && npm run dev'
    },
    {
      titulo: 'ts_api (TypeScript + Express)',
      categoria: 'Backend',
      tecnologias: ['TypeScript', 'Express', 'nodemon'],
      descripcion: 'Servidor Express modular en TypeScript estricto con panel interactivo Login-first y pruebas unitarias.',
      comando: 'cd ts_api && npm run dev'
    },
    {
      titulo: 'Procrastination Nightmare SPA',
      categoria: 'Angular',
      tecnologias: ['Angular 16', 'Bootstrap 5', 'localStorage'],
      descripcion: 'Suite de productividad en Angular con Pomodoro, To-Do, Notas, Calendario, Hábitos y Roadmap.',
      comando: 'cd procrastination-nightmare && npm run dev'
    },
    {
      titulo: 'MongoDB & Simpsons Explorers',
      categoria: 'Backend',
      tecnologias: ['Node.js', 'NoSQL', 'Playground Web'],
      descripcion: 'Simulador CRUD DBZ-V2 y explorador de 50 personajes de Los Simpsons con filtros e imágenes.',
      comando: 'cd simpsons-db && npm run dev'
    },
    {
      titulo: 'Ejercicio Multirruta Angular',
      categoria: 'Angular',
      tecnologias: ['Angular', 'FormsModule', 'Routing'],
      descripcion: 'Aplicación SPA con verificador de edad, calculadora con historial y detector de números primos.',
      comando: 'cd Ejercicio_Angular && npm run dev'
    }
  ];

  /** Devuelve los proyectos filtrados por categoría activa y texto de búsqueda. */
  get proyectosFiltrados(): ProyectoItem[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.proyectos.filter((p) => {
      const matchCat = this.categoriaActiva === 'Todos' || p.categoria === this.categoriaActiva;
      const matchText =
        !q ||
        p.titulo.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.tecnologias.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }

  /** Cambia la categoría activa para actualizar la grilla filtrada. */
  seleccionarCategoria(cat: string): void {
    this.categoriaActiva = cat;
  }

  /** Actualiza el término de búsqueda desde el evento `input`. */
  actualizarBusqueda(valor: string): void {
    this.busqueda = valor;
  }
}
