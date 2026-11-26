/**
 * ============================================================================
 * SERVIDOR WEB INTERACTIVO — PRIMERA SESIÓN NODE (Primera-sesion-node/server.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Exponer las 8 funciones algorítmicas de `hello-world.js` a través de una
 * pequeña API HTTP nativa de Node.js (`http`) para que el estudiante pueda
 * probarlas desde el navegador en `http://localhost:3005`.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const ejercicios = require("./hello-world");

const INDEX_HTML = path.join(__dirname, "index.html");

/** Lee y parsea el cuerpo JSON de la petición HTTP entrante. */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e5) reject(new Error("Payload demasiado grande"));
    });
    req.on("end", () => {
      if (!raw.trim()) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error("JSON inválido")); }
    });
    req.on("error", reject);
  });
}

/** Envía una respuesta JSON estándar con cabeceras CORS básicas. */
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

/**
 * Ejecuta una de las 8 funciones de `hello-world.js` capturando además lo que
 * imprime por consola (`console.log`) para mostrarlo en la interfaz web.
 * @param {string} fnName
 * @param {number|boolean} param
 */
function executeExercise(fnName, param) {
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => logs.push(args.join(" "));

  try {
    let result;
    const num = Number(param);
    switch (fnName) {
      case "evaluarSigno": result = ejercicios.evaluarSigno(num); break;
      case "evaluarParidad": result = ejercicios.evaluarParidad(num); break;
      case "multiplosXD": result = ejercicios.multiplosXD(num); break;
      case "dibujarCuadrado": result = ejercicios.dibujarCuadrado(Math.min(20, Math.max(1, num || 5))); break;
      case "tablaDelCinco": result = ejercicios.tablaDelCinco(); break;
      case "relojDigital": result = ejercicios.relojDigital(param !== false); break;
      case "serieCien": result = ejercicios.serieCien(); break;
      case "primosHasta": result = ejercicios.primosHasta(Math.min(2000, Math.max(2, num || 100))); break;
      default: return { ok: false, error: `Función no soportada: ${fnName}` };
    }
    return { ok: true, fn: fnName, result, consoleOutput: logs.join("\n") };
  } finally {
    // Restaura siempre console.log original aunque ocurra un error
    console.log = originalLog;
  }
}

/**
 * Inicia el servidor HTTP en `basePort` (3005 por defecto) con respaldo automático.
 */
function startNodeLabServer(basePort = Number(process.env.PORT) || 3005) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    // Sirve la vista interactiva en `/`
    if (req.method === "GET" && url.pathname === "/") {
      const html = fs.readFileSync(INDEX_HTML, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    // Ejecuta un ejercicio en el servidor Node.js
    if (req.method === "POST" && url.pathname === "/api/run") {
      try {
        const body = await readJsonBody(req);
        const output = executeExercise(String(body.fn || ""), body.param);
        return sendJson(res, output.ok ? 200 : 400, output);
      } catch (err) {
        return sendJson(res, 400, { ok: false, error: err.message });
      }
    }

    return sendJson(res, 404, { ok: false, error: "Ruta no encontrada" });
  });

  function listen(port, attemptsLeft = 10) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
          listen(port + 1, attemptsLeft - 1).then(resolve, reject);
        } else {
          reject(err);
        }
      });
      server.listen(port, () => {
        console.log(`[Primera Sesión Node] Vista interactiva en http://localhost:${port}`);
        resolve(server);
      });
    });
  }

  return listen(basePort);
}

if (require.main === module) {
  startNodeLabServer().catch((err) => {
    console.error("Error al iniciar servidor Node Lab:", err);
    process.exit(1);
  });
}

module.exports = { executeExercise, startNodeLabServer };
