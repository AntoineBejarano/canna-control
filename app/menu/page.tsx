import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Cannabis } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Cannabis className="h-6 w-6" />
            <span>CannaControl</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar productos..." className="w-[300px] pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrito</span>
            </Button>
            <Button>Iniciar sesión</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuestro Menú</h1>
            <p className="text-muted-foreground">Explora nuestra selección de productos premium de cannabis.</p>
          </div>
          <div className="relative md:hidden mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar productos..." className="w-full pl-8" />
          </div>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="flex overflow-auto pb-2">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="indica">Indica</TabsTrigger>
              <TabsTrigger value="sativa">Sativa</TabsTrigger>
              <TabsTrigger value="hybrid">Híbrida</TabsTrigger>
              <TabsTrigger value="edibles">Comestibles</TabsTrigger>
              <TabsTrigger value="beverages">Bebidas</TabsTrigger>
              <TabsTrigger value="accessories">Accesorios</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Destacados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Card className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image src="/placeholder.svg?height=200&width=400" alt="OG Kush" fill className="object-cover" />
                      <Badge className="absolute top-2 right-2 bg-green-500">Destacado</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">OG Kush</h3>
                          <p className="text-sm text-muted-foreground">Indica</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">$15.00/g</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-yellow-500">★★★★☆</span>
                            <span className="text-xs text-muted-foreground ml-1">(42)</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm line-clamp-2">
                        Una cepa clásica con aroma terroso y efectos relajantes.
                      </p>
                      <Button className="w-full mt-4">Añadir al carrito</Button>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Blue Dream"
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">Destacado</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">Blue Dream</h3>
                          <p className="text-sm text-muted-foreground">Híbrida</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">$14.00/g</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-yellow-500">★★★★★</span>
                            <span className="text-xs text-muted-foreground ml-1">(56)</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm line-clamp-2">
                        Híbrida equilibrada con sabor a bayas y efectos creativos.
                      </p>
                      <Button className="w-full mt-4">Añadir al carrito</Button>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Gummies CBD"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">Gummies CBD</h3>
                          <p className="text-sm text-muted-foreground">Comestibles</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">$25.00</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-yellow-500">★★★★☆</span>
                            <span className="text-xs text-muted-foreground ml-1">(28)</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm line-clamp-2">
                        Deliciosas gomitas con CBD para alivio sin efectos psicoactivos.
                      </p>
                      <Button className="w-full mt-4">Añadir al carrito</Button>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Bebida Relajante"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">Bebida Relajante</h3>
                          <p className="text-sm text-muted-foreground">Bebidas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">$18.00</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-yellow-500">★★★★☆</span>
                            <span className="text-xs text-muted-foreground ml-1">(19)</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm line-clamp-2">
                        Bebida refrescante con CBD para relajación y bienestar.
                      </p>
                      <Button className="w-full mt-4">Añadir al carrito</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2025 CannaControl. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Términos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
