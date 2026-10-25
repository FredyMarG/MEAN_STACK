/**
 * ============================================================================
 * CONTROLADOR DE OPERACIONES ARITMÉTICAS (operaciones.controller.ts)
 * ============================================================================
 * Propósito: Ejecutar suma, resta, multiplicación y división a partir de los
 * parámetros de ruta `:num1` y `:num2`.
 *
 * Correcciones aplicadas:
 * 1. En `validar()`, se corrigió `num1.isNaN & num2.isNaN` por `Number.isNaN(num1) || Number.isNaN(num2)`.
 * 2. Se integró `validar()` en cada operación y se añadió validación de división por cero.
 */

import Express from "express";

export function validar(num1: number, num2: number, res: Express.Response): boolean {
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        res.status(400).json({ msg: "Uno o ambos parámetros no son números válidos" });
        return false;
    }
    return true;
}

export const suma = (req: Express.Request, res: Express.Response) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    if (!validar(num1, num2, res)) return;

    const resultado = num1 + num2;
    res.status(200).json({ msg: `La suma de los parámetros es igual a ${resultado}`, resultado });
};

export const resta = (req: Express.Request, res: Express.Response) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    if (!validar(num1, num2, res)) return;

    const resultado = num1 - num2;
    res.status(200).json({ msg: `La resta de los parámetros es igual a ${resultado}`, resultado });
};

export const multiplicacion = (req: Express.Request, res: Express.Response) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    if (!validar(num1, num2, res)) return;

    const resultado = num1 * num2;
    res.status(200).json({ msg: `El resultado de la multiplicación de los parámetros es igual a ${resultado}`, resultado });
};

export const division = (req: Express.Request, res: Express.Response) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    if (!validar(num1, num2, res)) return;

    if (num2 === 0) {
        return res.status(400).json({ msg: "Error matemático: No es posible dividir entre cero" });
    }

    const resultado = num1 / num2;
    res.status(200).json({ msg: `La división de los parámetros es igual a ${resultado}`, resultado });
};
