import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { AppLayout } from "@/components/layout/root-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartGest",
  description: "Sistema de gestão inteligente",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </SidebarProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
