import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    secret: process.env.AUTH_SECRET || "supersecretkey123",
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/admin');
            const isOnGallery = nextUrl.pathname.startsWith('/gallery');

            if (isOnDashboard) {
                if (isLoggedIn) {
                    // Force type checking or use any for quick access properties
                    // @ts-ignore
                    const userRole = auth.user?.role as string | undefined
                    return userRole === 'admin';
                }
                return false; // Redirect unauthenticated users to login page
            }

            if (isOnGallery) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
        // @ts-ignore
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                // @ts-ignore
                token.role = user.role
            }
            return token
        },
        // @ts-ignore
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.id as string
                // @ts-ignore
                session.user.role = token.role as string
            }
            return session
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
