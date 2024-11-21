"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  CalendarDays,
  ClipboardList,
  Home,
  Users2,
} from "lucide-react"
import { UsersIcon } from "./icons/users-icon"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      color: "text-sky-500",
    },
    {
      label: "Colaboradores",
      icon: Users2,
      href: "/colaboradores",
      color: "text-violet-500",
    },
    {
      label: "Usuários",
      icon: UsersIcon,
      href: "/usuarios",
      color: "text-pink-700",
    },
    {
      label: "Programação",
      icon: CalendarDays,
      color: "text-orange-700",
      href: "/programacao",
    },
    {
      label: "Empresas",
      icon: Building2,
      color: "text-emerald-500",
      href: "/empresas",
    },
    {
      label: "Relatórios",
      icon: ClipboardList,
      color: "text-blue-500",
      href: "/relatorios",
    },
  ]

  return (
    <div className={cn("space-y-4 py-4 flex flex-col h-full", className)}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">NEW CERES</h2>
      </div>
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/10 rounded-lg transition",
              pathname === route.href ? "bg-white/10" : "transparent",
              route.color
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3")} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
