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
  Handshake 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@/lib/supabase"

const menuItems = [
  {
    title: "Dashboard",
    icon: PieChart,
    href: "/"
  },
  {
    title: "Programação",
    icon: CalendarDays,
    href: "/programacao"
  },
  {
    title: "Visita Comercial",
    icon: Handshake,
    href: "/visita-comercial"
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: "/relatorios"
  },
  {
    title: "Colaboradores",
    icon: Users,
    href: "/colaboradores"
  },
  {
    title: "Usuários",
    icon: CircleUserRound,
    href: "/usuarios"
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/configuracoes"
  }
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createBrowserClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-background border-r">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold">NEW CERES</h1>
          <p className="text-sm text-muted-foreground">Painel de Programação</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                  pathname === item.href && "text-foreground bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
