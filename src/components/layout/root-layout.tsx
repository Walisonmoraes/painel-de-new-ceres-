"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return children
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>
    </div>
  )
}
