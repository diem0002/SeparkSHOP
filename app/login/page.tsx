'use client'

import { signIn } from 'next-auth/react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, Loader2, Shield } from 'lucide-react'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showCaptcha, setShowCaptcha] = useState(false)
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const [attempts, setAttempts] = useState(0)
    const turnstileRef = useRef<any>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            if (!email || !password) {
                throw new Error("Por favor completa todos los campos")
            }

            // Check if captcha is required
            if (showCaptcha && !captchaToken) {
                throw new Error("Por favor completa el captcha de seguridad")
            }

            // Verify captcha if present
            if (captchaToken) {
                const verifyRes = await fetch('/api/verify-captcha', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: captchaToken })
                })

                if (!verifyRes.ok) {
                    throw new Error("Verificación de captcha fallida")
                }
            }

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                const newAttempts = attempts + 1
                setAttempts(newAttempts)

                // Show captcha after 3 failed attempts
                if (newAttempts >= 3) {
                    setShowCaptcha(true)
                }

                setError(`Email o contraseña incorrectos. ${Math.max(0, 5 - newAttempts)} intentos restantes.`)
                setCaptchaToken(null)
                turnstileRef.current?.reset()
                setLoading(false)
            } else {
                // Successful login
                setAttempts(0)
                router.refresh()
                window.location.href = '/gallery'
            }
        } catch (err: any) {
            console.error("Login error:", err)
            setError(err.message || 'Ocurrió un error inesperado.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">Bienvenido</h1>
                        <p className="text-gray-400">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm flex items-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field !pl-14 bg-white/5 border-white/10 focus:border-white/50 focus:bg-white/10 rounded-xl h-12"
                                    placeholder="ejemplo@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="input-field !pl-14 bg-white/5 border-white/10 focus:border-white/50 focus:bg-white/10 rounded-xl h-12"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {showCaptcha && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2"
                            >
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                    <Shield className="w-4 h-4" />
                                    <span>Verificación de seguridad requerida</span>
                                </div>
                                <Turnstile
                                    ref={turnstileRef}
                                    siteKey="0x4AAAAAACGI2AWPJRQRjXd3"
                                    onSuccess={(token) => setCaptchaToken(token)}
                                />
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (showCaptcha && !captchaToken)}
                            className="w-full btn h-12 rounded-xl mt-4 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Ingresar
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            ¿No tienes cuenta? <Link href="/register" className="text-white hover:underline underline-offset-4">Regístrate aquí</Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Footer / Copyright */}
            <div className="absolute bottom-6 text-xs text-gray-600">
                © 2025 SEPARK. Sistema Protegido.
            </div>
        </div>
    )
}
