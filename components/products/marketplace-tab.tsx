"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useProducts } from "@/contexts/product-context"
import { PlusCircle, Info, Tag, DollarSign, TrendingUp } from "lucide-react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Tipo para los productos del marketplace
interface MarketplaceProduct {
  id: string
  name: string
  description: string
  category: string
  type: string
  costPrice: number
  recommendedPrice: number
  margin: number
  image: string
  supplier: string
  rating: number
  popularity: string
  thcContent?: number
  cbdContent?: number
  stockUnit: string
}

export function MarketplaceTab() {
  const { addProduct } = useProducts()
  const { toast } = useToast()
  const [addingProductId, setAddingProductId] = useState<string | null>(null)

  // Datos simulados de productos recomendados
  const marketplaceProducts: MarketplaceProduct[] = [
    {
      id: "mp-1",
      name: "OG Kush Premium",
      description: "Una de las cepas más populares, conocida por su aroma terroso y efectos relajantes.",
      category: "flores",
      type: "Indica",
      costPrice: 8.5,
      recommendedPrice: 12.0,
      margin: 41.2,
      image: "/placeholder.svg?height=200&width=200",
      supplier: "GreenGrow Farms",
      rating: 4.8,
      popularity: "Alta",
      thcContent: 22.5,
      cbdContent: 0.1,
      stockUnit: "g",
    },
    {
      id: "mp-2",
      name: "Gominolas CBD",
      description: "Deliciosas gominolas con 10mg de CBD por unidad, sabores surtidos.",
      category: "comestibles",
      type: "CBD",
      costPrice: 15.0,
      recommendedPrice: 24.99,
      margin: 66.6,
      image: "/placeholder.svg?height=200&width=200",
      supplier: "CannaSweets",
      rating: 4.6,
      popularity: "Media",
      cbdContent: 10,
      stockUnit: "unidad",
    },
    {
      id: "mp-3",
      name: "Vaporizador Portátil Pro",
      description: "Vaporizador de alta calidad con control preciso de temperatura y batería de larga duración.",
      category: "vaper",
      type: "Dispositivo",
      costPrice: 45.0,
      recommendedPrice: 79.99,
      margin: 77.8,
      image: "/placeholder.svg?height=200&width=200",
      supplier: "VapeTech",
      rating: 4.9,
      popularity: "Alta",
      stockUnit: "unidad",
    },
    {
      id: "mp-4",
      name: "Aceite CBD Full Spectrum",
      description: "Aceite CBD de espectro completo, 1000mg, extraído con CO2.",
      category: "extractos",
      type: "CBD",
      costPrice: 28.5,
      recommendedPrice: 49.99,
      margin: 75.4,
      image: "/placeholder.svg?height=200&width=200",
      supplier: "PureExtract",
      rating: 4.7,
      popularity: "Alta",
      cbdContent: 1000,
      stockUnit: "ml",
    },
    {
      id: "mp-5",
      name: "Girl Scout Cookies",
      description: "Híbrido premium con sabores dulces y efectos eufóricos y relajantes.",
      category: "flores",
      type: "Híbrida",
      costPrice: 9.0,
      recommendedPrice: 13.5,
      margin: 50.0,
      image: "/placeholder.svg?height=200&width=200",
      supplier: "GreenGrow Farms",
      rating: 4.9,
      popularity: "Alta",
      thcContent: 24.0,
      cbdContent: 0.1,
      stockUnit: "g",
    },
    {
      id: "mp-6",
      name: "Grinder de 4 piezas",
      description: "Grinder premium de aluminio con recogedor de polen y compartimento de almacenamiento.",
      category: "accesorios",
      type: "Accesorio",
      costPrice: 12.0,
      recommendedPrice: 19.99,
      margin: 66.6,
      image: "/placeholder.svg?height=200&width=200",
      supplier: "SmokeGear",
      rating: 4.5,
      popularity: "Media",
      stockUnit: "unidad",
    },
    {
      id: "mp-7",
      name: "Hash Marroquí Premium",
      description: "Hash tradicional marroquí de alta calidad con aroma intenso y efectos potentes.",
      category: "hash",
      type: "Indica",
      costPrice: 7.5,
      recommendedPrice: 12.0,
      margin: 60.0,
      image: "/placeholder.svg?height=200&width=200",
      supplier: "MoroccanFinest",
      rating: 4.7,
      popularity: "Alta",
      thcContent: 30.0,
      cbdContent: 0.5,
      stockUnit: "g",
    },
  ]

  // Función para añadir un producto del marketplace al inventario
  const handleAddToInventory = (product: MarketplaceProduct) => {
    setAddingProductId(product.id)

    // Simulamos una pequeña demora para mostrar el estado de carga
    setTimeout(() => {
      // Convertimos el producto del marketplace al formato de producto del inventario
      const newProduct = {
        name: product.name,
        description: product.description,
        category: product.category,
        type: product.type,
        price: product.recommendedPrice,
        costPrice: product.costPrice,
        stock: 0, // Inicialmente sin stock
        stockUnit: product.stockUnit,
        status: "out_of_stock",
        image: product.image,
        thc: product.thcContent,
        cbd: product.cbdContent,
      }

      // Añadimos el producto al inventario
      addProduct(newProduct)

      // Mostramos notificación de éxito
      toast({
        title: "Producto añadido al inventario",
        description: `${product.name} ha sido añadido a tu inventario. Recuerda actualizar el stock cuando recibas el producto.`,
        variant: "default",
      })

      setAddingProductId(null)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground">Productos recomendados que puedes añadir a tu inventario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketplaceProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-primary">{product.popularity}</Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.category} - {product.type}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Proveedor: {product.supplier}</p>
                      <p>Valoración: {product.rating}/5</p>
                      {product.thcContent && <p>THC: {product.thcContent}%</p>}
                      {product.cbdContent && <p>CBD: {product.cbdContent}mg</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p className="mt-2 text-sm line-clamp-2">{product.description}</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <Tag className="h-4 w-4 mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Compra</span>
                  <span className="font-medium">${product.costPrice.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <DollarSign className="h-4 w-4 mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Venta</span>
                  <span className="font-medium">${product.recommendedPrice.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <TrendingUp className="h-4 w-4 mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Margen</span>
                  <span className="font-medium">{product.margin.toFixed(1)}%</span>
                </div>
              </div>

              <Button
                className="w-full mt-4"
                onClick={() => handleAddToInventory(product)}
                disabled={addingProductId === product.id}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {addingProductId === product.id ? "Añadiendo..." : "Añadir a inventario"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
