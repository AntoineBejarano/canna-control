"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

// Definición de tipos
export interface Product {
  id: number
  name: string
  category: string
  type: string
  thc?: number
  cbd?: number
  price: number
  costPrice: number
  stock: number
  stockUnit: string
  description: string
  image: string
  status: "in_stock" | "low_stock" | "out_of_stock"
  tags?: string[]
  featured?: boolean
  createdAt: string
}

interface ProductContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProductById: (id: number) => Product | undefined
}

// Datos iniciales de productos
const initialProducts: Product[] = [
  {
    id: 1,
    name: "OG Kush",
    category: "flores",
    type: "Indica",
    thc: 24.5,
    cbd: 0.1,
    price: 15.0,
    costPrice: 8.0,
    stock: 120,
    stockUnit: "g",
    description: "Una cepa clásica con aroma terroso y efectos relajantes.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Relajante", "Terroso", "Potente"],
    featured: true,
    createdAt: "2025-01-15T10:30:00",
  },
  {
    id: 2,
    name: "Blue Dream",
    category: "flores",
    type: "Híbrida",
    thc: 18.0,
    cbd: 0.2,
    price: 14.0,
    costPrice: 7.5,
    stock: 85,
    stockUnit: "g",
    description: "Híbrida equilibrada con sabor a bayas y efectos creativos.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Creativo", "Bayas", "Equilibrado"],
    featured: true,
    createdAt: "2025-01-20T14:45:00",
  },
  {
    id: 3,
    name: "Gummies CBD",
    category: "comestibles",
    type: "CBD",
    thc: 0.3,
    cbd: 25.0,
    price: 25.0,
    costPrice: 12.0,
    stock: 45,
    stockUnit: "paquetes",
    description: "Deliciosas gomitas con CBD para alivio sin efectos psicoactivos.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["CBD", "Sin THC", "Alivio"],
    featured: false,
    createdAt: "2025-02-05T09:15:00",
  },
  {
    id: 4,
    name: "Bebida Relajante",
    category: "bebidas",
    type: "CBD",
    thc: 0.2,
    cbd: 15.0,
    price: 18.0,
    costPrice: 8.0,
    stock: 30,
    stockUnit: "unidades",
    description: "Bebida refrescante con CBD para relajación y bienestar.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Refrescante", "CBD", "Relajante"],
    featured: false,
    createdAt: "2025-02-10T16:20:00",
  },
  {
    id: 5,
    name: "Vaporizador Premium",
    category: "accesorios",
    type: "Dispositivo",
    price: 89.99,
    costPrice: 45.0,
    stock: 5,
    stockUnit: "unidades",
    description: "Vaporizador de alta calidad para una experiencia óptima.",
    image: "/placeholder.svg?height=200&width=400",
    status: "low_stock",
    tags: ["Premium", "Portátil", "Duradero"],
    featured: false,
    createdAt: "2025-01-25T11:30:00",
  },
  {
    id: 6,
    name: "Girl Scout Cookies",
    category: "flores",
    type: "Híbrida",
    thc: 22.0,
    cbd: 0.5,
    price: 18.0,
    costPrice: 9.0,
    stock: 0,
    stockUnit: "g",
    description: "Híbrida potente con sabor dulce y efectos eufóricos.",
    image: "/placeholder.svg?height=200&width=400",
    status: "out_of_stock",
    tags: ["Dulce", "Eufórico", "Potente"],
    featured: false,
    createdAt: "2025-01-10T08:45:00",
  },
  // Nuevos productos de ejemplo para las categorías solicitadas
  {
    id: 7,
    name: "Amnesia Haze",
    category: "flores",
    type: "Sativa",
    thc: 20.5,
    cbd: 0.1,
    price: 16.0,
    costPrice: 8.5,
    stock: 95,
    stockUnit: "g",
    description: "Sativa potente con efectos energizantes y sabor cítrico. Ideal para uso diurno.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Energizante", "Cítrico", "Creativo"],
    featured: true,
    createdAt: "2025-02-15T11:30:00",
  },
  {
    id: 8,
    name: "Northern Lights",
    category: "flores",
    type: "Indica",
    thc: 18.0,
    cbd: 0.2,
    price: 14.5,
    costPrice: 7.0,
    stock: 110,
    stockUnit: "g",
    description: "Indica clásica con efectos relajantes profundos y aroma dulce a pino.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Relajante", "Sueño", "Dulce"],
    featured: false,
    createdAt: "2025-02-18T09:45:00",
  },
  {
    id: 9,
    name: "Aceite CBD Full Spectrum",
    category: "extractos",
    type: "CBD",
    thc: 0.2,
    cbd: 30.0,
    price: 45.0,
    costPrice: 22.0,
    stock: 25,
    stockUnit: "unidades",
    description: "Aceite de CBD de espectro completo con terpenos naturales. 30ml con gotero.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["CBD", "Terapéutico", "Natural"],
    featured: true,
    createdAt: "2025-02-20T14:20:00",
  },
  {
    id: 10,
    name: "Shatter OG Kush",
    category: "extractos",
    type: "Concentrado",
    thc: 75.0,
    cbd: 0.5,
    price: 60.0,
    costPrice: 35.0,
    stock: 15,
    stockUnit: "g",
    description: "Concentrado de alta potencia con textura cristalina y sabor intenso a OG Kush.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Potente", "Concentrado", "Premium"],
    featured: false,
    createdAt: "2025-02-22T10:15:00",
  },
  {
    id: 11,
    name: "Hash Marroquí",
    category: "hash",
    type: "Tradicional",
    thc: 30.0,
    cbd: 2.0,
    price: 15.0,
    costPrice: 8.0,
    stock: 50,
    stockUnit: "g",
    description: "Hash tradicional marroquí con aroma especiado y efectos duraderos.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Tradicional", "Especiado", "Potente"],
    featured: true,
    createdAt: "2025-02-25T16:30:00",
  },
  {
    id: 12,
    name: "Ice-O-Lator Hash",
    category: "hash",
    type: "Extraído con agua",
    thc: 45.0,
    cbd: 1.0,
    price: 25.0,
    costPrice: 14.0,
    stock: 30,
    stockUnit: "g",
    description: "Hash de alta calidad extraído con agua helada. Pureza y potencia excepcionales.",
    image: "/placeholder.svg?height=200&width=400",
    status: "in_stock",
    tags: ["Premium", "Puro", "Artesanal"],
    featured: false,
    createdAt: "2025-02-28T13:45:00",
  },
  {
    id: 13,
    name: "Rosin Press",
    category: "extractos",
    type: "Solventless",
    thc: 65.0,
    cbd: 0.8,
    price: 70.0,
    costPrice: 40.0,
    stock: 10,
    stockUnit: "g",
    description: "Extracto premium sin solventes, prensado con calor. 100% natural y potente.",
    image: "/placeholder.svg?height=200&width=400",
    status: "low_stock",
    tags: ["Natural", "Sin solventes", "Artesanal"],
    featured: true,
    createdAt: "2025-03-01T11:20:00",
  },
]

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Cargar productos iniciales o desde localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      setProducts(initialProducts)
    }
  }, [])

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  // Añadir un nuevo producto
  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  // Actualizar un producto existente
  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product)))
  }

  // Eliminar un producto
  const deleteProduct = (id: number) => {
    console.log("Contexto: Eliminando producto con ID:", id)
    setProducts((prev) => {
      const newProducts = prev.filter((product) => product.id !== id)
      console.log("Productos restantes:", newProducts.length)
      return newProducts
    })
  }

  // Obtener un producto por su ID
  const getProductById = (id: number) => {
    return products.find((product) => product.id === id)
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
