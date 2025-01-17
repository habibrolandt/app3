'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react'

const anomalies = [
  {
    id: 1,
    titre: 'Dysfonctionnement Capteur',
    description: 'Capteur de température parcelle 2 hors service',
    severite: 'haute',
    status: 'en_cours',
    date: '2024-01-12 09:30',
    resolution: 'Technicien programmé pour intervention',
  },
  {
    id: 2,
    titre: 'Irrigation Anormale',
    description: 'Surconsommation d\'eau détectée sur parcelle 1',
    severite: 'moyenne',
    status: 'en_cours',
    date: '2024-01-12 08:45',
    resolution: 'Vérification du système d\'irrigation en cours',
  },
  {
    id: 3,
    titre: 'Niveau de batterie critique',
    description: 'Batterie faible sur plusieurs capteurs',
    severite: 'basse',
    status: 'resolu',
    date: '2024-01-11 15:20',
    resolution: 'Batteries remplacées',
  },
]

export default function PageAnomalies() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Anomalies
        </h1>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      <div className="space-y-4">
        {anomalies.map((anomalie) => (
          <Card key={anomalie.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  anomalie.severite === 'haute' ? 'bg-red-100' :
                  anomalie.severite === 'moyenne' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <AlertTriangle className={`h-6 w-6 ${
                    anomalie.severite === 'haute' ? 'text-red-500' :
                    anomalie.severite === 'moyenne' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{anomalie.titre}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      anomalie.status === 'resolu' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {anomalie.status === 'resolu' ? 'Résolu' : 'En cours'}
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
