"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react"
import { useProducts, type Product } from "@/contexts/product-context"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { EditProductDialog } from "@/components/products/edit-product-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { TableContainer } from "@/components/ui/table-container"

export default function InventoryPage() {
  const { products, deleteProduct } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)

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

  // Calcular el margen de beneficio
  const calculateMargin = (price: number, costPrice: number) => {
    return (((price - costPrice) / costPrice) * 100).toFixed(1) + "%"
  }

  // Manejar la eliminación de un producto
  const handleDelete = () => {
    console.log("Eliminando producto con ID:", deletingProductId)
    if (deletingProductId !== null) {
      deleteProduct(deletingProductId)
      setDeletingProductId(null)
      // Añadir un mensaje de confirmación
      console.log("Producto eliminado correctamente")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir producto
        </Button>
      </div>
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="flores">Flores</TabsTrigger>
            <TabsTrigger value="hash">Hash</TabsTrigger>
            <TabsTrigger value="extractos">Extractos</TabsTrigger>
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
          <Card>
            <CardContent className="p-0">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No se encontraron productos</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    No hay productos que coincidan con tu búsqueda o filtros.
                  </p>
                  <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir producto
                  </Button>
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Precio compra</TableHead>
                        <TableHead>Precio venta</TableHead>
                        <TableHead>Margen</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.stock} {product.stockUnit}
                          </TableCell>
                          <TableCell>${product.costPrice.toFixed(2)}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{calculateMargin(product.price, product.costPrice)}</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menú</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeletingProductId(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
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

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        open={deletingProductId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingProductId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto de tu inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
