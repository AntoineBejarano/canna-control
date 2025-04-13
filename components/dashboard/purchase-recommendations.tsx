"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProducts } from "@/contexts/product-context"
import { useSales } from "@/contexts/sales-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function PurchaseRecommendations() {
  const { products } = useProducts()
  const { sales } = useSales()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Obtener todas las categorías únicas de productos
  const categories = Array.from(new Set(products.map((product) => product.category)))

  // Función para calcular las ventas de los últimos 3 meses por producto
  const calculateLastThreeMonthsSales = () => {
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    const daysInPeriod = Math.ceil((today.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24))

    // Filtrar ventas de los últimos 3 meses
    const recentSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date)
      return saleDate >= threeMonthsAgo && saleDate <= today && sale.status === "completed"
    })

    // Calcular ventas por producto
    const productSales: Record<
      number,
      {
        quantity: number
        trend: "up" | "down" | "stable"
        recommendation: number
        name: string
        category: string
        currentStock: number
        stockUnit: string
        dailyUsage: number
        daysUntilEmpty: number | null
      }
    > = {}

    // Inicializar con todos los productos
    products.forEach((product) => {
      productSales[product.id] = {
        quantity: 0,
        trend: "stable",
        recommendation: 0,
        name: product.name,
        category: product.category,
        currentStock: product.stock,
        stockUnit: product.stockUnit || "unidades",
        dailyUsage: 0,
        daysUntilEmpty: null,
      }
    })

    // Sumar ventas por producto
    recentSales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity
        }
      })
    })

    // Calcular tendencias, recomendaciones y fechas estimadas
    Object.keys(productSales).forEach((productId) => {
      const id = Number(productId)
      const product = products.find((p) => p.id === id)

      if (!product) return

      const sales = productSales[id].quantity
      const currentStock = product.stock

      // Calcular uso diario promedio (ventas totales / días en el período)
      const dailyUsage = sales / daysInPeriod
      productSales[id].dailyUsage = dailyUsage

      // Calcular días hasta agotamiento
      if (dailyUsage > 0) {
        const daysUntilEmpty = Math.floor(currentStock / dailyUsage)
        productSales[id].daysUntilEmpty = daysUntilEmpty
      }

      // Determinar tendencia basada en ventas vs stock actual
      if (sales > currentStock * 1.2) {
        productSales[id].trend = "up"
      } else if (sales < currentStock * 0.8) {
        productSales[id].trend = "down"
      } else {
        productSales[id].trend = "stable"
      }

      // Calcular recomendación de compra
      if (productSales[id].trend === "up") {
        productSales[id].recommendation = Math.ceil(sales * 1.3) - currentStock
      } else if (productSales[id].trend === "stable") {
        productSales[id].recommendation = Math.ceil(sales) - currentStock
      } else {
        productSales[id].recommendation = Math.ceil(sales * 0.7) - currentStock
      }

      // Si la recomendación es negativa, ponerla a 0
      if (productSales[id].recommendation < 0) {
        productSales[id].recommendation = 0
      }
    })

    return productSales
  }

  const productSales = calculateLastThreeMonthsSales()

  // Filtrar productos por categoría seleccionada
  const filteredProducts = Object.values(productSales).filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory,
  )

  // Calcular totales por categoría para mostrar en las pestañas
  const categoryTotals: Record<string, { count: number; recommendation: number }> = {
    all: { count: 0, recommendation: 0 },
  }

  categories.forEach((category) => {
    categoryTotals[category] = { count: 0, recommendation: 0 }
  })

  Object.values(productSales).forEach((product) => {
    categoryTotals.all.count++
    categoryTotals.all.recommendation += product.recommendation

    if (categoryTotals[product.category]) {
      categoryTotals[product.category].count++
      categoryTotals[product.category].recommendation += product.recommendation
    }
  })

  // Función para renderizar el icono de tendencia
  const renderTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Recomendaciones de compra
        </CardTitle>
        <CardDescription>Basado en las tendencias de ventas de los últimos 3 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all" className="flex items-center gap-1">
              Todos
              <Badge variant="outline">{categoryTotals.all.count}</Badge>
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <Badge variant="outline">{categoryTotals[category]?.count || 0}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div key={`${product.name}-${index}`} className="flex flex-col border-b pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Stock actual: {product.currentStock} {product.stockUnit} | Ventas: {product.quantity}{" "}
                          {product.stockUnit}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderTrendIcon(product.trend)}
                        <div className="text-right">
                          <div className="font-medium">
                            {product.recommendation > 0
                              ? `+${product.recommendation} ${product.stockUnit}`
                              : `0 ${product.stockUnit}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {product.trend === "up"
                              ? "Tendencia al alza"
                              : product.trend === "down"
                                ? "Tendencia a la baja"
                                : "Estable"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fecha estimada de agotamiento o mensaje alternativo */}
                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>
                        {product.currentStock <= 0 ? (
                          "Producto agotado"
                        ) : product.dailyUsage <= 0 ? (
                          "Sin historial de ventas recientes"
                        ) : product.daysUntilEmpty !== null ? (
                          <>
                            Se agotará en aproximadamente {product.daysUntilEmpty} días
                            {` (Uso diario: ~${product.dailyUsage.toFixed(2)} ${product.stockUnit})`}
                          </>
                        ) : (
                          "Sin datos suficientes para estimación"
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">No hay productos en esta categoría</div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Recomendación total:{" "}
          <span className="font-medium">{categoryTotals[selectedCategory]?.recommendation || 0} unidades</span>
        </div>
        <Button size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Generar orden de compra
        </Button>
      </CardFooter>
    </Card>
  )
}
