import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { AppLayout } from "@/components/layout/root-layout"
import { SidebarProvider } from "@/contexts/sidebar-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NEW CERES - Painel de Programação",
  description: "Painel de programação da NEW CERES",
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
          <Providers>
            <SidebarProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </SidebarProvider>
            <Toaster richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
