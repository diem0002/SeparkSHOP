import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createProduct, deleteProduct } from "./actions"
import { redirect } from "next/navigation"

export default async function AdminPage() {
    const session = await auth()

    // Basic protection
    if (!session?.user) {
        redirect("/login")
    }

    // Role protection
    // @ts-ignore
    if (session.user.role !== 'admin') {
        redirect("/gallery")
    }

    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold">Panel de Administración</h1>
                <div className="text-gray-400">
                    Hola, {session.user.email}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form Section */}
                <div className="bg-white/5 p-8 rounded-lg border border-white/10 h-fit">
                    <h2 className="text-2xl font-bold mb-6">Subir Nuevo Producto</h2>
                    {/* @ts-ignore */}
                    <form action={createProduct} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Título</label>
                            <input name="title" required className="w-full bg-black/50 border border-white/10 p-2 rounded text-white" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Precio ($)</label>
                            <input name="price" type="number" step="0.01" required className="w-full bg-black/50 border border-white/10 p-2 rounded text-white" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                            <textarea name="description" rows={3} required className="w-full bg-black/50 border border-white/10 p-2 rounded text-white" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                            <input name="category" placeholder="Ej: Remeras, Medias, Objetos..." required className="w-full bg-black/50 border border-white/10 p-2 rounded text-white" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Imagen</label>
                            <input name="image" type="file" accept="image/*" required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer" />
                        </div>

                        <button type="submit" className="w-full btn mt-4">
                            Publicar Producto
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Inventario ({products.length})</h2>
                    <div className="space-y-4">
                        {products.map((product: any) => (
                            <div key={product.id} className="flex gap-4 p-4 bg-white/5 rounded border border-white/5 items-center">
                                <img src={product.imageUrl} alt={product.title} className="w-16 h-16 object-cover rounded" />
                                <div className="flex-1">
                                    <h3 className="font-bold">{product.title}</h3>
                                    <p className="text-sm text-gray-400">${product.price.toLocaleString()}</p>
                                </div>
                                <div className="text-xs text-green-400 px-2 py-1 bg-green-900/30 rounded">
                                    {product.available ? 'Disponible' : 'Agotado'}
                                </div>
                                {/* @ts-ignore */}
                                <form action={deleteProduct}>
                                    <input type="hidden" name="id" value={product.id} />
                                    <button type="submit" className="text-red-400 hover:text-red-300 transition-colors p-2">
                                        Eliminar
                                    </button>
                                </form>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <p className="text-gray-500 italic">No hay productos subidos aún.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
