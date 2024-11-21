import { Sidebar } from "@/components/layout/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="flex justify-end p-4 border-b">
          <ThemeToggle />
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
