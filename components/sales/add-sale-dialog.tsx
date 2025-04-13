"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form } from "@/components/ui/form"
import { useSales } from "@/contexts/sales-context"
import { useProducts, type Product } from "@/contexts/product-context"
// Importar el contexto de clientes
import { useCustomers } from "@/contexts/customer-context"
import {
  Loader2,
  Plus,
  Trash2,
  DollarSign,
  CreditCard,
  BanknoteIcon,
  Package,
  Search,
  Leaf,
  Coffee,
  Wine,
  ShoppingBag,
  Pill,
} from "lucide-react"
import { format } from "date-fns"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  paymentMethod: z.enum(["cash", "card", "transfer", "balance"], {
    required_error: "Selecciona un método de pago",
  }),
  status: z.enum(["completed", "pending", "cancelled"], {
    required_error: "Selecciona un estado",
  }),
  notes: z.string().optional(),
  total: z.coerce.number().min(0),
  paymentNotes: z.string().optional(),
})

type SaleFormValues = z.infer<typeof saleSchema>

interface AddSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSaleDialog({ open, onOpenChange }: AddSaleDialogProps) {
  const { addSale } = useSales()
  const { products } = useProducts()
  // Obtener la función updateCustomerBalance
  const { customers, updateCustomerBalance } = useCustomers()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [currentStep, setCurrentStep] = useState<"customer" | "products" | "payment">("customer")
  const [customerSearch, setCustomerSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [productSearch, setProductSearch] = useState("")

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      customerId: "",
      customerName: "",
      items: [],
      paymentMethod: "cash",
      status: "completed",
      notes: "",
      total: 0,
      paymentNotes: "",
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
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

  // Filtrar clientes según la búsqueda
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch),
  )

  // Filtrar productos según la categoría y búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Obtener categorías únicas de productos
  const productCategories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  // Añadir producto a la venta
  const addProductToSale = (product: Product, grams?: number) => {
    // Si es un producto que se vende por peso (gramos)
    if (grams) {
      const existingItemIndex = watchItems.findIndex((item) => item.productId === product.id)

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si el producto ya está en la lista
        const newQuantity = watchItems[existingItemIndex].quantity + grams
        form.setValue(`items.${existingItemIndex}.quantity`, newQuantity)
        // El precio es por gramo, así que el total es simplemente cantidad * precio
        form.setValue(`items.${existingItemIndex}.total`, newQuantity * product.price)
      } else {
        // Añadir nuevo producto con cantidad en gramos
        append({
          productId: product.id,
          quantity: grams,
          price: product.price,
          total: grams * product.price,
        })
      }
    } else {
      // Para productos que no se venden por peso (unidades)
      const existingItemIndex = watchItems.findIndex((item) => item.productId === product.id)

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si el producto ya está en la lista
        const newQuantity = watchItems[existingItemIndex].quantity + 1
        form.setValue(`items.${existingItemIndex}.quantity`, newQuantity)
        form.setValue(`items.${existingItemIndex}.total`, newQuantity * product.price)
      } else {
        // Añadir nuevo producto
        append({
          productId: product.id,
          quantity: 1,
          price: product.price,
          total: product.price,
        })
      }
    }
  }

  // Calcular precio por gramos
  const calculatePriceByGrams = (product: Product, grams: number) => {
    // Precio por gramo = precio por unidad / 1000 (asumiendo que la unidad es kg)
    const pricePerGram = product.price / 1000
    return pricePerGram * grams
  }

  // Manejar el envío del formulario
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

      // Modificar la función onSubmit para usar el saldo del cliente si está disponible
      // Buscar la sección donde se procesa la venta y añadir:

      // Si hay un cliente seleccionado y el método de pago es efectivo, ofrecer usar el saldo
      if (data.customerId && data.paymentMethod === "cash") {
        const customerId = Number(data.customerId)
        const customer = customers.find((c) => c.id === customerId)

        if (customer && customer.balance > 0) {
          // Si el cliente tiene saldo suficiente para cubrir toda la compra
          if (customer.balance >= data.total) {
            // Usar el saldo del cliente
            updateCustomerBalance(customerId, data.total, false)
            data.paymentMethod = "balance"
            data.paymentNotes = `Pago con saldo de cliente: $${data.total.toFixed(2)}`
          }
          // Si el cliente tiene saldo pero no es suficiente, ofrecer pago parcial
          else if (customer.balance > 0) {
            const remainingAmount = data.total - customer.balance
            // Usar todo el saldo disponible
            updateCustomerBalance(customerId, customer.balance, false)
            data.paymentNotes = `Pago parcial con saldo ($${customer.balance.toFixed(2)}) + efectivo ($${remainingAmount.toFixed(2)})`
          }
        }
      }

      // Añadir la venta
      addSale(saleData)

      // Cerrar el modal y resetear el formulario
      onOpenChange(false)
      form.reset()
      setCurrentStep("customer")
    } catch (error) {
      console.error("Error al añadir la venta:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Renderizar opciones de método de pago con iconos
  const renderPaymentOptions = () => (
    <div className="flex gap-2 mt-2">
      <Button
        type="button"
        variant={form.watch("paymentMethod") === "cash" ? "default" : "outline"}
        className={`flex-1 h-16 ${form.watch("paymentMethod") === "cash" ? "bg-green-600 hover:bg-green-700" : ""}`}
        onClick={() => form.setValue("paymentMethod", "cash")}
      >
        <div className="flex flex-col items-center gap-1">
          <DollarSign className="h-6 w-6" />
          <span className="text-xs">Efectivo</span>
        </div>
      </Button>
      <Button
        type="button"
        variant={form.watch("paymentMethod") === "card" ? "default" : "outline"}
        className={`flex-1 h-16 ${form.watch("paymentMethod") === "card" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
        onClick={() => form.setValue("paymentMethod", "card")}
      >
        <div className="flex flex-col items-center gap-1">
          <CreditCard className="h-6 w-6" />
          <span className="text-xs">Tarjeta</span>
        </div>
      </Button>
      <Button
        type="button"
        variant={form.watch("paymentMethod") === "transfer" ? "default" : "outline"}
        className={`flex-1 h-16 ${form.watch("paymentMethod") === "transfer" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
        onClick={() => form.setValue("paymentMethod", "transfer")}
      >
        <div className="flex flex-col items-center gap-1">
          <BanknoteIcon className="h-6 w-6" />
          <span className="text-xs">Transferencia</span>
        </div>
      </Button>
    </div>
  )

  // Obtener icono según la categoría del producto
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "cannabis":
        return <Leaf className="h-5 w-5" />
      case "comestibles":
        return <Coffee className="h-5 w-5" />
      case "bebidas":
        return <Wine className="h-5 w-5" />
      case "accesorios":
        return <ShoppingBag className="h-5 w-5" />
      case "cbd":
        return <Pill className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  // Renderizar tarjeta de cliente
  const renderCustomerCard = (customer: (typeof customers)[0]) => (
    <Card
      key={customer.id}
      className={`cursor-pointer hover:border-primary transition-colors ${form.watch("customerId") === customer.id.toString() ? "border-primary bg-primary/10" : ""}`}
      onClick={() => {
        form.setValue("customerId", customer.id.toString())
        updateCustomerName(customer.id.toString())
        setCurrentStep("products")
      }}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="bg-primary/20 rounded-full w-10 h-10 flex items-center justify-center text-primary font-bold">
          {customer.avatar || customer.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-medium">{customer.name}</div>
          <div className="text-sm text-muted-foreground">{customer.email}</div>
          <div className="text-xs text-muted-foreground">{customer.phone}</div>
        </div>
        <Badge variant={customer.type === "medical" ? "secondary" : "outline"}>
          {customer.type === "medical" ? "Médico" : "Recreativo"}
        </Badge>
      </CardContent>
    </Card>
  )

  // Renderizar tarjeta de producto
  const renderProductCard = (product: Product) => {
    const isWeightBased = product.stockUnit === "g" || product.stockUnit === "kg"

    return (
      <Card key={product.id} className="cursor-pointer hover:border-primary transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(product.category)}
            <span className="font-medium">{product.name}</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <Badge variant="outline">{product.type}</Badge>
            <div className="font-bold">
              ${product.price.toFixed(2)}/{isWeightBased ? "g" : product.stockUnit}
            </div>
          </div>

          {isWeightBased ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" variant="outline" type="button" onClick={() => addProductToSale(product, 1)}>
                  1g
                </Button>
                <Button size="sm" variant="outline" type="button" onClick={() => addProductToSale(product, 3.5)}>
                  3.5g
                </Button>
                <Button size="sm" variant="outline" type="button" onClick={() => addProductToSale(product, 7)}>
                  7g
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" type="button" onClick={() => addProductToSale(product, 14)}>
                  14g
                </Button>
                <Button size="sm" variant="outline" type="button" onClick={() => addProductToSale(product, 28)}>
                  28g
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  placeholder="Gramos"
                  className="h-8"
                  min="0.1"
                  step="0.1"
                  id={`custom-grams-${product.id}`}
                />
                <Button
                  size="sm"
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(`custom-grams-${product.id}`) as HTMLInputElement
                    const grams = Number.parseFloat(input.value)
                    if (!isNaN(grams) && grams > 0) {
                      addProductToSale(product, grams)
                      input.value = ""
                    }
                  }}
                >
                  Añadir
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Cantidad"
                className="h-8"
                min="1"
                step="1"
                defaultValue="1"
                id={`custom-quantity-${product.id}`}
              />
              <Button
                type="button"
                onClick={() => {
                  const input = document.getElementById(`custom-quantity-${product.id}`) as HTMLInputElement
                  const quantity = Number.parseInt(input.value)
                  if (!isNaN(quantity) && quantity > 0) {
                    const existingItemIndex = watchItems.findIndex((item) => item.productId === product.id)

                    if (existingItemIndex >= 0) {
                      const newQuantity = watchItems[existingItemIndex].quantity + quantity
                      form.setValue(`items.${existingItemIndex}.quantity`, newQuantity)
                      form.setValue(`items.${existingItemIndex}.total`, newQuantity * product.price)
                    } else {
                      append({
                        productId: product.id,
                        quantity: quantity,
                        price: product.price,
                        total: quantity * product.price,
                      })
                    }
                    input.value = "1"
                  }
                }}
              >
                Añadir
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Renderizar resumen de productos seleccionados
  const renderSelectedProducts = () => {
    if (watchItems.length === 0) {
      return <div className="text-center py-6 text-muted-foreground">No hay productos seleccionados</div>
    }

    return (
      <div className="space-y-2">
        {watchItems.map((item, index) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) return null

          return (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(product.category || "")}
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.quantity} {product.stockUnit} x ${item.price.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">${item.total.toFixed(2)}</div>
                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Renderizar paso actual
  const renderStep = () => {
    switch (currentStep) {
      case "customer":
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente por nombre, email o teléfono..."
                className="pl-10 h-12"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(renderCustomerCard)
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No se encontraron clientes</div>
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={() => setCurrentStep("products")} disabled={!form.watch("customerId")}>
                Continuar
              </Button>
            </div>
          </div>
        )

      case "products":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar producto..."
                  className="pl-10 h-12"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas las categorías" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h3 className="font-medium mb-2">Productos</h3>
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-2">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(renderProductCard)
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">No se encontraron productos</div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h3 className="font-medium mb-2">Productos seleccionados</h3>
                <Card>
                  <CardContent className="p-4">
                    <ScrollArea className="h-[300px] pr-4">{renderSelectedProducts()}</ScrollArea>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="text-2xl font-bold">${form.watch("total").toFixed(2)}</div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("payment")}
                        disabled={watchItems.length === 0}
                      >
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setCurrentStep("customer")}>
                Atrás
              </Button>
            </div>
          </div>
        )

      case "payment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Resumen de la venta</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{form.watch("customerName")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{form.watch("date")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Productos:</span>
                      <span>{watchItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold">${form.watch("total").toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Método de pago</h4>
                    {renderPaymentOptions()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Productos</h3>
                  <ScrollArea className="h-[200px] pr-4">{renderSelectedProducts()}</ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setCurrentStep("products")}>
                Atrás
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Completar venta"
                )}
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nueva venta
          </DialogTitle>
          <DialogDescription>
            {currentStep === "customer" && "Selecciona un cliente para la venta"}
            {currentStep === "products" && "Añade productos a la venta"}
            {currentStep === "payment" && "Completa los detalles de pago"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6">
            {/* Indicador de pasos */}
            <div className="flex items-center justify-between px-2">
              <div
                className={`flex items-center gap-2 ${currentStep === "customer" ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => (watchItems.length > 0 ? setCurrentStep("customer") : null)}
                style={{ cursor: watchItems.length > 0 ? "pointer" : "default" }}
              >
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === "customer" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  1
                </div>
                <span className="hidden sm:inline">Cliente</span>
              </div>
              <div className="h-0.5 flex-1 bg-muted mx-2" />
              <div
                className={`flex items-center gap-2 ${currentStep === "products" ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => (form.watch("customerId") ? setCurrentStep("products") : null)}
                style={{ cursor: form.watch("customerId") ? "pointer" : "default" }}
              >
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === "products" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  2
                </div>
                <span className="hidden sm:inline">Productos</span>
              </div>
              <div className="h-0.5 flex-1 bg-muted mx-2" />
              <div
                className={`flex items-center gap-2 ${currentStep === "payment" ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => (watchItems.length > 0 ? setCurrentStep("payment") : null)}
                style={{ cursor: watchItems.length > 0 ? "pointer" : "default" }}
              >
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  3
                </div>
                <span className="hidden sm:inline">Pago</span>
              </div>
            </div>

            {renderStep()}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
