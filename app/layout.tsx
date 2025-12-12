import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { auth } from '@/auth'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: 'Separk',
  description: 'Ropa y accesorios para patinar',
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
        <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/5 text-white p-4 md:p-6 bg-black/20 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
            <div className="pointer-events-auto">
              <Link href="/" className="text-xl font-bold font-heading tracking-tight">SEPARK.</Link>
            </div>
            <div className="pointer-events-auto flex flex-wrap items-center gap-3 md:gap-6 font-medium text-sm">
              <Link href="/gallery" className="hover:opacity-70 transition-opacity">Tienda</Link>
              {session?.user ? (
                <>
                  {/* @ts-ignore */}
                  {session.user.role === 'admin' && (
                    <Link href="/admin" className="hover:opacity-70 transition-opacity">Admin</Link>
                  )}
                  <div className="hidden md:block w-px h-4 bg-white/20"></div>
                  <span className="text-gray-400 text-xs truncate max-w-[120px] md:max-w-none">{session.user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <Link href="/login" className="hover:opacity-70 transition-opacity">Login</Link>
              )}
            </div>
          </div>
        </nav>
        <main className="min-h-screen pt-32 md:pt-24 pb-12 px-6">
          {children}
        </main>
      </body>
    </html>
  )
}
