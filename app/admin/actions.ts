'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'


const productSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().min(0),
})

export async function createProduct(formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const image = formData.get('image') as File

    if (!image) {
        throw new Error('Image is required')
    }

    const validatedFields = productSchema.safeParse({
        title,
        description,
        price,
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    // Upload to Vercel Blob
    const { put } = await import('@vercel/blob')
    const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`

    const blob = await put(filename, image, {
        access: 'public',
    })

    const imageUrl = blob.url

    await prisma.product.create({
        data: {
            ...validatedFields.data,
            imageUrl,
        },
    })

    revalidatePath('/gallery')
    revalidatePath('/admin')
    redirect('/admin')
}

export async function deleteProduct(formData: FormData) {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const id = formData.get('id') as string
    if (!id) return

    await prisma.product.delete({
        where: { id }
    })

    revalidatePath('/gallery')
    revalidatePath('/admin')
}
