// Datos de usuario de ejemplo
export const mockUser = {
  id: 1,
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  password: "password123", // En una aplicación real, nunca almacenar contraseñas en texto plano
  role: "admin",
  avatar: "JP",
  dispensary: {
    id: 1,
    name: "Green Leaf Dispensary",
    address: "123 Main St, Ciudad Verde",
    type: "both", // medical, recreational, both
    license: "CAN-12345-REC",
    phone: "+34 612 345 678",
  },
}

// Añadir el usuario empleado a los datos simulados existentes
export const mockEmployeeUser = {
  id: 2,
  name: "María García",
  email: "empleado@ejemplo.com",
  password: "employee", // Esto es solo para simulación, nunca almacenar contraseñas en texto plano
  role: "employee",
  avatar: "MG",
  dispensary: {
    id: 1,
    name: "Green Leaf Dispensary",
    address: "123 Main St, Ciudad Verde",
    type: "both",
    license: "CAN-12345-REC",
    phone: "+34 612 345 678",
  },
}

// Datos de notificaciones
export const mockNotifications = [
  {
    id: 1,
    title: "Inventario bajo",
    message: "El producto 'OG Kush' está por debajo del umbral mínimo de stock.",
    date: "2025-03-14T10:30:00",
    read: false,
    type: "warning",
  },
  {
    id: 2,
    title: "Nueva venta",
    message: "Se ha registrado una nueva venta por $134.99.",
    date: "2025-03-14T09:15:00",
    read: false,
    type: "success",
  },
  {
    id: 3,
    title: "Nuevo cliente",
    message: "María López se ha registrado como cliente.",
    date: "2025-03-13T16:45:00",
    read: true,
    type: "info",
  },
  {
    id: 4,
    title: "Actualización del sistema",
    message: "Se ha lanzado una nueva versión del sistema con mejoras de rendimiento.",
    date: "2025-03-12T11:20:00",
    read: true,
    type: "info",
  },
]

// Datos de estadísticas del dashboard
export const mockDashboardStats = {
  revenue: {
    total: 45231.89,
    change: 20.1,
  },
  customers: {
    total: 2350,
    change: 10.1,
  },
  products: {
    total: 12234,
    change: 19.0,
  },
  profit: {
    total: 15231.89,
    change: 15.0,
  },
}
