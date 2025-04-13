import { NextResponse } from "next/server"
import { getSocios, createSocio } from "@/lib/db"

export async function GET() {
  try {
    const socios = await getSocios()
    return NextResponse.json({ socios })
  } catch (error) {
    console.error("Error al obtener socios:", error)
    return NextResponse.json({ error: "Error al obtener socios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const socio = await createSocio({
      ...data,
      total_gastado: data.total_gastado || 0,
      visitas: data.visitas || 0,
      saldo: data.saldo || 0,
      fecha_registro: data.fecha_registro || new Date(),
      estado: data.estado || "active",
    })
    return NextResponse.json({ socio })
  } catch (error) {
    console.error("Error al crear socio:", error)
    return NextResponse.json({ error: "Error al crear socio" }, { status: 500 })
  }
}
