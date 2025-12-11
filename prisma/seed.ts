import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@artgallery.com'
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            role: 'admin',
        },
    })

    console.log({ user })

    const products = [
        {
            title: "Separk Classic Tee - Black",
            description: "Remera de algodón 100% heavy weight con logo clásico en el pecho.",
            price: 25000,
            imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop"
        },
        {
            title: "Oversized Hoodie - Grey",
            description: "Buzo canguro oversized, ideal para patinar en invierno.",
            price: 45000,
            imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=2080&auto=format&fit=crop"
        },
        {
            title: "Separk Deck - 8.25",
            description: "Tabla de maple canadiense 7 láminas. Concave medio.",
            price: 60000,
            imageUrl: "https://images.unsplash.com/photo-1595467959689-53fdc76cbdf8?q=80&w=2069&auto=format&fit=crop"
        }
    ]

    for (const p of products) {
        // @ts-ignore
        await prisma.product.create({
            data: p
        })
    }
    console.log("Seeded products")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
