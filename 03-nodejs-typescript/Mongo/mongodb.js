/**
 * ============================================================================
 * SCRIPT DE PRÁCTICA: OPERACIONES CRUD EN MONGODB (MONGOSH)
 * ============================================================================
 * Propósito: Demostrar la creación de bases de datos, colecciones y las 4
 * operaciones fundamentales (Create, Read, Update, Delete) sobre una colección
 * de personajes de Dragon Ball Z ("DBZ-V2").
 */

// 1. Crear o usar una base de datos existente
use("DBZ-V2")

// 2. CREAR UNA COLECCIÓN (Comandos de referencia)
// db.createCollection("status")
// db.createCollection("characters")

// Mostrar la base de datos que estamos utilizando actualmente
// db

// Eliminar una base de datos
// db.dropDatabase()

// ============================================================================
// OPERACIONES CRUD
// ============================================================================

// ----------------------------------------------------------------------------
// CREATE (Inserción de documentos)
// ----------------------------------------------------------------------------

// Insertar uno (insertOne es el método recomendado en versiones actuales de MongoDB)
db.characters.insertOne(
    // Documento
    {
        name: "Vegeta",
        species: "Saiyan",
        edad: 52,
        gender: "Male",
        powerLevel: 950000
    }
)

// Insertar varios documentos simultáneamente
db.characters.insertMany(
    [
        {
            name: "Son Gohan",
            species: "Saiyan",
            edad: 23,
            gender: "Male",
            powerLevel: 880000
        },
        {
            name: "Pan",
            species: "Saiyan",
            edad: 16,
            gender: "Female",
            powerLevel: 320000
        },
        {
            name: "Piccolo",
            species: "Namekian",
            edad: 87,
            gender: "Male",
            powerLevel: 790000
        }
    ]
)

// ----------------------------------------------------------------------------
// READ (Lectura y filtrado de documentos)
// ----------------------------------------------------------------------------

// Buscar personajes cuya especie sea igual ($eq) a "Namekian"
db.characters.find({ species: { $eq: "Namekian" } })

// Complemento: Buscar Saiyans mayores de 20 años ($gt = Greater Than)
db.characters.find({ species: "Saiyan", edad: { $gt: 20 } })

// ----------------------------------------------------------------------------
// UPDATE (Actualización de documentos - Complementado)
// ----------------------------------------------------------------------------

// Actualizar un único documento: incrementar edad y definir nivel de poder
db.characters.updateOne(
    { name: "Vegeta" },
    {
        $set: { powerLevel: 1200000 },
        $inc: { edad: 1 }
    }
)

// Actualizar múltiples documentos: asignar el universo 7 a todos los registros
db.characters.updateMany(
    {},
    { $set: { universe: 7 } }
)

// ----------------------------------------------------------------------------
// DELETE (Eliminación de documentos - Complementado)
// ----------------------------------------------------------------------------

// Eliminar un documento específico por nombre
db.characters.deleteOne({ name: "Pan" })

// Eliminar múltiples documentos que cumplan un criterio
db.characters.deleteMany({ edad: { $gt: 100 } })
