'use client'

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium text-gray-300"
        >
            <LogOut className="w-4 h-4" />
            Salir
        </button>
    )
}
