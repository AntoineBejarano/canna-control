import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import {
  nombresSocios,
  apellidosSocios,
  randomItem,
  randomInt,
  randomDecimal,
  randomRecentDate,
  formatDate,
  estadosSocios,
  tiposSocios,
} from "@/lib/seed-utils"

export async function POST() {
  try {
    // Verificar si ya hay socios en la base de datos
    const existingSocios = await sql`SELECT COUNT(*) FROM socios`
    const sociosCount = Number.parseInt(existingSocios[0].count)

    if (sociosCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Ya existen ${sociosCount} socios en la base de datos. Elimínalos primero si deseas generar nuevos datos de prueba.`,
      })
    }

    // Generar 10 socios de prueba
    const sociosGenerados = []

    for (let i = 0; i < 10; i++) {
      const nombre = randomItem(nombresSocios)
      const apellido = randomItem(apellidosSocios)
      const nombreCompleto = `${nombre} ${apellido}`

      // Generar email basado en el nombre
      const email = `${nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}.${apellido
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}@example.com`

      // Generar teléfono aleatorio
      const telefono = `+34 ${randomInt(600, 699)} ${randomInt(100, 999)} ${randomInt(100, 999)}`

      // Otros datos aleatorios
      const estado = randomItem(estadosSocios)
      const tipo = randomItem(tiposSocios)
      const totalGastado = randomDecimal(0, 1000, 2)
      const fechaRegistro = formatDate(randomRecentDate(6))
      const ultimaVisita = formatDate(randomRecentDate(1))
      const visitas = randomInt(1, 20)
      const saldo = randomDecimal(0, 100, 2)

      // Iniciales para el avatar
      const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`

      // Insertar en la base de datos
      const socio = await sql`
        INSERT INTO socios (
          nombre, email, telefono, estado, tipo, total_gastado, 
          ultima_visita, visitas, avatar, saldo, fecha_registro
        ) VALUES (
          ${nombreCompleto}, ${email}, ${telefono}, ${estado}, ${tipo}, ${totalGastado},
          ${ultimaVisita}, ${visitas}, ${iniciales}, ${saldo}, ${fechaRegistro}
        ) RETURNING id, nombre, email
      `

      sociosGenerados.push(socio[0])
    }

    return NextResponse.json({
      success: true,
      message: `Se han generado 10 socios de prueba correctamente.`,
      socios: sociosGenerados,
    })
  } catch (error) {
    console.error("Error al generar socios de prueba:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al generar socios de prueba",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
