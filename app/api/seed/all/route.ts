import { NextResponse } from "next/server"

// Modificar la función POST para usar rutas relativas en lugar de URLs absolutas
export async function POST() {
  try {
    // Generar socios
    const sociosResponse = await fetch("/api/seed/socios", {
      method: "POST",
    })
    const sociosData = await sociosResponse.json()

    if (!sociosData.success) {
      return NextResponse.json({
        success: false,
        message: `Error al generar socios: ${sociosData.message}`,
      })
    }

    // Generar productos
    const productosResponse = await fetch("/api/seed/productos", {
      method: "POST",
    })
    const productosData = await productosResponse.json()

    if (!productosData.success) {
      return NextResponse.json({
        success: false,
        message: `Error al generar productos: ${productosData.message}`,
      })
    }

    // Generar ventas
    const ventasResponse = await fetch("/api/seed/ventas", {
      method: "POST",
    })
    const ventasData = await ventasResponse.json()

    if (!ventasData.success) {
      return NextResponse.json({
        success: false,
        message: `Error al generar ventas: ${ventasData.message}`,
      })
    }

    // Generar gastos
    const gastosResponse = await fetch("/api/seed/gastos", {
      method: "POST",
    })
    const gastosData = await gastosResponse.json()

    if (!gastosData.success) {
      return NextResponse.json({
        success: false,
        message: `Error al generar gastos: ${gastosData.message}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Se han generado todos los datos de prueba correctamente.",
      resumen: {
        socios: sociosData.socios.length,
        productos: productosData.productos.length,
        ventas: ventasData.ventas.length,
        gastos: gastosData.gastos.length,
      },
    })
  } catch (error) {
    console.error("Error al generar todos los datos de prueba:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al generar todos los datos de prueba",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
