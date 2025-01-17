'use client'

import { Bell, Search } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { motion } from 'framer-motion'

export function EnteteNavigation() {
  const { toast } = useToast()

  return (
    <motion.header 
      className="bg-card border-b border-border p-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <motion.div 
            className="relative flex-1 max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Rechercher une parcelle..." 
              className="pl-10"
            />
          </motion.div>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                toast({
                  title: "Nouvelles notifications",
                  description: "Humidité basse détectée sur la parcelle 3",
                })
              }}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">YF</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

