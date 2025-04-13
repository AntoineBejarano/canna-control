import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import {
  randomItem,
  randomInt,
  randomDecimal,
  randomRecentDate,
  formatDate,
  formatTime,
  metodosPago,
  estadosVentas,
} from "@/lib/seed-utils"

export async function POST() {
  try {
    // Verificar si ya hay ventas en la base de datos
    const existingVentas = await sql`SELECT COUNT(*) FROM ventas`
    const ventasCount = Number.parseInt(existingVentas[0].count)

    if (ventasCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Ya existen ${ventasCount} ventas en la base de datos. Elimínalas primero si deseas generar nuevos datos de prueba.`,
      })
    }

    // Obtener socios y productos existentes
    const socios = await sql`SELECT id, nombre FROM socios`
    const productos = await sql`SELECT id, nombre, precio, categoria FROM productos WHERE estado != 'out_of_stock'`

    if (socios.length === 0 || productos.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No hay socios o productos disponibles para generar ventas. Genera primero socios y productos.",
      })
    }

    // Generar 30 ventas de prueba
    const ventasGeneradas = []

    for (let i = 0; i < 30; i++) {
      // Fecha y hora aleatorias en los últimos 3 meses
      const fechaVenta = randomRecentDate(3)
      const fecha = formatDate(fechaVenta)
      const hora = formatTime(fechaVenta)

      // Socio aleatorio
      const socio = randomItem(socios)
      const socioId = socio.id
      const nombreSocio = socio.nombre

      // Método de pago y estado aleatorios
      const metodoPago = randomItem(metodosPago.slice(0, 3)) // Solo cash, card, transfer
      const estado = randomItem(estadosVentas)

      // Generar entre 1 y 4 items para la venta
      const numItems = randomInt(1, 4)
      const productosSeleccionados = []
      let total = 0

      // Seleccionar productos aleatorios sin repetir
      const productosDisponibles = [...productos]
      for (let j = 0; j < numItems; j++) {
        if (productosDisponibles.length === 0) break

        const index = randomInt(0, productosDisponibles.length - 1)
        const producto = productosDisponibles.splice(index, 1)[0]

        // Cantidad según la categoría
        let cantidad = 1
        const precio = Number.parseFloat(producto.precio)

        if (producto.categoria === "flores" || producto.categoria === "hash" || producto.categoria === "extractos") {
          // Para flores, hash y extractos, vender en gramos
          cantidad = randomDecimal(1, 5, 1)
        } else if (producto.categoria === "comestibles" || producto.categoria === "bebidas") {
          // Para comestibles y bebidas, vender 1-3 unidades
          cantidad = randomInt(1, 3)
        }

        const itemTotal = precio * cantidad
        total += itemTotal

        productosSeleccionados.push({
          productoId: producto.id,
          cantidad,
          precio,
          total: itemTotal,
        })
      }

      // Redondear el total a 2 decimales
      total = Number.parseFloat(total.toFixed(2))

      // Insertar la venta en la base de datos
      const venta = await sql`
        INSERT INTO ventas (
          fecha, hora, socio_id, nombre_socio, total,
          metodo_pago, estado, fecha_creacion, fecha_actualizacion
        ) VALUES (
          ${fecha}, ${hora}, ${socioId}, ${nombreSocio}, ${total},
          ${metodoPago}, ${estado}, ${fechaVenta.toISOString()}, ${fechaVenta.toISOString()}
        ) RETURNING id, fecha, total
      `

      const ventaId = venta[0].id

      // Insertar los items de la venta
      for (const item of productosSeleccionados) {
        await sql`
          INSERT INTO items_venta (
            venta_id, producto_id, cantidad, precio, total
          ) VALUES (
            ${ventaId}, ${item.productoId}, ${item.cantidad}, ${item.precio}, ${item.total}
          )
        `
      }

      ventasGeneradas.push({
        id: ventaId,
        fecha,
        total,
        items: productosSeleccionados.length,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Se han generado 30 ventas de prueba correctamente.`,
      ventas: ventasGeneradas,
    })
  } catch (error) {
    console.error("Error al generar ventas de prueba:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al generar ventas de prueba",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
