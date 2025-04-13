"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableContainer } from "@/components/ui/table-container"
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog"
import { useToast } from "@/components/ui/use-toast"

// Datos simulados de empleados
const initialEmployees = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    role: "admin",
    status: "active",
    avatar: "JP",
    position: "Gerente",
    hireDate: "15/01/2023",
    lastActive: "Hoy, 10:30 AM",
  },
  {
    id: 2,
    name: "María García",
    email: "maria.garcia@ejemplo.com",
    role: "employee",
    status: "active",
    avatar: "MG",
    position: "Vendedor",
    hireDate: "03/03/2023",
    lastActive: "Hoy, 09:15 AM",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@ejemplo.com",
    role: "employee",
    status: "inactive",
    avatar: "CR",
    position: "Vendedor",
    hireDate: "10/05/2023",
    lastActive: "Ayer, 16:45 PM",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    role: "employee",
    status: "active",
    avatar: "AM",
    position: "Inventario",
    hireDate: "22/07/2023",
    lastActive: "Hoy, 11:20 AM",
  },
  {
    id: 5,
    name: "Luis Sánchez",
    email: "luis.sanchez@ejemplo.com",
    role: "employee",
    status: "active",
    avatar: "LS",
    position: "Vendedor",
    hireDate: "05/09/2023",
    lastActive: "Ayer, 14:30 PM",
  },
]

interface Employee {
  id: number
  name: string
  email: string
  role: string
  status: string
  avatar: string
  position: string
  hireDate: string
  lastActive: string
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const { toast } = useToast()

  // Filtrar empleados según la búsqueda
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Función para mostrar el rol del empleado
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Administrador</Badge>
      case "employee":
        return <Badge variant="outline">Empleado</Badge>
      default:
        return null
    }
  }

  // Función para mostrar el estado del empleado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Activo</Badge>
      case "inactive":
        return <Badge className="bg-yellow-500">Inactivo</Badge>
      default:
        return null
    }
  }

  // Función para añadir un nuevo empleado
  const handleAddEmployee = (newEmployee: Omit<Employee, "id" | "avatar" | "lastActive">) => {
    // Generar avatar a partir de las iniciales
    const nameParts = newEmployee.name.split(" ")
    const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0].substring(0, 2)

    // Crear nuevo empleado con ID generado
    const employee: Employee = {
      id: employees.length + 1,
      avatar: initials.toUpperCase(),
      lastActive: "Nunca",
      ...newEmployee,
    }

    // Añadir a la lista de empleados
    setEmployees([...employees, employee])

    // Guardar en localStorage para persistencia
    localStorage.setItem("employees", JSON.stringify([...employees, employee]))
  }

  // Función para cambiar el estado de un empleado
  const toggleEmployeeStatus = (id: number) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.id === id) {
        const newStatus = emp.status === "active" ? "inactive" : "active"
        return { ...emp, status: newStatus }
      }
      return emp
    })

    setEmployees(updatedEmployees)
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))

    const employee = employees.find((emp) => emp.id === id)
    const newStatus = employee?.status === "active" ? "inactive" : "active"

    toast({
      title: `Estado actualizado`,
      description: `${employee?.name} ahora está ${newStatus === "active" ? "activo" : "inactivo"}.`,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <AddEmployeeDialog onAddEmployee={handleAddEmployee} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar empleados..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha contratación</TableHead>
                  <TableHead className="hidden md:table-cell">Última actividad</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${employee.avatar}`} />
                          <AvatarFallback>{employee.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{getRoleBadge(employee.role)}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.hireDate}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.lastActive}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem
                            className={
                              employee.status === "active"
                                ? "text-destructive focus:text-destructive"
                                : "text-green-600 focus:text-green-600"
                            }
                            onClick={() => toggleEmployeeStatus(employee.id)}
                          >
                            {employee.status === "active" ? "Desactivar" : "Activar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  )
}
