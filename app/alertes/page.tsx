"use client"

import { useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { AlertTriangle, CheckCircle, XCircle, Bell, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Types
type AlerteType = "urgent" | "warning" | "info"
type AlerteStatus = "active" | "resolved"

interface Alerte {
  id: number
  titre: string
  description: string
  type: AlerteType
  date: string
  status: AlerteStatus
}

// Données initiales
const alertesInitiales: Alerte[] = [
  {
    id: 1,
    titre: "Niveau d'humidité critique",
    description: "Parcelle 2: Niveau d'humidité inférieur à 30%",
    type: "urgent",
    date: "2024-01-12 10:30",
    status: "active",
  },
  {
    id: 2,
    titre: "Maintenance requise",
    description: "Capteur 3: Batterie faible (15%)",
    type: "warning",
    date: "2024-01-12 09:15",
    status: "active",
  },
  {
    id: 3,
    titre: "Irrigation terminée",
    description: "Parcelle 1: Cycle d'irrigation complété avec succès",
    type: "info",
    date: "2024-01-12 08:00",
    status: "resolved",
  },
]

export default function PageAlertes() {
  const [alertes, setAlertes] = useState<Alerte[]>(alertesInitiales)
  const [filtreType, setFiltreType] = useState<AlerteType | "all">("all")
  const [recherche, setRecherche] = useState("")

  const marquerCommeResolu = (id: number) => {
    setAlertes(alertes.map((alerte) => (alerte.id === id ? { ...alerte, status: "resolved" } : alerte)))
  }

  const filtrerAlertes = () => {
    return alertes
      .filter((alerte) => filtreType === "all" || alerte.type === filtreType)
      .filter(
        (alerte) =>
          alerte.titre.toLowerCase().includes(recherche.toLowerCase()) ||
          alerte.description.toLowerCase().includes(recherche.toLowerCase()),
      )
  }

  const alertesFiltrees = filtrerAlertes()

  const getIcone = (type: AlerteType) => {
    switch (type) {
      case "urgent":
        return <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0" />
      case "info":
        return <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
    }
  }

  const getStatusClass = (status: AlerteStatus) => {
    return status === "active" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Alertes</h1>
        <Button onClick={() => alert("Fonctionnalité à implémenter")}>
          <Bell className="h-4 w-4 mr-2" />
          Configurer les notifications
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher des alertes..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filtreType}
          onChange={(e) => setFiltreType(e.target.value as AlerteType | "all")}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="all">Tous les types</option>
          <option value="urgent">Urgent</option>
          <option value="warning">Avertissement</option>
          <option value="info">Information</option>
        </select>
      </div>

      <AnimatePresence>
        {alertesFiltrees.map((alerte) => (
          <motion.div
            key={alerte.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-4 overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                {getIcone(alerte.type)}

                <div className="flex-1">
                  <h3 className="font-semibold">{alerte.titre}</h3>
                  <p className="text-sm text-gray-500">{alerte.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(alerte.status)}`}>
                      {alerte.status === "active" ? "Active" : "Résolue"}
                    </span>
                    <span className="text-xs text-gray-400">{alerte.date}</span>
                  </div>
                </div>

                {alerte.status === "active" && (
                  <Button variant="outline" size="sm" onClick={() => marquerCommeResolu(alerte.id)}>
                    Marquer comme résolu
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {alertesFiltrees.length === 0 && (
        <div className="text-center text-gray-500 mt-8">Aucune alerte ne correspond à vos critères de recherche.</div>
      )}
    </div>
  )
}

