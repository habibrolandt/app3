"use client"

import { useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

type Severite = "haute" | "moyenne" | "basse"
type Status = "en_cours" | "resolu"

interface Anomalie {
  id: number
  titre: string
  description: string
  severite: Severite
  status: Status
  date: string
  resolution: string
}

const anomaliesInitiales: Anomalie[] = [
  {
    id: 1,
    titre: "Dysfonctionnement Capteur",
    description: "Capteur de température parcelle 2 hors service",
    severite: "haute",
    status: "en_cours",
    date: "2024-01-12 09:30",
    resolution: "Technicien programmé pour intervention",
  },
  {
    id: 2,
    titre: "Irrigation Anormale",
    description: "Surconsommation d'eau détectée sur parcelle 1",
    severite: "moyenne",
    status: "en_cours",
    date: "2024-01-12 08:45",
    resolution: "Vérification du système d'irrigation en cours",
  },
  {
    id: 3,
    titre: "Niveau de batterie critique",
    description: "Batterie faible sur plusieurs capteurs",
    severite: "basse",
    status: "resolu",
    date: "2024-01-11 15:20",
    resolution: "Batteries remplacées",
  },
]

export default function PageAnomalies() {
  const [anomalies, setAnomalies] = useState<Anomalie[]>(anomaliesInitiales)
  const [filtreSeverite, setFiltreSeverite] = useState<Severite | "toutes">("toutes")
  const [filtreStatus, setFiltreStatus] = useState<Status | "tous">("tous")

  const filtrerAnomalies = () => {
    return anomalies.filter(
      (anomalie) =>
        (filtreSeverite === "toutes" || anomalie.severite === filtreSeverite) &&
        (filtreStatus === "tous" || anomalie.status === filtreStatus),
    )
  }

  const anomaliesFiltrees = filtrerAnomalies()

  const marquerCommeResolu = (id: number) => {
    setAnomalies(anomalies.map((anomalie) => (anomalie.id === id ? { ...anomalie, status: "resolu" } : anomalie)))
  }

  const getSeveriteStyle = (severite: Severite) => {
    switch (severite) {
      case "haute":
        return "bg-red-100 text-red-500"
      case "moyenne":
        return "bg-yellow-100 text-yellow-500"
      case "basse":
        return "bg-blue-100 text-blue-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Anomalies</h1>
        <div className="flex gap-2">
          <select
            value={filtreSeverite}
            onChange={(e) => setFiltreSeverite(e.target.value as Severite | "toutes")}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="toutes">Toutes les sévérités</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>
          <select
            value={filtreStatus}
            onChange={(e) => setFiltreStatus(e.target.value as Status | "tous")}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="tous">Tous les statuts</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {anomaliesFiltrees.map((anomalie) => (
          <Card key={anomalie.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${getSeveriteStyle(anomalie.severite)}`}>
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{anomalie.titre}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        anomalie.status === "resolu" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {anomalie.status === "resolu" ? "Résolu" : "En cours"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{anomalie.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {anomalie.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {anomalie.resolution}
                    </div>
                  </div>
                  {anomalie.status === "en_cours" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => marquerCommeResolu(anomalie.id)}
                    >
                      Marquer comme résolu
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {anomaliesFiltrees.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Aucune anomalie ne correspond aux critères de filtrage sélectionnés.
        </div>
      )}
    </div>
  )
}

