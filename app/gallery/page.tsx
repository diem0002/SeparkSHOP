'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

export default function GalleryPage() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("Todas")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data)
                // Extract unique categories
                const uniqueCategories = Array.from(new Set(data.map((p: any) => p.category)))
                setCategories(uniqueCategories as string[])
                setLoading(false)
            })
    }, [])

    const filteredProducts = selectedCategory === "Todas"
        ? products
        : products.filter(p => p.category === selectedCategory)

    if (loading) {
        return (
            <div className="container py-12 text-center">
                <p className="text-gray-400">Cargando productos...</p>
            </div>
        )
    }

    return (
        <div className="container py-12">
            <div className="text-center mb-16 fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">
                    Separk.
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto text-lg">
                    Ropa y accesorios para patinar.
                </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                <button
                    onClick={() => setSelectedCategory("Todas")}
                    className={`px-6 py-2 rounded-full transition-all ${selectedCategory === "Todas"
                            ? "bg-cyan-400 text-black font-semibold"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                >
                    Todas
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full transition-all ${selectedCategory === cat
                                ? "bg-cyan-400 text-black font-semibold"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product: any, index: number) => (
                    <Link
                        href={`/gallery/${product.id}`}
                        key={product.id}
                        className="group block relative"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(125,211,252,0.2)] group-hover:-translate-y-2">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-sm font-medium tracking-widest text-white/80 mb-2">VER DETALLE</span>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                                        {product.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-1 font-heading truncate">{product.title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm line-clamp-1">{product.description}</span>
                                    <span className="text-white font-mono bg-white/10 px-3 py-1 rounded-full text-sm">
                                        ${product.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No hay productos en esta categoría.
                    </div>
                )}
            </div>
        </div>
    )
}
