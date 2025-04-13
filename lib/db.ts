import { neon } from "@neondatabase/serverless"

// Crear una instancia de conexión reutilizable
export const sql = neon(process.env.DATABASE_URL!)

// Tipos para las entidades principales
export interface Socio {
  id: number
  nombre: string
  email?: string
  telefono?: string
  estado: "active" | "inactive"
  tipo?: "medical" | "recreational" | "both"
  total_gastado: number
  ultima_visita?: Date
  visitas: number
  avatar?: string
  imagen_url?: string
  saldo: number
  direccion?: string
  ciudad?: string
  codigo_postal?: string
  notas?: string
  fecha_nacimiento?: Date
  fecha_registro: Date
  id_membresia?: string
}

export interface Producto {
  id: number
  nombre: string
  categoria: string
  tipo?: string
  thc?: number
  cbd?: number
  precio: number
  precio_costo: number
  stock: number
  unidad_stock: string
  descripcion?: string
  imagen?: string
  estado: "in_stock" | "low_stock" | "out_of_stock"
  etiquetas?: string[]
  destacado: boolean
  fecha_creacion: Date
}

export interface Venta {
  id: number
  fecha: Date
  hora?: Date
  socio_id?: number
  nombre_socio: string
  total: number
  metodo_pago: "cash" | "card" | "transfer"
  estado: "completed" | "pending" | "cancelled"
  notas?: string
  fecha_creacion: Date
  fecha_actualizacion: Date
  items?: ItemVenta[]
}

export interface ItemVenta {
  id: number
  venta_id: number
  producto_id: number
  cantidad: number
  precio: number
  total: number
  producto?: Producto
}

export interface Gasto {
  id: number
  fecha: Date
  categoria: string
  descripcion: string
  monto: number
  metodo_pago: "cash" | "card" | "transfer" | "check"
  estado: "paid" | "pending" | "cancelled"
  notas?: string
  fecha_creacion: Date
}

export interface Empleado {
  id: number
  nombre: string
  email: string
  telefono?: string
  rol: string
  estado: "active" | "inactive"
  fecha_contratacion?: Date
  salario?: number
  avatar?: string
  fecha_creacion: Date
}

export interface Usuario {
  id: number
  nombre: string
  email: string
  password_hash: string
  rol: "admin" | "employee"
  empleado_id?: number
  ultimo_acceso?: Date
  fecha_creacion: Date
}

export interface CajaRegistradora {
  id: number
  monto_inicial: number
  monto_final?: number
  monto_esperado?: number
  diferencia?: number
  fecha_apertura: Date
  fecha_cierre?: Date
  estado: "open" | "closed"
  observaciones?: string
  usuario_id: number
  nombre_usuario: string
}

// Funciones para socios
export async function getSocios() {
  return await sql<Socio[]>`SELECT * FROM socios ORDER BY nombre`
}

export async function getSocioById(id: number) {
  const socios = await sql<Socio[]>`SELECT * FROM socios WHERE id = ${id}`
  return socios[0]
}

export async function createSocio(socio: Omit<Socio, "id">) {
  const result = await sql`
    INSERT INTO socios (
      nombre, email, telefono, estado, tipo, total_gastado, 
      ultima_visita, visitas, avatar, imagen_url, saldo, 
      direccion, ciudad, codigo_postal, notas, fecha_nacimiento, 
      fecha_registro, id_membresia
    ) VALUES (
      ${socio.nombre}, ${socio.email}, ${socio.telefono}, ${socio.estado}, 
      ${socio.tipo}, ${socio.total_gastado}, ${socio.ultima_visita}, 
      ${socio.visitas}, ${socio.avatar}, ${socio.imagen_url}, 
      ${socio.saldo}, ${socio.direccion}, ${socio.ciudad}, 
      ${socio.codigo_postal}, ${socio.notas}, ${socio.fecha_nacimiento}, 
      ${socio.fecha_registro}, ${socio.id_membresia}
    ) RETURNING *
  `
  return result[0]
}

export async function updateSocio(id: number, socio: Partial<Socio>) {
  // Construir dinámicamente la consulta de actualización
  const updates = Object.entries(socio)
    .filter(([_, value]) => value !== undefined)
    .map(([key, _]) => `${key} = $\{socio.${key}\}`)

  if (updates.length === 0) return null

  const updateQuery = `
    UPDATE socios 
    SET ${updates.join(", ")} 
    WHERE id = ${id} 
    RETURNING *
  `

  const result = await sql(updateQuery)
  return result[0]
}

export async function deleteSocio(id: number) {
  await sql`DELETE FROM socios WHERE id = ${id}`
  return true
}

// Funciones para productos
export async function getProductos() {
  return await sql<Producto[]>`SELECT * FROM productos ORDER BY nombre`
}

export async function getProductoById(id: number) {
  const productos = await sql<Producto[]>`SELECT * FROM productos WHERE id = ${id}`
  return productos[0]
}

export async function createProducto(producto: Omit<Producto, "id">) {
  const result = await sql`
    INSERT INTO productos (
      nombre, categoria, tipo, thc, cbd, precio, precio_costo,
      stock, unidad_stock, descripcion, imagen, estado,
      etiquetas, destacado, fecha_creacion
    ) VALUES (
      ${producto.nombre}, ${producto.categoria}, ${producto.tipo}, 
      ${producto.thc}, ${producto.cbd}, ${producto.precio}, 
      ${producto.precio_costo}, ${producto.stock}, ${producto.unidad_stock}, 
      ${producto.descripcion}, ${producto.imagen}, ${producto.estado}, 
      ${producto.etiquetas}, ${producto.destacado}, ${producto.fecha_creacion}
    ) RETURNING *
  `
  return result[0]
}

export async function updateProducto(id: number, producto: Partial<Producto>) {
  // Similar a updateSocio, construir dinámicamente la consulta
  const updates = Object.entries(producto)
    .filter(([_, value]) => value !== undefined)
    .map(([key, _]) => `${key} = $\{producto.${key}\}`)

  if (updates.length === 0) return null

  const updateQuery = `
    UPDATE productos 
    SET ${updates.join(", ")} 
    WHERE id = ${id} 
    RETURNING *
  `

  const result = await sql(updateQuery)
  return result[0]
}

export async function deleteProducto(id: number) {
  await sql`DELETE FROM productos WHERE id = ${id}`
  return true
}

// Funciones para ventas
export async function getVentas() {
  return await sql<Venta[]>`SELECT * FROM ventas ORDER BY fecha DESC, hora DESC`
}

export async function getVentaById(id: number) {
  const ventas = await sql<Venta[]>`SELECT * FROM ventas WHERE id = ${id}`
  const venta = ventas[0]

  if (venta) {
    // Obtener los items de la venta
    const items = await sql<ItemVenta[]>`
      SELECT * FROM items_venta WHERE venta_id = ${id}
    `
    venta.items = items
  }

  return venta
}

// Añadir más funciones según sea necesario para las demás entidades
