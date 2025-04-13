import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import {
  categoriasProductos,
  tiposProductos,
  nombresProductos,
  randomItem,
  randomItems,
  randomInt,
  randomDecimal,
} from "@/lib/seed-utils"

export async function POST() {
  try {
    // Verificar si ya hay productos en la base de datos
    const existingProductos = await sql`SELECT COUNT(*) FROM productos`
    const productosCount = Number.parseInt(existingProductos[0].count)

    if (productosCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Ya existen ${productosCount} productos en la base de datos. Elimínalos primero si deseas generar nuevos datos de prueba.`,
      })
    }

    // Generar 20 productos de prueba
    const productosGenerados = []

    // Asegurarnos de tener al menos 2 productos por categoría
    for (const categoria of categoriasProductos) {
      const productosCategoria = nombresProductos[categoria] || []

      // Generar 2-4 productos por categoría
      const cantidadProductos = Math.min(randomInt(2, 4), productosCategoria.length)

      // Seleccionar nombres aleatorios sin repetir
      const nombresSeleccionados = randomItems(productosCategoria, cantidadProductos)

      for (const nombre of nombresSeleccionados) {
        // Datos aleatorios para el producto
        const tipo = randomItem(tiposProductos[categoria] || ["Estándar"])

        // THC y CBD según la categoría
        let thc = null
        let cbd = null

        if (categoria === "flores") {
          thc = randomDecimal(15, 25, 1)
          cbd = randomDecimal(0.1, 1.0, 1)
        } else if (categoria === "hash" || categoria === "extractos") {
          thc = randomDecimal(20, 70, 1)
          cbd = randomDecimal(0.5, 5.0, 1)
        } else if (categoria.includes("cbd") || tipo.includes("CBD")) {
          thc = randomDecimal(0.1, 0.3, 1)
          cbd = randomDecimal(10, 30, 1)
        }

        const precio = randomDecimal(10, 100, 2)
        const precioCosto = precio * randomDecimal(0.4, 0.6, 2) // 40-60% del precio de venta

        const stock = randomInt(0, 200)
        let unidadStock = "g"

        if (categoria === "comestibles" || categoria === "bebidas") {
          unidadStock = "unidades"
        } else if (categoria === "accesorios" || categoria === "vaper") {
          unidadStock = "unidades"
        }

        // Estado según el stock
        let estado = "in_stock"
        if (stock === 0) {
          estado = "out_of_stock"
        } else if (stock < 10) {
          estado = "low_stock"
        }

        // Descripción genérica
        const descripcion = `${nombre} de alta calidad. ${tipo}. Ideal para ${categoria === "flores" ? "consumo" : categoria === "comestibles" || categoria === "bebidas" ? "disfrutar" : "usar"} en cualquier momento.`

        // Imagen placeholder
        const imagen = "/placeholder.svg?height=200&width=400"

        // Destacado aleatoriamente (20% de probabilidad)
        const destacado = Math.random() < 0.2

        // Fecha de creación aleatoria en los últimos 3 meses
        const fechaCreacion = new Date()
        fechaCreacion.setMonth(fechaCreacion.getMonth() - randomInt(0, 3))
        fechaCreacion.setDate(randomInt(1, 28))

        // Insertar en la base de datos
        const producto = await sql`
          INSERT INTO productos (
            nombre, categoria, tipo, thc, cbd, precio, precio_costo,
            stock, unidad_stock, descripcion, imagen, estado,
            destacado, fecha_creacion
          ) VALUES (
            ${nombre}, ${categoria}, ${tipo}, ${thc}, ${cbd}, ${precio}, ${precioCosto},
            ${stock}, ${unidadStock}, ${descripcion}, ${imagen}, ${estado},
            ${destacado}, ${fechaCreacion.toISOString()}
          ) RETURNING id, nombre, categoria
        `

        productosGenerados.push(producto[0])
      }
    }

    return NextResponse.json({
      success: true,
      message: `Se han generado ${productosGenerados.length} productos de prueba correctamente.`,
      productos: productosGenerados,
    })
  } catch (error) {
    console.error("Error al generar productos de prueba:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al generar productos de prueba",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
