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

    const paintings = [
        {
            title: "Neon Dreams",
            description: "A cyberpunk vision of a future metropolis.",
            price: 1200,
            imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Abstract Flow",
            description: "Exploration of fluid dynamics in oil.",
            price: 850,
            imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1976&auto=format&fit=crop"
        },
        {
            title: "Geometric Soul",
            description: "Minimalist study of shapes and shadows.",
            price: 2100,
            imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1974&auto=format&fit=crop"
        }
    ]

    for (const p of paintings) {
        await prisma.painting.create({
            data: p
        })
    }
    console.log("Seeded paintings")
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
