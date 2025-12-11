import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function GalleryPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const paintings = await prisma.painting.findMany({
        where: { available: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container py-12">
            <div className="text-center mb-16 fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Colección
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto text-lg">
                    Explora piezas únicas seleccionadas para inspirar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paintings.map((painting: any, index: number) => (
                    <Link
                        href={`/gallery/${painting.id}`}
                        key={painting.id}
                        className="group block relative"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:-translate-y-2">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    src={painting.imageUrl}
                                    alt={painting.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-sm font-medium tracking-widest text-white/80 mb-2">VER DETALLE</span>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                                <h3 className="text-xl font-bold mb-1 font-heading truncate">{painting.title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm line-clamp-1">{painting.description}</span>
                                    <span className="text-white font-mono bg-white/10 px-3 py-1 rounded-full text-sm">
                                        ${painting.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                {paintings.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No hay obras disponibles en este momento.
                    </div>
                )}
            </div>
        </div>
    )
}
