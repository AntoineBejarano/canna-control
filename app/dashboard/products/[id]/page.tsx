"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useProducts, type Product } from "@/contexts/product-context"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getProductById, deleteProduct } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      const productId = Number(params.id)
      const foundProduct = getProductById(productId)

      if (foundProduct) {
        setProduct(foundProduct)
      }

      setIsLoading(false)
    }
  }, [params.id, getProductById])

  // Asegurarse de que la función handleDelete en la página de detalle del producto esté correctamente implementada

  // Modificar la función handleDelete para incluir un console.log y asegurarse de que se ejecuta correctamente
  const handleDelete = () => {
    console.log("Eliminando producto:", product?.id)
    if (product) {
      deleteProduct(product.id)
      console.log("Producto eliminado, redirigiendo...")
      router.push("/dashboard/products")
    }
  }

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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Cargando producto...</h1>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Producto no encontrado</h1>
        </div>
        <p>El producto que estás buscando no existe o ha sido eliminado.</p>
        <Button onClick={() => router.push("/dashboard/products")}>Volver a productos</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          {/* El botón de eliminar debe estar configurado así: */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el producto {product.name} de tu
                  inventario.
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 overflow-hidden">
          <div className="relative aspect-square w-full">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Información básica</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Categoría:</dt>
                    <dd>{product.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Tipo:</dt>
                    <dd>{product.type}</dd>
                  </div>
                  {product.thc !== undefined && (
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">THC:</dt>
                      <dd>{product.thc}%</dd>
                    </div>
                  )}
                  {product.cbd !== undefined && (
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">CBD:</dt>
                      <dd>{product.cbd}%</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Estado:</dt>
                    <dd>{getStatusBadge(product.status)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Destacado:</dt>
                    <dd>{product.featured ? "Sí" : "No"}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Precios e inventario</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Precio de venta:</dt>
                    <dd className="font-bold">${product.price.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Precio de costo:</dt>
                    <dd>${product.costPrice.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Margen:</dt>
                    <dd>{(((product.price - product.costPrice) / product.costPrice) * 100).toFixed(1)}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Stock actual:</dt>
                    <dd>
                      {product.stock} {product.stockUnit}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Fecha de creación:</dt>
                    <dd>{new Date(product.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Etiquetas</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de edición */}
      {product && <EditProductDialog open={showEditDialog} onOpenChange={setShowEditDialog} product={product} />}
    </div>
  )
}
