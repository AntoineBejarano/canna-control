import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Consultar todas las tablas públicas en la base de datos
    const result = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Extraer los nombres de las tablas
    const tables = result.map((row: any) => row.table_name)

    return NextResponse.json({
      success: true,
      tables,
    })
  } catch (error) {
    console.error("Error al obtener las tablas:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener las tablas de la base de datos",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
