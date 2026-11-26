/**
 * ============================================================================
 * FUNDAMENTOS DE TYPESCRIPT: GUÍA PRÁCTICA COMENTADA (TypeScript/script.ts)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Recorrer los pilares del lenguaje TypeScript antes de pasar a Express/Angular:
 * 1. Tipos primitivos (`string`, `number`, `boolean`) e inferencia de tipos.
 * 2. Arreglos tipados (`string[]`) y Tuplas (`[string, number]`).
 * 3. Union Types (`"frontend" | "backend" | "fullstack"`) e Interfaces (`interface`).
 * 4. Propiedades opcionales (`?`) y de solo lectura (`readonly`).
 * 5. Funciones tipadas, Genéricos (`<T>`) y Clases (`public` / `private`).
 */

// 1. TIPOS PRIMITIVOS Y ANOTACIÓN EXPLÍCITA
// `let nombre: tipo = valor` obliga a que la variable solo guarde ese tipo.
let saludo: string = "Hola TypeScript";
let anioCurso: number = 2026;
let modoEstricto: boolean = true;

// 2. ARREGLOS TIPADOS Y TUPLAS
// `string[]` solo acepta cadenas de texto en cualquier cantidad.
const stackMean: string[] = ["MongoDB", "Express", "Angular", "Node.js"];

// Una tupla define longitud fija y un tipo exacto por cada posición: [tecnología, versión]
const versionAngular: [string, number] = ["Angular", 16];

// 3. UNION TYPES (Valores permitidos explícitos)
// Limita una variable a un conjunto cerrado de opciones válidas en tiempo de compilación.
export type RolDesarrollador = "frontend" | "backend" | "fullstack";

// 4. INTERFACES (Contratos de forma para objetos)
// Definen qué propiedades debe tener un objeto, cuáles son `readonly` y cuáles opcionales (`?`).
export interface Developer {
  readonly id: number;        // No puede reasignarse después de crearse
  name: string;               // Obligatorio
  role: RolDesarrollador;     // Solo acepta "frontend" | "backend" | "fullstack"
  stack: string[];            // Arreglo de strings
  active: boolean;            // Estado activo
  github?: string;            // Propiedad opcional (`?`): puede venir o no
}

// 5. FUNCIONES TIPADAS (Parámetros y tipo de retorno)
/**
 * Construye un perfil `Developer` validado por el compilador de TypeScript.
 * @param id - Identificador numérico único.
 * @param name - Nombre completo del desarrollador.
 * @param role - Rol dentro del stack (por defecto `"fullstack"`).
 * @param github - Usuario opcional de GitHub.
 */
export function crearPerfil(
  id: number,
  name: string,
  role: RolDesarrollador = "fullstack",
  github?: string
): Developer {
  return {
    id,
    name: name.trim(),
    role,
    stack: [...stackMean],
    active: true,
    ...(github ? { github } : {}),
  };
}

// 6. GENÉRICOS (`<T>`)
// Permiten escribir funciones reutilizables que conservan el tipo exacto de entrada en la salida.
export interface ApiResponse<T> {
  ok: boolean;
  timestamp: string;
  data: T;
}

/**
 * Envuelve cualquier tipo de dato `T` dentro de una respuesta estándar tipo API REST.
 * @param data - Información genérica de tipo `T`.
 */
export function envolverRespuesta<T>(data: T): ApiResponse<T> {
  return {
    ok: true,
    timestamp: new Date().toISOString(),
    data,
  };
}

// 7. CLASES CON MODIFICADORES DE ACCESO (`public`, `private`, `readonly`)
// Muy usadas en servicios de Angular y controladores orientados a objetos.
export class CursoModulo {
  // `readonly` permite leer desde fuera, pero no sobrescribir
  public readonly nombre: string;
  // `private` encapsula el progreso para que solo pueda modificarse mediante métodos
  private leccionesCompletadas: number = 0;

  constructor(nombre: string, private readonly totalLecciones: number) {
    this.nombre = nombre;
  }

  /** Marca una lección como completada sin superar el total del módulo. */
  public completarLeccion(): number {
    if (this.leccionesCompletadas < this.totalLecciones) {
      this.leccionesCompletadas++;
    }
    return this.progresoPorcentaje();
  }

  /** Calcula el porcentaje entero de avance del módulo. */
  public progresoPorcentaje(): number {
    if (this.totalLecciones <= 0) return 100;
    return Math.round((this.leccionesCompletadas / this.totalLecciones) * 100);
  }
}

/** Ejecuta una demostración completa en consola de todos los fundamentos. */
export function ejecutarDemoTS(): Developer {
  const dev = crearPerfil(1, "Fredy Martinez", "fullstack", "@fredy-mean");
  const moduloTS = new CursoModulo("Fundamentos TypeScript", 4);
  moduloTS.completarLeccion();
  moduloTS.completarLeccion();

  console.log(`${saludo} (${anioCurso}, strict=${modoEstricto})`);
  console.log(`Tupla principal: ${versionAngular[0]} v${versionAngular[1]}`);
  console.log(`Desarrollador: ${dev.name} [${dev.role}] -> ${dev.stack.join(", ")}`);
  console.log(`Avance en "${moduloTS.nombre}": ${moduloTS.progresoPorcentaje()}%`);
  console.log("Respuesta genérica ApiResponse<Developer>:", envolverRespuesta(dev));

  return dev;
}

// Declaración mínima de tipos de Node.js para usar `require.main === module` sin `@types/node`
declare const require: { main?: unknown };
declare const module: unknown;

// Guardia CommonJS: solo ejecuta la demo si se corre directamente (`node script.js`)
if (require.main === module) {
  ejecutarDemoTS();
}
