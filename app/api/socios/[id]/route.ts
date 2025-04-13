import { NextResponse } from "next/server"
import { getSocioById, updateSocio, deleteSocio } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const socio = await getSocioById(id)

    if (!socio) {
      return NextResponse.json({ error: "Socio no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ socio })
  } catch (error) {
    console.error("Error al obtener socio:", error)
    return NextResponse.json({ error: "Error al obtener socio" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()
    const socio = await updateSocio(id, data)

    if (!socio) {
      return NextResponse.json({ error: "Socio no encontrado o no se realizaron cambios" }, { status: 404 })
    }

    return NextResponse.json({ socio })
  } catch (error) {
    console.error("Error al actualizar socio:", error)
    return NextResponse.json({ error: "Error al actualizar socio" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    await deleteSocio(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar socio:", error)
    return NextResponse.json({ error: "Error al eliminar socio" }, { status: 500 })
  }
}
