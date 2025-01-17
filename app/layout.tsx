import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BarreLaterale } from '../components/barre-laterale'
import { EnteteNavigation } from '../components/entete-navigation'
import { Toaster } from '../components/ui/toaster'
import { ToastProvider } from '../components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'APP3 - Tableau de Bord Agricole',
  description: 'Système de Monitoring Intelligent pour une Agriculture Durable',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ToastProvider>
          <div className="flex h-screen bg-background">
            <BarreLaterale />
            <div className="flex-1 flex flex-col overflow-hidden">
              <EnteteNavigation />
              <div className="flex-1 overflow-y-auto bg-background p-4">
                {children}
              </div>
            </div>
          </div>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}

