import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST() {
  try {
    // Usar directamente la conexión para ejecutar la consulta
    // Esto es para limpiar las tablas en la base de datos incorrecta
    const sql = neon(process.env.DATABASE_URL!)

    // Lista de tablas a eliminar
    const tablesToDrop = [
      "socios",
      "productos",
      "ventas",
      "items_venta",
      "gastos",
      "empleados",
      "usuarios",
      "caja_registradora",
    ]

    // Eliminar las tablas en orden inverso para evitar problemas con las claves foráneas
    for (const table of tablesToDrop.reverse()) {
      try {
        await sql`DROP TABLE IF EXISTS ${sql(table)} CASCADE`
      } catch (error) {
        console.error(`Error al eliminar la tabla ${table}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tablas eliminadas correctamente. Ahora puedes crear las tablas en la base de datos correcta.",
    })
  } catch (error) {
    console.error("Error al limpiar la base de datos:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al limpiar la base de datos",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
