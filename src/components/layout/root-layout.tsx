"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const { isOpen } = useSidebar()

  if (isLoginPage) {
    return children
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "flex-1 min-h-screen py-6",
        isOpen ? "ml-64" : "ml-16"
      )}>
        {children}
      </main>
    </div>
  )
}
