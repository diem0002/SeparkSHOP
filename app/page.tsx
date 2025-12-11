import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center text-center relative">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="fade-in relative z-10">
        <span className="text-sm font-mono text-gray-400 tracking-[0.3em] uppercase mb-4 block">
          EST. 2025
        </span>
        <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
          SKATE <br /> CULTURE.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Más que ropa, una identidad. <br />
          Diseñado para patinar, creado para durar.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link href="/gallery" className="btn h-14 px-8 text-lg rounded-full group">
            <span className="mr-2">Ver Productos</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="px-8 py-4 text-gray-300 hover:text-white transition-colors border-b border-transparent hover:border-white/20">
            Acceso Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
