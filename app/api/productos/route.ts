import { NextResponse } from "next/server"
import { getProductos, createProducto } from "@/lib/db"

export async function GET() {
  try {
    const productos = await getProductos()
    return NextResponse.json({ productos })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const producto = await createProducto({
      ...data,
      precio: data.precio || 0,
      precio_costo: data.precio_costo || 0,
      stock: data.stock || 0,
      destacado: data.destacado || false,
      fecha_creacion: data.fecha_creacion || new Date(),
      estado: data.estado || "in_stock",
    })
    return NextResponse.json({ producto })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
