'use client'

import { registerUser } from "./actions"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Lock, Mail, Loader2, UserPlus, CheckCircle } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.')
            setLoading(false)
            return
        }

        try {
            const result = await registerUser(formData)

            // @ts-ignore
            if (result?.error) {
                // @ts-ignore
                setError(result.error)
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } catch (err) {
            setError('Ocurrió un error al registrarse.')
        } finally {
            if (!success) setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-12 rounded-3xl text-center max-w-md w-full border-green-500/20"
                >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">¡Registro Exitoso!</h2>
                    <p className="text-gray-400">Tu cuenta ha sido creada correctamente. Redirigiendo al login...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <UserPlus className="w-6 h-6 text-gray-300" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">Crear Cuenta</h1>
                        <p className="text-gray-400 text-sm">Únete a nuestra exclusiva comunidad de arte</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-sm flex items-center gap-2 mb-4"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field !pl-14 bg-white/5 border-white/10 focus:border-white/50 focus:bg-white/10 rounded-xl h-11"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="input-field !pl-14 bg-white/5 border-white/10 focus:border-white/50 focus:bg-white/10 rounded-xl h-11"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="input-field !pl-14 bg-white/5 border-white/10 focus:border-white/50 focus:bg-white/10 rounded-xl h-11"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full btn h-12 rounded-xl mt-6 group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    <>
                                        Registrarse
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            ¿Ya tienes cuenta? <Link href="/login" className="text-white hover:underline underline-offset-4 font-medium">Ingresar</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
