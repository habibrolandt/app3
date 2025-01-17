'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CheckCircle, XCircle } from 'lucide-react'
import { utiliserDonneesCapteurs } from '../../hooks/utiliser-donnes-capteurs'
import { motion, AnimatePresence } from 'framer-motion'

export function StatutCapteurs() {
  const donneesCapteurs = utiliserDonneesCapteurs()

  return (
    <Card>
      <CardHeader>
        <CardTitle>État des Capteurs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <AnimatePresence>
            {Array.from(donneesCapteurs.entries()).map(([id, donnees]) => (
              <motion.li
                key={id}
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Capteur {id}</span>
                  <span className="text-sm text-muted-foreground">
                    {donnees.type === 'temperature' ? 'Température' : 
                     donnees.type === 'humidite' ? 'Humidité' : 
                     'Vent'} - {donnees.valeur}
                    {donnees.type === 'temperature' ? '°C' : 
                     donnees.type === 'humidite' ? '%' : 
                     'km/h'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(donnees.horodatage).toLocaleTimeString()}
                  </span>
                  {Date.now() - new Date(donnees.horodatage).getTime() < 60000 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </CardContent>
    </Card>
  )
}

