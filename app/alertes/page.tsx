'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertTriangle, CheckCircle, XCircle, Bell } from 'lucide-react'

const alertes = [
  {
    id: 1,
    titre: 'Niveau d\'humidité critique',
    description: 'Parcelle 2: Niveau d\'humidité inférieur à 30%',
    type: 'urgent',
    date: '2024-01-12 10:30',
    status: 'active'
  },
  {
    id: 2,
    titre: 'Maintenance requise',
    description: 'Capteur 3: Batterie faible (15%)',
    type: 'warning',
    date: '2024-01-12 09:15',
    status: 'active'
  },
  {
    id: 3,
    titre: 'Irrigation terminée',
    description: 'Parcelle 1: Cycle d\'irrigation complété avec succès',
    type: 'info',
    date: '2024-01-12 08:00',
    status: 'resolved'
  },
]

export default function PageAlertes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Alertes
        </h1>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Configurer les notifications
        </Button>
      </div>

      <div className="space-y-4">
        {alertes.map((alerte) => (
          <Card key={alerte.id}>
            <CardContent className="flex items-center gap-4 p-4">
              {alerte.type === 'urgent' && (
                <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
              )}
              {alerte.type === 'warning' && (
                <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0" />
              )}
              {alerte.type === 'info' && (
                <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold">{alerte.titre}</h3>
                <p className="text-sm text-gray-500">{alerte.description}</p>
                <div className="mt-1 text-xs text-gray-400">{alerte.date}</div>
              </div>

              {alerte.status === 'active' && (
                <Button variant="outline" size="sm">
                  Marquer comme résolu
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

