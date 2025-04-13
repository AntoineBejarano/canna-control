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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCashRegister } from "@/contexts/cash-register-context"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Esquema de validación con zod
const openRegisterSchema = z.object({
  initialAmount: z.coerce.number().min(0.01, { message: "El monto inicial debe ser mayor que 0" }),
})

type OpenRegisterFormValues = z.infer<typeof openRegisterSchema>

interface OpenRegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OpenRegisterDialog({ open, onOpenChange }: OpenRegisterDialogProps) {
  const { openRegister } = useCashRegister()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<OpenRegisterFormValues>({
    resolver: zodResolver(openRegisterSchema),
    defaultValues: {
      initialAmount: 0,
    },
  })

  // Manejar el envío del formulario
  const onSubmit = async (data: OpenRegisterFormValues) => {
    setIsSubmitting(true)

    try {
      // Abrir la caja
      openRegister(data.initialAmount)

      // Mostrar mensaje de éxito
      toast({
        title: "Caja abierta",
        description: `Se ha abierto la caja con un monto inicial de $${data.initialAmount.toFixed(2)}.`,
      })

      // Cerrar el modal y resetear el formulario
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error al abrir la caja:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al abrir la caja.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Abrir caja</DialogTitle>
          <DialogDescription>Ingresa el monto inicial en efectivo para abrir la caja.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="initialAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto inicial ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    Abriendo...
                  </>
                ) : (
                  "Abrir caja"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
