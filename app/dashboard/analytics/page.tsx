"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { ProductsChart } from "@/components/dashboard/products-chart"
import { CustomersChart } from "@/components/dashboard/customers-chart"
import { ProfitChart } from "@/components/dashboard/profit-chart"
import { useSales } from "@/contexts/sales-context"

export default function AnalyticsPage() {
  const { getRevenueStats, getCustomerStats, getProductStats, getProfitStats } = useSales()

  // Obtener estadísticas
  const revenueStats = getRevenueStats()
  const customerStats = getCustomerStats()
  const productStats = getProductStats()
  const profitStats = getProfitStats()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Análisis</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar datos
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <DateRangePicker />
      </div>
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Dispensado</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="profit">Excedente</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dispensado total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueStats.total.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+{revenueStats.change}% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Promedio diario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(revenueStats.total / 30).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+5.1% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productStats.total}</div>
                <p className="text-xs text-muted-foreground">+12.2% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(revenueStats.total / productStats.total).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+7.4% respecto al periodo anterior</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de ventas</CardTitle>
              <CardDescription>Visualiza la tendencia de ventas durante el periodo seleccionado.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Productos vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productStats.total}</div>
                <p className="text-xs text-muted-foreground">+{productStats.change}% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Categoría más vendida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Cannabis</div>
                <p className="text-xs text-muted-foreground">65% de las ventas totales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Producto más vendido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">OG Kush</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(productStats.total * 0.25)} unidades vendidas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Margen promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50.0%</div>
                <p className="text-xs text-muted-foreground">+2.1% respecto al periodo anterior</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Productos más vendidos</CardTitle>
              <CardDescription>Análisis de los productos con mayor volumen de ventas.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ProductsChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerStats.total}</div>
                <p className="text-xs text-muted-foreground">+{customerStats.change}% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clientes nuevos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(customerStats.total * 0.15)}</div>
                <p className="text-xs text-muted-foreground">+23.1% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tasa de retención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85.4%</div>
                <p className="text-xs text-muted-foreground">+3.2% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor por cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(revenueStats.total / customerStats.total).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+5.7% respecto al periodo anterior</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Análisis de clientes</CardTitle>
              <CardDescription>Visualiza la distribución y comportamiento de tus clientes.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CustomersChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Excedente total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${profitStats.total.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+{profitStats.change}% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Margen de excedente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50.0%</div>
                <p className="text-xs text-muted-foreground">+1.2% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Costos totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(revenueStats.total - profitStats.total).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+21.5% respecto al periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">91.0%</div>
                <p className="text-xs text-muted-foreground">+3.5% respecto al periodo anterior</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Análisis de excedente</CardTitle>
              <CardDescription>Visualiza la evolución de tu excedente y márgenes.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ProfitChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
