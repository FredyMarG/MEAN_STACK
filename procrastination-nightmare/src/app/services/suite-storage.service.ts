/**
 * ============================================================================
 * SERVICIO DE PERSISTENCIA LOCAL (src/app/services/suite-storage.service.ts)
 * ============================================================================
 * Propósito: Centralizar la lectura, escritura y respaldo JSON en `localStorage`
 * para todos los módulos de Procrastination Nightmare (Pomodoro, Tareas,
 * Notas, Calendario, Hábitos y Roadmap).
 */

import { Injectable } from '@angular/core';

export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

export interface NoteItem {
  id: number;
  title: string;
  body: string;
  color: string;
  pinned: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  day: string;
  timeLabel: string;
  colorClass: string;
  description: string;
  subtasks: { text: string; done: boolean }[];
}

export interface HabitItem {
  id: number;
  name: string;
  meta: string;
  days: boolean[];
}

export type RoadmapState =
  | 'Completado'
  | 'En Progreso'
  | 'Con Demora'
  | 'Aplazado'
  | 'Cancelado'
  | 'No Iniciado';

export interface RoadmapTask {
  id: number;
  name: string;
  state: RoadmapState;
  typeOfTask: string;
  startDate: string;
  endDate: string;
  inChargeOf: string;
}

const KEYS = {
  pomodoros: 'pn_ng_pomodoros_v1',
  todos: 'pn_ng_todos_v1',
  notes: 'pn_ng_notes_v1',
  events: 'pn_ng_events_v1',
  habits: 'pn_ng_habits_v1',
  roadmap: 'pn_ng_roadmap_v1',
  roadmapTitle: 'pn_ng_roadmap_title_v1'
};

@Injectable({ providedIn: 'root' })
export class SuiteStorageService {
  /** Lee y parsea de forma segura cualquier clave de `localStorage`. */
  private readJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private writeJson(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Pomodoros ---
  getPomodoros(): number {
    return Number(localStorage.getItem(KEYS.pomodoros) || 0);
  }
  incrementPomodoros(): number {
    const next = this.getPomodoros() + 1;
    localStorage.setItem(KEYS.pomodoros, String(next));
    return next;
  }

  // --- Lista de Tareas ---
  getTodos(): TodoItem[] {
    return this.readJson<TodoItem[]>(KEYS.todos, [
      { id: 1, text: 'Revisar arquitectura MEAN Stack', done: true },
      { id: 2, text: 'Completar sesión Pomodoro de 25 min', done: false }
    ]);
  }
  saveTodos(list: TodoItem[]): void {
    this.writeJson(KEYS.todos, list);
  }

  // --- Notas Rápidas ---
  getNotes(): NoteItem[] {
    return this.readJson<NoteItem[]>(KEYS.notes, [
      {
        id: 1,
        title: 'Ideas Sprint Angular',
        body: 'Conectar módulos en una SPA con barra lateral Flaticon y respaldo JSON.',
        color: 'border-info',
        pinned: true,
        createdAt: new Date().toLocaleDateString('es-CO')
      }
    ]);
  }
  saveNotes(list: NoteItem[]): void {
    this.writeJson(KEYS.notes, list);
  }

  // --- Calendario de Eventos ---
  getEvents(): CalendarEvent[] {
    return this.readJson<CalendarEvent[]>(KEYS.events, [
      {
        id: 1,
        title: 'Nuevo excel',
        day: '04',
        timeLabel: '04 Mar - 09 : 00 AM',
        colorClass: 'bg-primary',
        description: 'Gráfico de barras con datos de ventas',
        subtasks: [
          { text: 'Abrir archivo de ventas', done: true },
          { text: 'Insertar gráfico de barras', done: false },
          { text: 'Compartir con el equipo', done: false }
        ]
      },
      {
        id: 2,
        title: 'Reunión Sprint',
        day: '12',
        timeLabel: '12 Mar - 10 : 30 AM',
        colorClass: 'bg-info text-dark',
        description: 'Revisión de avance del proyecto MEAN',
        subtasks: [
          { text: 'Definir agenda del sprint', done: true },
          { text: 'Asignar entregables', done: false }
        ]
      }
    ]);
  }
  saveEvents(list: CalendarEvent[]): void {
    this.writeJson(KEYS.events, list);
  }

  // --- Hábitos Semanales ---
  getHabits(): HabitItem[] {
    return this.readJson<HabitItem[]>(KEYS.habits, [
      { id: 1, name: 'Leer 20 min', meta: 'Al menos 20 min al día', days: [true, true, false, true, false, false, false] },
      { id: 2, name: 'Código Angular', meta: 'Al menos 1 hora al día', days: [true, true, true, true, false, false, false] },
      { id: 3, name: 'Hidratación', meta: '8 vasos diarios', days: [true, false, true, true, true, false, false] }
    ]);
  }
  saveHabits(list: HabitItem[]): void {
    this.writeJson(KEYS.habits, list);
  }

  // --- Roadmap de Tareas ---
  getRoadmapTitle(): string {
    return localStorage.getItem(KEYS.roadmapTitle) || 'Roadmap de Proyecto';
  }
  saveRoadmapTitle(title: string): void {
    localStorage.setItem(KEYS.roadmapTitle, title);
  }
  getRoadmap(): RoadmapTask[] {
    return this.readJson<RoadmapTask[]>(KEYS.roadmap, [
      { id: 1, name: 'Diseño UI/UX', state: 'Completado', typeOfTask: 'Diseño', startDate: '10-Mar-2023', endDate: '18-Mar-2023', inChargeOf: 'Carlos' },
      { id: 2, name: 'API REST Express', state: 'En Progreso', typeOfTask: 'Backend', startDate: '20-Mar-2023', endDate: '27-Mar-2023', inChargeOf: 'Karen' },
      { id: 3, name: 'Integración Angular', state: 'Con Demora', typeOfTask: 'Frontend', startDate: '22-Mar-2023', endDate: '01-Abr-2023', inChargeOf: 'Fredy' },
      { id: 4, name: 'Preparación del servidor', state: 'Aplazado', typeOfTask: 'Redes', startDate: '30-Mar-2023', endDate: '15-Abr-2023', inChargeOf: 'Mario' }
    ]);
  }
  saveRoadmap(list: RoadmapTask[]): void {
    this.writeJson(KEYS.roadmap, list);
  }

  /** Exporta todas las claves de la suite como objeto serializable. */
  exportBackup(): string {
    const data: Record<string, string> = {};
    Object.values(KEYS).forEach((k) => {
      const val = localStorage.getItem(k);
      if (val !== null) data[k] = val;
    });
    return JSON.stringify({ app: 'Procrastination Nightmare Angular', exportedAt: new Date().toISOString(), data }, null, 2);
  }

  /** Restaura claves válidas desde un respaldo JSON importado. */
  importBackup(rawJson: string): number {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed.data !== 'object') {
      throw new Error('Formato de respaldo JSON inválido.');
    }
    let count = 0;
    Object.values(KEYS).forEach((k) => {
      if (typeof parsed.data[k] === 'string') {
        localStorage.setItem(k, parsed.data[k]);
        count++;
      }
    });
    return count;
  }
}
