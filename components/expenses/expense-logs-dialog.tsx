"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useExpenses } from "@/contexts/expenses-context"

export function ExpenseLogsDialog() {
  const [open, setOpen] = useState(false)
  const { expenseLogs } = useExpenses()

  // Ordenar logs por fecha (más reciente primero)
  const sortedLogs = [...expenseLogs].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  // Función para obtener el color según la acción
  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "text-green-600"
      case "update":
        return "text-blue-600"
      case "delete":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Función para traducir la acción
  const translateAction = (action: string) => {
    switch (action) {
      case "create":
        return "Creación"
      case "update":
        return "Actualización"
      case "delete":
        return "Eliminación"
      default:
        return action
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historial de gastos</DialogTitle>
          <DialogDescription>Registro de todas las operaciones realizadas en los gastos.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log) => (
                <div key={log.id} className="rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${getActionColor(log.action)}`}>{translateAction(log.action)}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(log.timestamp), "dd/MM/yyyy HH:mm:ss")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{log.details}</p>
                  {log.action === "update" && (
                    <div className="mt-2 text-xs">
                      <details>
                        <summary className="cursor-pointer font-medium">Ver cambios</summary>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <h4 className="font-medium">Antes</h4>
                            <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-100 p-2 dark:bg-gray-800">
                              {JSON.stringify(log.previousData, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-medium">Después</h4>
                            <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-100 p-2 dark:bg-gray-800">
                              {JSON.stringify(log.newData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No hay registros de operaciones.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
