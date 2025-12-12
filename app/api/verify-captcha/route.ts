import { NextRequest, NextResponse } from 'next/server'

const TURNSTILE_SECRET = '0x4AAAAAACGI2NOvkGvQL9dp5uyo7XWaMWk'

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ error: 'Token missing' }, { status: 400 })
        }

        // Verify with Cloudflare
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: TURNSTILE_SECRET,
                response: token,
            }),
        })

        const data = await verifyResponse.json()

        if (data.success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
        }
    } catch (error) {
        console.error('Captcha verification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
