// Utilidades para generar datos aleatorios para la base de datos

// Genera un número aleatorio entre min y max (inclusive)
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Genera un número decimal aleatorio entre min y max con precisión decimal
export function randomDecimal(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min
  return Number(value.toFixed(decimals))
}

// Selecciona un elemento aleatorio de un array
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Selecciona múltiples elementos aleatorios de un array
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Genera una fecha aleatoria entre dos fechas
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Genera una fecha aleatoria en los últimos n meses
export function randomRecentDate(months = 3): Date {
  const end = new Date()
  const start = new Date()
  start.setMonth(end.getMonth() - months)
  return randomDate(start, end)
}

// Formatea una fecha como YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Formatea una hora como HH:MM:SS
export function formatTime(date: Date): string {
  return date.toTimeString().split(" ")[0]
}

// Nombres de ejemplo para socios
export const nombresSocios = [
  "Miguel Ángel",
  "Laura",
  "Carlos",
  "Ana",
  "Javier",
  "María",
  "David",
  "Sofía",
  "Pablo",
  "Lucía",
  "Daniel",
  "Elena",
  "Alejandro",
  "Carmen",
  "Jorge",
  "Isabel",
  "Raúl",
  "Cristina",
  "Fernando",
  "Marta",
  "Alberto",
  "Patricia",
  "Sergio",
  "Silvia",
  "Óscar",
  "Beatriz",
  "Rubén",
  "Natalia",
  "Adrián",
  "Claudia",
  "Víctor",
  "Alicia",
]

export const apellidosSocios = [
  "García",
  "Rodríguez",
  "González",
  "Fernández",
  "López",
  "Martínez",
  "Sánchez",
  "Pérez",
  "Gómez",
  "Martín",
  "Jiménez",
  "Ruiz",
  "Hernández",
  "Díaz",
  "Moreno",
  "Álvarez",
  "Romero",
  "Alonso",
  "Gutiérrez",
  "Navarro",
  "Torres",
  "Domínguez",
  "Vázquez",
  "Ramos",
  "Gil",
  "Ramírez",
  "Serrano",
  "Blanco",
  "Suárez",
  "Molina",
  "Morales",
  "Ortega",
]

// Categorías de productos
export const categoriasProductos = ["flores", "hash", "extractos", "vaper", "comestibles", "bebidas", "accesorios"]

// Tipos de productos por categoría
export const tiposProductos: Record<string, string[]> = {
  flores: ["Indica", "Sativa", "Híbrida"],
  hash: ["Tradicional", "Extraído con agua", "Bubble hash", "Dry sift"],
  extractos: ["Concentrado", "Solventless", "BHO", "Rosin", "CBD"],
  vaper: ["Desechable", "Recargable", "Cartucho", "Pod"],
  comestibles: ["Gominolas", "Chocolate", "Galletas", "Brownies", "CBD"],
  bebidas: ["Infusión", "Refresco", "Energética", "CBD"],
  accesorios: ["Vaporizador", "Grinder", "Papel", "Almacenamiento", "Dispositivo"],
}

