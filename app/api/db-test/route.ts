import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Usar la URL de conexión proporcionada
    const sql = neon(
      process.env.DATABASE_URL ||
        "postgresql://neondb_owner:npg_V4JGFscSeqX6@ep-lingering-fog-a54ft9kb-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
    )

    // Probar la conexión con una consulta simple
    const result = await sql`SELECT current_timestamp as time, current_database() as database, version() as version`

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a la base de datos Neon",
      data: result[0],
    })
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al conectar a la base de datos",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
