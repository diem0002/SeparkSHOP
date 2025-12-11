import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function PaintingDetailPage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const { id } = await params; // Next.js 15 params are promises
    const painting = await prisma.painting.findUnique({
        where: { id }
    })

    if (!painting) return <div>Cuadro no encontrado</div>

    // WhatsApp Link Logic
    const phoneNumber = "5491112345678" // Replace with actual number
    const message = `Hola! Me interesa comprar el cuadro "${painting.title}". Link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/gallery/${painting.id}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    return (
        <div className="container py-12 min-h-screen flex flex-col md:flex-row gap-12 items-center justify-center fade-in">
            <div className="w-full md:w-1/2 aspect-[3/4] relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                <img
                    src={painting.imageUrl}
                    alt={painting.title}
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="w-full md:w-1/2 space-y-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{painting.title}</h1>
                    <p className="text-2xl text-gray-400 font-light">${painting.price.toFixed(2)}</p>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                    {painting.description}
                </p>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn text-lg w-full md:w-auto px-8 py-4 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                >
                    Comprar en WhatsApp
                </a>

                <div className="pt-8">
                    <Link href="/gallery" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Volver a la galería
                    </Link>
                </div>
            </div>
        </div>
    )
}
