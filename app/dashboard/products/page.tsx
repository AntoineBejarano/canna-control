"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Eye } from "lucide-react"
import Image from "next/image"
import { useProducts, type Product } from "@/contexts/product-context"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { EditProductDialog } from "@/components/products/edit-product-dialog"
import { MarketplaceTab } from "@/components/products/marketplace-tab"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function ProductsPage() {
  const { products } = useProducts()
  const { isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [currentView, setCurrentView] = useState<"inventory" | "marketplace">("inventory")

  // Filtrar productos según la búsqueda y la pestaña activa
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && product.category.toLowerCase() === activeTab.toLowerCase()
  })

  // Función para mostrar el estado del producto
  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-500">En stock</Badge>
      case "low_stock":
        return <Badge className="bg-yellow-500">Bajo stock</Badge>
      case "out_of_stock":
        return <Badge className="bg-red-500">Sin stock</Badge>
      default:
        return null
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <div className="flex gap-2">
          {isAdmin() && currentView === "inventory" && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir producto
            </Button>
          )}
        </div>
      </div>

      {/* Pestañas principales: Inventario y Marketplace */}
      <Tabs
        defaultValue="inventory"
        className="space-y-4"
        onValueChange={(value) => setCurrentView(value as "inventory" | "marketplace")}
      >
        <TabsList>
          <TabsTrigger value="inventory">Mi Inventario</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        {/* Contenido de la pestaña Inventario */}
        <TabsContent value="inventory" className="space-y-4">
          <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList className="overflow-auto">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="flores">Flores</TabsTrigger>
                <TabsTrigger value="extractos">Extractos</TabsTrigger>
                <TabsTrigger value="hash">Hash</TabsTrigger>
                <TabsTrigger value="vaper">Vaper</TabsTrigger>
                <TabsTrigger value="comestibles">Comestibles</TabsTrigger>
                <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
                <TabsTrigger value="accesorios">Accesorios</TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <TabsContent value={activeTab} className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No se encontraron productos que coincidan con tu búsqueda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {getStatusBadge(product.status)}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.category} - {product.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${product.price.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              Stock: {product.stock} {product.stockUnit}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm line-clamp-2">{product.description}</p>
                        <div className="mt-4 flex justify-between">
                          {isAdmin() && (
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                              <Edit className="mr-1 h-4 w-4" />
                              Editar
                            </Button>
                          )}
                          <Link href={`/dashboard/products/${product.id}`} passHref>
                            <Button size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              Ver detalles
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Contenido de la pestaña Marketplace */}
        <TabsContent value="marketplace">
          <MarketplaceTab />
        </TabsContent>
      </Tabs>

      {/* Modal para añadir producto */}
      <AddProductDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* Modal para editar producto */}
      {editingProduct && (
        <EditProductDialog
          open={!!editingProduct}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null)
          }}
          product={editingProduct}
        />
      )}
    </div>
  )
}
