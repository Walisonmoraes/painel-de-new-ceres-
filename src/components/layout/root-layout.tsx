"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { ThemeToggle } from "@/components/theme-toggle"

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
        "flex-1",
        isOpen ? "ml-64" : "ml-16"
      )}>
        <div className="flex justify-end items-center h-14 px-6 border-b">
          <ThemeToggle />
        </div>
        <div className="container max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
