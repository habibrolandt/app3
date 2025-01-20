"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Progress } from "../../components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Wheat, Sprout, Flower2, DropletIcon, Maximize2, Minimize2, Search, Power, ArrowUpDown } from "lucide-react"
import MapClient from "./map-client"

const getCultureIcon = (culture: string) => {
  switch (culture) {
    case "Blé":
      return Wheat
    case "Maïs":
      return Sprout
    case "Tournesol":
      return Flower2
    default:
      return Sprout
  }
}

const getHumiditeColor = (humidite: number) => {
  if (humidite >= 65) return "bg-green-500"
  if (humidite >= 45) return "bg-yellow-500"
  return "bg-red-500"
}

export default function PageCarte() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"humidite" | "surface" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [parcelles, setParcelles] = useState([
    {
      id: 1,
      nom: "Parcelle 1",
      surface: "2.5 hectares",
      culture: "Blé",
      irrigation: "Active",
      humidite: 65,
      dernierArrosage: "2024-01-19",
      prochaineIrrigation: "2024-01-21",
      description: "Parcelle principale de blé avec système d'irrigation automatisé.",
    },
    {
      id: 2,
      nom: "Parcelle 2",
      surface: "3.2 hectares",
      culture: "Maïs",
      irrigation: "Inactive",
      humidite: 45,
      dernierArrosage: "2024-01-18",
      prochaineIrrigation: "2024-01-20",
      description: "Culture de maïs en rotation, irrigation temporairement suspendue.",
    },
    {
      id: 3,
      nom: "Parcelle 3",
      surface: "1.8 hectares",
      culture: "Tournesol",
      irrigation: "Active",
      humidite: 70,
      dernierArrosage: "2024-01-19",
      prochaineIrrigation: "2024-01-22",
      description: "Parcelle expérimentale de tournesols avec monitoring avancé.",
    },
  ])

  const filteredParcelles = parcelles
    .filter(
      (parcelle) =>
        parcelle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcelle.culture.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortBy) return 0
      if (sortBy === "humidite") {
        return sortOrder === "asc" ? a.humidite - b.humidite : b.humidite - a.humidite
      }
      if (sortBy === "surface") {
        const surfaceA = Number.parseFloat(a.surface)
        const surfaceB = Number.parseFloat(b.surface)
        return sortOrder === "asc" ? surfaceA - surfaceB : surfaceB - surfaceA
      }
      return 0
    })

  const handleSort = (type: "humidite" | "surface") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(type)
      setSortOrder("desc")
    }
  }

  const toggleIrrigation = (id: number) => {
    setParcelles(
      parcelles.map((parcelle) =>
        parcelle.id === id
          ? { ...parcelle, irrigation: parcelle.irrigation === "Active" ? "Inactive" : "Active" }
          : parcelle,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Carte des Parcelles</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une parcelle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" onClick={() => handleSort("humidite")} className="gap-2">
            <DropletIcon className="h-4 w-4" />
            Trier par humidité
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleSort("surface")} className="gap-2">
            <Maximize2 className="h-4 w-4" />
            Trier par surface
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AnimatePresence>
          {filteredParcelles.map((parcelle) => {
            const CultureIcon = getCultureIcon(parcelle.culture)
            const isExpanded = expandedCard === parcelle.id

            return (
              <motion.div
                key={parcelle.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CultureIcon className="h-5 w-5 text-green-600" />
                        <span>{parcelle.nom}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedCard(isExpanded ? null : parcelle.id)}
                      >
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-gray-500">Surface</dt>
                          <dd className="font-medium">{parcelle.surface}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Culture</dt>
                          <dd className="font-medium">{parcelle.culture}</dd>
                        </div>
                      </dl>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Humidité du sol</span>
                          <span className="text-sm font-medium">{parcelle.humidite}%</span>
                        </div>
                        <Progress value={parcelle.humidite} className={getHumiditeColor(parcelle.humidite)} />
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4 pt-4 border-t"
                          >
                            <p className="text-sm text-gray-600">{parcelle.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <dt className="text-gray-500">Dernier arrosage</dt>
                                <dd className="font-medium">{parcelle.dernierArrosage}</dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">Prochaine irrigation</dt>
                                <dd className="font-medium">{parcelle.prochaineIrrigation}</dd>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-between pt-4">
                        <Button
                          variant={parcelle.irrigation === "Active" ? "default" : "secondary"}
                          size="sm"
                          className="w-full"
                          onClick={() => toggleIrrigation(parcelle.id)}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          {parcelle.irrigation === "Active" ? "Désactiver" : "Activer"} l'irrigation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <Card className="h-[600px]">
        <CardContent className="p-0">
          <MapClient />
        </CardContent>
      </Card>
    </div>
  )
}

