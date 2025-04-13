import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import {
  categoriasGastos,
  descripcionesGastos,
  randomItem,
  randomDecimal,
  randomRecentDate,
  formatDate,
  metodosPago,
  estadosGastos,
} from "@/lib/seed-utils"

export async function POST() {
  try {
    // Verificar si ya hay gastos en la base de datos
    const existingGastos = await sql`SELECT COUNT(*) FROM gastos`
    const gastosCount = Number.parseInt(existingGastos[0].count)

    if (gastosCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Ya existen ${gastosCount} gastos en la base de datos. Elimínalos primero si deseas generar nuevos datos de prueba.`,
      })
    }

    // Generar 15 gastos de prueba
    const gastosGenerados = []

    for (let i = 0; i < 15; i++) {
      // Categoría aleatoria
      const categoria = randomItem(categoriasGastos)

      // Descripción aleatoria según la categoría
      const descripcion = randomItem(descripcionesGastos[categoria] || ["Gasto general"])

      // Monto según la categoría
      let monto = 0

      switch (categoria) {
        case "rent":
          monto = randomDecimal(1000, 3000, 2)
          break
        case "salaries":
          monto = randomDecimal(2000, 5000, 2)
          break
        case "taxes":
          monto = randomDecimal(500, 2000, 2)
          break
        case "product":
        case "beverages":
          monto = randomDecimal(300, 1500, 2)
          break
        case "utilities":
          monto = randomDecimal(100, 500, 2)
          break
        case "marketing":
        case "affiliates":
          monto = randomDecimal(200, 800, 2)
          break
        default:
          monto = randomDecimal(50, 300, 2)
      }

      // Fecha aleatoria en los últimos 3 meses
      const fechaGasto = randomRecentDate(3)
      const fecha = formatDate(fechaGasto)

      // Método de pago y estado aleatorios
      const metodoPago = randomItem(metodosPago)
      const estado = randomItem(estadosGastos)

      // Insertar en la base de datos
      const gasto = await sql`
        INSERT INTO gastos (
          fecha, categoria, descripcion, monto,
          metodo_pago, estado, fecha_creacion
        ) VALUES (
          ${fecha}, ${categoria}, ${descripcion}, ${monto},
          ${metodoPago}, ${estado}, ${fechaGasto.toISOString()}
        ) RETURNING id, fecha, categoria, monto
      `

      gastosGenerados.push(gasto[0])
    }

    return NextResponse.json({
      success: true,
      message: `Se han generado 15 gastos de prueba correctamente.`,
      gastos: gastosGenerados,
    })
  } catch (error) {
    console.error("Error al generar gastos de prueba:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al generar gastos de prueba",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
