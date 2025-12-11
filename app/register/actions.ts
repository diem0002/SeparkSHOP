'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { redirect } from "next/navigation"

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function registerUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validated = registerSchema.safeParse({ email, password })

    if (!validated.success) {
        return { error: 'Datos inválidos' }
    }

    // Check if exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return { error: 'Email ya registrado' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: 'user', // Default to user
        },
    })

    redirect('/login')
}
