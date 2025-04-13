import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Cannabis, Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Datos de ejemplo para el producto
const product = {
  id: 1,
  name: "OG Kush",
  category: "Cannabis",
  type: "Indica",
  thc: 24.5,
  cbd: 0.1,
  price: 15.0,
  description:
    "OG Kush es una cepa clásica con un aroma terroso y efectos relajantes. Es conocida por su potencia y su capacidad para aliviar el estrés y el dolor. Sus efectos son principalmente físicos, proporcionando una sensación de relajación profunda y bienestar.",
  effects: ["Relajante", "Eufórico", "Feliz", "Somnoliento"],
  flavors: ["Terroso", "Pino", "Cítrico"],
  medicalUses: ["Estrés", "Dolor", "Insomnio", "Ansiedad"],
  negativeEffects: ["Boca seca", "Ojos secos", "Paranoia"],
  rating: 4.8,
  reviews: 42,
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600&text=2",
    "/placeholder.svg?height=600&width=600&text=3",
  ],
  relatedProducts: [
    {
      id: 2,
      name: "Blue Dream",
      category: "Cannabis",
      type: "Híbrida",
      thc: 18.0,
      cbd: 0.2,
      price: 14.0,
      image: "/placeholder.svg?height=200&width=400",
      rating: 4.5,
      reviews: 56,
    },
    {
      id: 3,
      name: "Girl Scout Cookies",
      category: "Cannabis",
      type: "Híbrida",
      thc: 22.0,
      cbd: 0.5,
      price: 18.0,
      image: "/placeholder.svg?height=200&width=400",
      rating: 4.7,
      reviews: 38,
    },
    {
      id: 4,
      name: "Sour Diesel",
      category: "Cannabis",
      type: "Sativa",
      thc: 20.0,
      cbd: 0.2,
      price: 16.0,
      image: "/placeholder.svg?height=200&width=400",
      rating: 4.6,
      reviews: 45,
    },
  ],
}

export default function ProductDetailPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Cannabis className="h-6 w-6" />
            <span>CannaControl</span>
          </Link>
          <div className="flex items-center gap-4">
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
            <Link
              href="/menu"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al menú
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border cursor-pointer"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{product.category}</Badge>
                    <Badge variant="secondary">{product.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : i < product.rating
                                ? "text-yellow-500 fill-yellow-500 opacity-50"
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">por gramo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">En stock</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                      <span className="text-sm text-muted-foreground">THC</span>
                      <span className="text-xl font-bold">{product.thc}%</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                      <span className="text-sm text-muted-foreground">CBD</span>
                      <span className="text-xl font-bold">{product.cbd}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="rounded-r-none">
                        -
                      </Button>
                      <div className="w-12 text-center">1</div>
                      <Button variant="ghost" size="icon" className="rounded-l-none">
                        +
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">gramos</span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Añadir al carrito</Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">Añadir a favoritos</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-sm">{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="mt-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="effects">Efectos</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Sabores</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor, index) => (
                      <Badge key={index} variant="outline">
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Usos medicinales</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.medicalUses.map((use, index) => (
                      <Badge key={index} variant="outline">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="effects" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Efectos positivos</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.effects.map((effect, index) => (
                      <Badge key={index} variant="outline">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Efectos negativos</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.negativeEffects.map((effect, index) => (
                      <Badge key={index} variant="outline">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Reseñas de clientes</h3>
                  <Button>Escribir una reseña</Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="font-medium">JP</span>
                          </div>
                          <div>
                            <p className="font-medium">Juan Pérez</p>
                            <p className="text-sm text-muted-foreground">12 de marzo, 2025</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 - index ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        {index === 0 &&
                          "Excelente producto, los efectos son justo como se describen. Muy relajante y perfecto para el estrés después de un largo día."}
                        {index === 1 &&
                          "Buen producto, aunque el sabor no es tan intenso como esperaba. Los efectos son buenos y duraderos."}
                        {index === 2 &&
                          "Me encanta este producto, definitivamente lo compraré de nuevo. El aroma es increíble y los efectos son perfectos."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{relatedProduct.name}</h3>
                        <p className="text-sm text-muted-foreground">{relatedProduct.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${relatedProduct.price.toFixed(2)}/g</p>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-yellow-500">★★★★☆</span>
                          <span className="text-xs text-muted-foreground ml-1">({relatedProduct.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Ver detalles</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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
