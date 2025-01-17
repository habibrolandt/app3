import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BarreLaterale } from '../components/barre-laterale'
import { EnteteNavigation } from '../components/entete-navigation'
import { Toaster } from '../components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'APP3 - Tableau de Bord Agricole',
  description: 'Système de Monitoring Intelligent pour une Agriculture Durable',
}

export default function Disposition({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <BarreLaterale />
          <div className="flex-1 flex flex-col overflow-hidden">
            <EnteteNavigation />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}

