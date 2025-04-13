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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCustomers, type Customer } from "@/contexts/customer-context"
import { Loader2 } from "lucide-react"

// Esquema de validación para el formulario de gestión de saldo
const balanceSchema = z.object({
  amount: z.coerce.number().min(0.01, { message: "El monto debe ser mayor a 0" }),
  type: z.enum(["add", "subtract"], {
    required_error: "Selecciona un tipo de operación",
  }),
  notes: z.string().optional(),
})

type BalanceFormValues = z.infer<typeof balanceSchema>

interface ManageBalanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
}

export function ManageBalanceDialog({ open, onOpenChange, customer }: ManageBalanceDialogProps) {
  const { updateCustomerBalance } = useCustomers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Configurar el formulario
  const form = useForm<BalanceFormValues>({
    resolver: zodResolver(balanceSchema),
    defaultValues: {
      amount: 0,
      type: "add",
      notes: "",
    },
  })

  // Manejar el envío del formulario
  const onSubmit = async (data: BalanceFormValues) => {
    setIsSubmitting(true)

    try {
      // Actualizar el saldo del socio
      updateCustomerBalance(customer.id, data.amount, data.type, data.notes)

      // Cerrar el modal y resetear el formulario
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error al actualizar el saldo:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gestionar saldo</DialogTitle>
          <DialogDescription>
            Gestiona el saldo del socio ajustando el monto y seleccionando el tipo de transacción.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">Saldo actual: ${customer.balance.toFixed(2)}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de operación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="add">Añadir saldo</SelectItem>
                        <SelectItem value="subtract">Restar saldo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input type="number" min="0.01" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ingresa el monto a {form.watch("type") === "add" ? "añadir" : "restar"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Razón del ajuste de saldo..." {...field} />
                    </FormControl>
                    <FormMessage />
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
                    Procesando...
                  </>
                ) : (
                  "Confirmar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