// Nombres de productos por categoría
export const nombresProductos: Record<string, string[]> = {
  flores: [
    "OG Kush",
    "Blue Dream",
    "Girl Scout Cookies",
    "Sour Diesel",
    "Purple Haze",
    "White Widow",
    "Northern Lights",
    "Amnesia Haze",
    "Jack Herer",
    "AK-47",
    "Bubba Kush",
    "Granddaddy Purple",
    "Durban Poison",
    "Green Crack",
    "Pineapple Express",
  ],
  hash: [
    "Hash Marroquí",
    "Ice-O-Lator Hash",
    "Charas",
    "Lebanese Hash",
    "Afghan Hash",
    "Nepalese Hash",
    "Ketama Gold",
    "Manali Cream",
    "Malana Cream",
    "Red Lebanese",
  ],
  extractos: [
    "Shatter OG Kush",
    "Rosin Press",
    "Live Resin",
    "Aceite CBD Full Spectrum",
    "Wax",
    "Budder",
    "Crumble",
    "Diamonds",
    "Sauce",
    "Distillate",
    "RSO",
  ],
  vaper: [
    "Vape Pen OG Kush",
    "Cartucho Blue Dream",
    "Pod System",
    "Vape Kit",
    "Disposable Vape",
    "Cartucho Sour Diesel",
    "Vape Pen CBD",
    "Cartucho Híbrido",
    "Pod Recargable",
  ],
  comestibles: [
    "Gummies CBD",
    "Chocolate Indica",
    "Brownies Sativa",
    "Galletas Híbridas",
    "Caramelos CBD",
    "Trufas Indica",
    "Palomitas Sativa",
    "Miel CBD",
    "Gomitas Ácidas",
    "Chocolate Negro",
  ],
  bebidas: [
    "Bebida Relajante",
    "Té CBD",
    "Refresco Energético",
    "Agua Infusionada",
    "Kombucha CBD",
    "Café Infusionado",
    "Smoothie Relajante",
    "Bebida Energética",
    "Té Helado CBD",
  ],
  accesorios: [
    "Vaporizador Premium",
    "Grinder Metálico",
    "Papel King Size",
    "Bong de Cristal",
    "Pipa de Madera",
    "Balanza Digital",
    "Kit de Almacenamiento",
    "Vaporizador Portátil",
    "Mechero",
    "Cenicero",
  ],
}

// Categorías de gastos
export const categoriasGastos = [
  "product",
  "beverages",
  "rent",
  "taxes",
  "affiliates",
  "utilities",
  "salaries",
  "marketing",
  "other",
]

// Descripciones de gastos por categoría
export const descripcionesGastos: Record<string, string[]> = {
  product: [
    "Compra de flores premium",
    "Reposición de stock de hash",
    "Compra de extractos",
    "Nuevos productos de CBD",
    "Compra de semillas",
    "Importación de productos",
  ],
  beverages: [
    "Compra de bebidas para el club",
    "Reposición de refrescos",
    "Compra de café y té",
    "Bebidas energéticas para stock",
    "Agua mineral",
    "Bebidas infusionadas",
  ],
  rent: [
    "Alquiler mensual del local",
    "Pago trimestral de alquiler",
    "Depósito de alquiler",
    "Renovación de contrato de alquiler",
    "Alquiler de espacio adicional",
  ],
  taxes: [
    "Impuestos trimestrales",
    "IVA trimestral",
    "Impuesto de sociedades",
    "Tasas municipales",
    "Impuestos sobre actividades económicas",
  ],
  affiliates: [
    "Comisiones a afiliados",
    "Pago a colaboradores",
    "Comisiones de ventas",
    "Programa de referidos",
    "Pago a influencers",
  ],
  utilities: [
    "Factura de electricidad",
    "Factura de agua",
    "Factura de gas",
    "Factura de internet",
    "Telefonía",
    "Mantenimiento de sistemas",
  ],
  salaries: [
    "Salarios del personal",
    "Nóminas mensuales",
    "Bonus trimestrales",
    "Pagas extra",
    "Seguridad social",
    "Formación de personal",
  ],
  marketing: [
    "Campaña publicitaria en redes sociales",
    "Diseño de material promocional",
    "Impresión de folletos",
    "Evento promocional",
    "Actualización de web",
  ],
  other: [
    "Material de oficina",
    "Limpieza del local",
    "Reparaciones",
    "Seguro del local",
    "Gastos de viaje",
    "Consultoría legal",
  ],
}

// Métodos de pago
export const metodosPago = ["cash", "card", "transfer", "check"]

// Estados
export const estadosSocios = ["active", "inactive"]
export const tiposSocios = ["medical", "recreational", "both"]
export const estadosProductos = ["in_stock", "low_stock", "out_of_stock"]
export const estadosVentas = ["completed", "pending", "cancelled"]
export const estadosGastos = ["paid", "pending", "cancelled"]
