'use client'

import { cn } from '../lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Map, ActivitySquare, Bell, Settings, Users, Leaf, MessageSquare, AlertTriangle, Battery } from 'lucide-react'
import { motion } from 'framer-motion'

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
  { icon: Map, label: 'Carte des parcelles', href: '/carte' },
  { icon: ActivitySquare, label: 'Analyse des capteurs', href: '/capteurs' },
  { icon: Bell, label: 'Alertes', href: '/alertes' },


  { icon: Battery, label: 'Énergie', href: '/energie' },
  { icon: AlertTriangle, label: 'Anomalies', href: '/anomalies' },

  { icon: Users, label: 'Profil', href: '/profil' },
]

export function BarreLaterale() {
  const pathname = usePathname()

  return (
    <motion.div 
      className="w-64 bg-card border-r border-border p-4 flex flex-col gap-2"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          APP3
        </motion.h1>
        <motion.p 
          className="text-sm text-muted-foreground"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Monitoring Intelligent
        </motion.p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <item.icon 
                  className={cn(
                    'h-5 w-5 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  )} 
                />
                {item.label}
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </motion.div>
  )
}

