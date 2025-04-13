"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useProducts, type Product } from "@/contexts/product-context"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/ui/image-upload"

// Esquema de validación con zod
const productSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  category: z.string().min(1, { message: "Selecciona una categoría" }),
  type: z.string().min(1, { message: "Selecciona un tipo" }),
  thc: z.coerce.number().min(0).max(100).optional(),
  cbd: z.coerce.number().min(0).max(100).optional(),
  price: z.coerce.number().min(0.01, { message: "El precio debe ser mayor que 0" }),
  costPrice: z.coerce.number().min(0.01, { message: "El precio de costo debe ser mayor que 0" }),
  stock: z.coerce.number().min(0, { message: "El stock no puede ser negativo" }),
  stockUnit: z.string().min(1, { message: "Selecciona una unidad de stock" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  image: z.string().default("/placeholder.svg?height=200&width=400"),
  status: z.enum(["in_stock", "low_stock", "out_of_stock"]).default("in_stock"),
  featured: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productSchema>

interface EditProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
  const { updateProduct } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      type: product.type,
      thc: product.thc,
      cbd: product.cbd,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      stockUnit: product.stockUnit,
      description: product.description,
      image: product.image,
      status: product.status,
      featured: product.featured || false,
    },
  })

  // Manejar el envío del formulario
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)

    try {
      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar el producto
      updateProduct(product.id, data)

      // Cerrar el modal
      onOpenChange(false)
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Actualiza la información del producto.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sección de imagen */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen del producto</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Sube una imagen del producto. Recomendado: 400x200px</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del producto</FormLabel>
                    <FormControl>
                      <Input placeholder="OG Kush" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flores">Flores</SelectItem>
                        <SelectItem value="extractos">Extractos</SelectItem>
                        <SelectItem value="hash">Hash</SelectItem>
                        <SelectItem value="vaper">Vaper</SelectItem>
                        <SelectItem value="comestibles">Comestibles</SelectItem>
                        <SelectItem value="bebidas">Bebidas</SelectItem>
                        <SelectItem value="accesorios">Accesorios</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Indica">Indica</SelectItem>
                        <SelectItem value="Sativa">Sativa</SelectItem>
                        <SelectItem value="Híbrida">Híbrida</SelectItem>
                        <SelectItem value="CBD">CBD</SelectItem>
                        <SelectItem value="Dispositivo">Dispositivo</SelectItem>
                        <SelectItem value="Accesorio">Accesorio</SelectItem>
                        <SelectItem value="Concentrado">Concentrado</SelectItem>
                        <SelectItem value="Tradicional">Tradicional</SelectItem>
                        <SelectItem value="Extraído con agua">Extraído con agua</SelectItem>
                        <SelectItem value="Solventless">Solventless</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad de stock</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una unidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="g">Gramos (g)</SelectItem>
                        <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                        <SelectItem value="unidades">Unidades</SelectItem>
                        <SelectItem value="paquetes">Paquetes</SelectItem>
                        <SelectItem value="ml">Mililitros (ml)</SelectItem>
                        <SelectItem value="l">Litros (l)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de venta</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="15.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de costo</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="8.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in_stock">En stock</SelectItem>
                        <SelectItem value="low_stock">Bajo stock</SelectItem>
                        <SelectItem value="out_of_stock">Sin stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="thc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>THC (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="100" placeholder="20.0" {...field} />
                    </FormControl>
                    <FormDescription>Opcional para productos de cannabis</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cbd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CBD (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="100" placeholder="0.5" {...field} />
                    </FormControl>
                    <FormDescription>Opcional para productos de cannabis</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el producto..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Destacado</FormLabel>
                    <FormDescription>
                      Marca este producto como destacado para mostrarlo en la página principal.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
