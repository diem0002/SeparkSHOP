import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { auth } from '@/auth'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: 'Art Gallery',
  description: 'Exclusive art collection',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/5 text-white p-4 md:p-6 flex justify-between items-center bg-black/20 backdrop-blur-md">
          <div className="pointer-events-auto">
            <Link href="/" className="text-xl font-bold font-heading tracking-tight">ART.</Link>
          </div>
          <div className="pointer-events-auto flex items-center gap-4 md:gap-6 font-medium text-sm md:text-base">
            <Link href="/gallery" className="hover:opacity-70 transition-opacity">Galería</Link>
            {session?.user ? (
              <>
                <Link href="/admin" className="hover:opacity-70 transition-opacity">Admin</Link>
                <div className="w-px h-4 bg-white/20"></div>
                <LogoutButton />
              </>
            ) : (
              <Link href="/login" className="hover:opacity-70 transition-opacity">Login</Link>
            )}
          </div>
        </nav>
        <main className="min-h-screen pt-24 pb-12 px-6">
          {children}
        </main>
      </body>
    </html>
  )
}
