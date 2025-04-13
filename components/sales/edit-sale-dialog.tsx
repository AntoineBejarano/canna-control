"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSales, type Sale } from "@/contexts/sales-context"
import { useProducts } from "@/contexts/product-context"
import { useCustomers } from "@/contexts/customer-context"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"

// Esquema de validación con zod
const saleItemSchema = z.object({
  productId: z.coerce.number().min(1, { message: "Selecciona un producto" }),
  quantity: z.coerce.number().min(0.01, { message: "La cantidad debe ser mayor que 0" }),
  price: z.coerce.number().min(0.01, { message: "El precio debe ser mayor que 0" }),
  total: z.coerce.number().min(0),
})

const saleSchema = z.object({
  date: z.string().min(1, { message: "La fecha es requerida" }),
  customerId: z.string().min(1, { message: "Debes seleccionar un cliente" }),
  customerName: z.string().optional(),
  items: z.array(saleItemSchema).min(1, { message: "Debe agregar al menos un producto" }),
  paymentMethod: z.enum(["cash", "card", "transfer"], {
    required_error: "Selecciona un método de pago",
  }),
  status: z.enum(["completed", "pending", "cancelled"], {
    required_error: "Selecciona un estado",
  }),
  notes: z.string().optional(),
  total: z.coerce.number().min(0),
})

type SaleFormValues = z.infer<typeof saleSchema>

interface EditSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: Sale
}

export function EditSaleDialog({ open, onOpenChange, sale }: EditSaleDialogProps) {
  const { updateSale } = useSales()
  const { products } = useProducts()
  const { customers } = useCustomers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      date: sale.date,
      customerId: sale.customerId?.toString() || "",
      customerName: sale.customerName,
      items: sale.items,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      notes: sale.notes || "",
      total: sale.total,
    },
  })

  // Obtener los valores actuales del formulario
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  // Calcular el total de la venta cuando cambian los items
  const watchItems = form.watch("items")

  useEffect(() => {
    // Asegurarse de que cada item tenga un total calculado correctamente
    const updatedItems = watchItems.map((item) => {
      const quantity = item.quantity || 0
      const price = item.price || 0
      return {
        ...item,
        total: quantity * price,
      }
    })

    // Actualizar los items con los totales correctos
    updatedItems.forEach((item, index) => {
      form.setValue(`items.${index}.total`, item.total)
    })

    // Calcular el total general
    const total = updatedItems.reduce((sum, item) => sum + item.total, 0)
    form.setValue("total", total)
  }, [watchItems, form])

  // Actualizar el precio y total cuando se selecciona un producto
  const updateProductPrice = (index: number, productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const quantity = form.getValues(`items.${index}.quantity`) || 1
      const price = product.price
      const total = price * quantity

      form.setValue(`items.${index}.price`, price)
      form.setValue(`items.${index}.total`, total)
    }
  }

  // Actualizar el total cuando cambia la cantidad o el precio
  const updateItemTotal = (index: number) => {
    const quantity = form.getValues(`items.${index}.quantity`) || 0
    const price = form.getValues(`items.${index}.price`) || 0
    const total = quantity * price

    form.setValue(`items.${index}.total`, total)
  }

  // Actualizar el nombre del cliente cuando se selecciona un ID
  const updateCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id.toString() === customerId)
    if (customer) {
      form.setValue("customerName", customer.name)
    } else {
      form.setValue("customerName", "")
    }
  }

  // Preparar opciones de clientes para el combobox
  const customerOptions = customers.map((customer) => ({
    label: `${customer.name} (${customer.email})`,
    value: customer.id.toString(),
    disabled: customer.status === "inactive",
  }))

  // Mejorar el manejo del envío del formulario para asegurar que los cambios se registren correctamente
  const onSubmit = async (data: SaleFormValues) => {
    setIsSubmitting(true)

    try {
      // Recalcular los totales para asegurarse de que son correctos
      const updatedItems = data.items.map((item) => ({
        ...item,
        total: (item.quantity || 0) * (item.price || 0),
      }))

      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0)

      // Crear el objeto de venta con los totales actualizados
      const saleData = {
        ...data,
        items: updatedItems,
        total: updatedTotal,
      }

      // Actualizar la venta con todos los datos del formulario
      updateSale(sale.id, saleData)

      // Cerrar el modal
      onOpenChange(false)
    } catch (error) {
      console.error("Error al actualizar la venta:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar venta #{sale.id}</DialogTitle>
          <DialogDescription>Modifica los detalles de la venta.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Combobox
                        options={customerOptions}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          updateCustomerName(value)
                        }}
                        placeholder="Seleccionar cliente"
                        emptyMessage="No se encontraron clientes."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de pago</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un método de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="completed">Completada</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Productos</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productId: 0, quantity: 1, price: 0, total: 0 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir producto
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Producto</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(Number.parseInt(value))
                              updateProductPrice(index, Number.parseInt(value))
                            }}
                            value={field.value ? field.value.toString() : "0"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un producto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                  {product.name} (${product.price.toFixed(2)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Cantidad</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              {...field}
                              value={isNaN(field.value) ? "" : field.value}
                              onChange={(e) => {
                                const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                                field.onChange(value)
                                updateItemTotal(index)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Precio</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              {...field}
                              value={isNaN(field.value) ? "" : field.value}
                              onChange={(e) => {
                                const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                                field.onChange(value)
                                updateItemTotal(index)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.total`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Total</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              readOnly
                              {...field}
                              value={isNaN(field.value) ? "0.00" : field.value.toFixed(2)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {form.formState.errors.items?.message && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.items.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales sobre la venta..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <div>
                <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total</FormLabel>
                      <div className="text-2xl font-bold">${isNaN(field.value) ? "0.00" : field.value.toFixed(2)}</div>
                    </FormItem>
                  )}
                />
              </div>

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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
