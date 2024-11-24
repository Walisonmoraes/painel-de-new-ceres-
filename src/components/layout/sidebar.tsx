"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, LogOut, Home, Settings, BarChart2, Users, CalendarDays, FileText, PieChart, CircleUserRound, Handshake, Building2, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSidebar } from "@/contexts/sidebar-context"
import { createBrowserClient } from "@/lib/supabase"

const menuItems = [
  {
    title: "Dashboard",
    icon: PieChart,
    href: "/",
    hoverAnimation: "hover:rotate-180"
  },
  {
    title: "Visita Comercial",
    icon: Handshake,
    href: "/visita-comercial",
    hoverAnimation: "hover:scale-150 hover:-rotate-12"
  },
  {
    title: "Programação",
    icon: CalendarDays,
    href: "/programacao",
    hoverAnimation: "hover:rotate-[360deg]"
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: "/relatorios",
    hoverAnimation: "hover:scale-125 hover:rotate-6"
  },
  {
    title: "Clientes",
    icon: Building2,
    href: "/clientes",
    hoverAnimation: "hover:-translate-y-2 hover:scale-125"
  },
  {
    title: "Colaboradores",
    icon: Users,
    href: "/colaboradores",
    hoverAnimation: "hover:scale-125 hover:translate-x-2"
  },
  {
    title: "Usuários",
    icon: CircleUserRound,
    href: "/usuarios",
    hoverAnimation: "hover:scale-125 hover:-rotate-180"
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/configuracoes",
    hoverAnimation: "hover:rotate-90 hover:scale-125"
  }
]

export function Sidebar() {
  const { isOpen, toggle } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        <div className={cn(
          "p-6 overflow-hidden whitespace-nowrap border-b flex items-center",
          !isOpen && "justify-center"
        )}>
          {isOpen ? (
            <>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">SmartGest</h1>
                <p className={cn(
                  "text-sm text-muted-foreground transition-opacity duration-300"
                )}>Gestão inteligente</p>
              </div>
              <button
                onClick={toggle}
                className="transition-all duration-300 hover:bg-muted p-2 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-700 ease-in-out" />
              </button>
            </>
          ) : (
            <button
              onClick={toggle}
              className="transition-all duration-300 hover:bg-muted p-2 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 transition-transform duration-700 ease-in-out rotate-180" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-700",
                  pathname === item.href && "text-foreground bg-muted",
                  !isOpen && "justify-center"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-700 ease-in-out transform",
                    item.hoverAnimation,
                    "group-hover:text-primary",
                    pathname === item.href && "text-primary scale-125"
                  )} />
                </div>
                <span className={cn(
                  "transition-all duration-700 ease-in-out group-hover:font-medium group-hover:translate-x-2 overflow-hidden whitespace-nowrap",
                  !isOpen && "w-0 opacity-0"
                )}>
                  {item.title}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className={cn(
              "group flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-700",
              !isOpen && "justify-center"
            )}
          >
            <div className="relative">
              <LogOut className="w-5 h-5 transition-all duration-700 ease-in-out transform group-hover:scale-125 group-hover:-rotate-45 group-hover:translate-x-2 group-hover:text-destructive" />
            </div>
            <span className={cn(
              "transition-all duration-700 ease-in-out group-hover:font-medium group-hover:translate-x-2 group-hover:text-destructive overflow-hidden whitespace-nowrap",
              !isOpen && "w-0 opacity-0"
            )}>
              Sair
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
