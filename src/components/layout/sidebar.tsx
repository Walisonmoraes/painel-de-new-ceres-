"use client"

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Home, 
  Settings, 
  BarChart2, 
  Users, 
  LogOut, 
  CalendarDays, 
  FileText, 
  PieChart,
  CircleUserRound,
  Handshake,
  Building2,
  Menu,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@/lib/supabase"
import { useSidebar } from "@/contexts/sidebar-context"

const menuItems = [
  {
    title: "Dashboard",
    icon: PieChart,
    href: "/",
    hoverAnimation: "hover:rotate-180"
  },
  {
    title: "Clientes",
    icon: Building2,
    href: "/clientes",
    hoverAnimation: "hover:-translate-y-2 hover:scale-125"
  },
  {
    title: "Programação",
    icon: CalendarDays,
    href: "/programacao",
    hoverAnimation: "hover:rotate-[360deg]"
  },
  {
    title: "Visita Comercial",
    icon: Handshake,
    href: "/visita-comercial",
    hoverAnimation: "hover:scale-150 hover:-rotate-12"
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: "/relatorios",
    hoverAnimation: "hover:scale-125 hover:rotate-6"
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
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createBrowserClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <>
      <button 
        onClick={toggle}
        className={cn(
          "fixed top-4 z-50 transition-all duration-300 bg-background hover:bg-muted p-2 rounded-lg",
          isOpen ? "left-56" : "left-4"
        )}
      >
        {isOpen ? (
          <ChevronLeft className="w-6 h-6 transition-transform duration-700 ease-in-out" />
        ) : (
          <Menu className="w-6 h-6 transition-transform duration-700 ease-in-out" />
        )}
      </button>
      
      <div className={cn(
        "fixed top-0 left-0 h-screen bg-background border-r transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}>
        <div className="flex flex-col h-full">
          <div className={cn(
            "p-6 overflow-hidden whitespace-nowrap",
            !isOpen && "text-center"
          )}>
            <h1 className="text-2xl font-bold">SmartGest</h1>
            <p className={cn(
              "text-sm text-muted-foreground transition-opacity duration-300",
              !isOpen && "opacity-0"
            )}>Gestão inteligente</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
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
      </div>
    </>
  )
}
