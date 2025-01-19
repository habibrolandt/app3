"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CheckCircle, XCircle, Thermometer, Droplets } from "lucide-react"
import { useDonneesTempsReel } from "@/hooks/use-donnees-temps-reel"
import { motion, AnimatePresence } from "framer-motion"

export function StatutCapteurs() {
  const { donnees, isConnected } = useDonneesTempsReel()
  const derniereDonnee = donnees[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>État des Capteurs</span>
          <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {derniereDonnee && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <span>Température</span>
                </div>
                <span className="font-bold">{derniereDonnee.temperature.toFixed(1)}°C</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span>Humidité</span>
                </div>
                <span className="font-bold">{derniereDonnee.humidite.toFixed(1)}%</span>
              </motion.div>

              <div className="text-xs text-gray-500 mt-2">
                Dernière mise à jour: {new Date(derniereDonnee.date).toLocaleTimeString()}
              </div>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

