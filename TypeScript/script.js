"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ejecutarDemoTS = exports.CursoModulo = exports.envolverRespuesta = exports.crearPerfil = void 0;
// 1. TIPOS PRIMITIVOS Y ANOTACIÓN EXPLÍCITA
// `let nombre: tipo = valor` obliga a que la variable solo guarde ese tipo.
let saludo = "Hola TypeScript";
let anioCurso = 2026;
let modoEstricto = true;
// 2. ARREGLOS TIPADOS Y TUPLAS
// `string[]` solo acepta cadenas de texto en cualquier cantidad.
const stackMean = ["MongoDB", "Express", "Angular", "Node.js"];
// Una tupla define longitud fija y un tipo exacto por cada posición: [tecnología, versión]
const versionAngular = ["Angular", 16];
// 5. FUNCIONES TIPADAS (Parámetros y tipo de retorno)
/**
 * Construye un perfil `Developer` validado por el compilador de TypeScript.
 * @param id - Identificador numérico único.
 * @param name - Nombre completo del desarrollador.
 * @param role - Rol dentro del stack (por defecto `"fullstack"`).
 * @param github - Usuario opcional de GitHub.
 */
function crearPerfil(id, name, role = "fullstack", github) {
    return {
        id,
        name: name.trim(),
        role,
        stack: [...stackMean],
        active: true,
        ...(github ? { github } : {}),
    };
}
exports.crearPerfil = crearPerfil;
/**
 * Envuelve cualquier tipo de dato `T` dentro de una respuesta estándar tipo API REST.
 * @param data - Información genérica de tipo `T`.
 */
function envolverRespuesta(data) {
    return {
        ok: true,
        timestamp: new Date().toISOString(),
        data,
    };
}
exports.envolverRespuesta = envolverRespuesta;
// 7. CLASES CON MODIFICADORES DE ACCESO (`public`, `private`, `readonly`)
// Muy usadas en servicios de Angular y controladores orientados a objetos.
class CursoModulo {
    constructor(nombre, totalLecciones) {
        this.totalLecciones = totalLecciones;
        // `private` encapsula el progreso para que solo pueda modificarse mediante métodos
        this.leccionesCompletadas = 0;
        this.nombre = nombre;
    }
    /** Marca una lección como completada sin superar el total del módulo. */
    completarLeccion() {
        if (this.leccionesCompletadas < this.totalLecciones) {
            this.leccionesCompletadas++;
        }
        return this.progresoPorcentaje();
    }
    /** Calcula el porcentaje entero de avance del módulo. */
    progresoPorcentaje() {
        if (this.totalLecciones <= 0)
            return 100;
        return Math.round((this.leccionesCompletadas / this.totalLecciones) * 100);
    }
}
exports.CursoModulo = CursoModulo;
/** Ejecuta una demostración completa en consola de todos los fundamentos. */
function ejecutarDemoTS() {
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
exports.ejecutarDemoTS = ejecutarDemoTS;
// Guardia CommonJS: solo ejecuta la demo si se corre directamente (`node script.js`)
if (require.main === module) {
    ejecutarDemoTS();
}
