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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCashRegister } from "@/contexts/cash-register-context"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

// Esquema de validación con zod
const closeRegisterSchema = z.object({
  finalAmount: z.coerce.number().min(0, { message: "El monto final no puede ser negativo" }),
  observations: z.string().optional(),
})

type CloseRegisterFormValues = z.infer<typeof closeRegisterSchema>

interface CloseRegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloseRegisterDialog({ open, onOpenChange }: CloseRegisterDialogProps) {
  const { currentRegister, closeRegister, getRegisterSummary } = useCashRegister()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular el monto esperado
  const summary = currentRegister ? getRegisterSummary(currentRegister.id) : { totalCashSales: 0 }
  const initialAmount = currentRegister?.initialAmount || 0
  const expectedAmount = initialAmount + summary.totalCashSales

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<CloseRegisterFormValues>({
    resolver: zodResolver(closeRegisterSchema),
    defaultValues: {
      finalAmount: expectedAmount,
      observations: "",
    },
  })

  // Calcular la diferencia en tiempo real
  const finalAmount = form.watch("finalAmount") || 0
  const difference = finalAmount - expectedAmount

  // Manejar el envío del formulario
  const onSubmit = async (data: CloseRegisterFormValues) => {
    if (!currentRegister) return

    setIsSubmitting(true)

    try {
      // Cerrar la caja
      closeRegister(data.finalAmount, data.observations)

      // Mostrar mensaje de éxito
      toast({
        title: "Caja cerrada",
        description: `Se ha cerrado la caja con un monto final de $${data.finalAmount.toFixed(2)}.`,
      })

      // Cerrar el modal y resetear el formulario
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error al cerrar la caja:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al cerrar la caja.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentRegister) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cerrar caja</DialogTitle>
          <DialogDescription>Ingresa el monto final en efectivo para cerrar la caja.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Monto inicial</h4>
                <p className="text-2xl font-bold">${initialAmount.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Ventas en efectivo</h4>
                <p className="text-2xl font-bold">${summary.totalCashSales.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Monto esperado</h4>
              <p className="text-2xl font-bold">${expectedAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Monto inicial + ventas en efectivo</p>
            </div>

            <FormField
              control={form.control}
              name="finalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto final en caja ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Diferencia</h4>
              <p
                className={`text-xl font-bold ${difference > 0 ? "text-green-500" : difference < 0 ? "text-red-500" : ""}`}
              >
                ${difference.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {difference > 0
                  ? "Hay un sobrante en la caja"
                  : difference < 0
                    ? "Hay un faltante en la caja"
                    : "El monto coincide con lo esperado"}
              </p>
            </div>

            {difference !== 0 && (
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explica la razón de la diferencia..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Por favor, explica la razón de la diferencia entre el monto esperado y el monto final.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cerrando...
                  </>
                ) : (
                  "Cerrar caja"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
