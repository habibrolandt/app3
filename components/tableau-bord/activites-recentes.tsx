'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const activites = [
  { date: '2023-06-01', description: 'Irrigation de la parcelle 1' },
  { date: '2023-06-02', description: 'Maintenance du capteur 3' },
  { date: '2023-06-03', description: 'Alerte: Niveau d\'eau bas' },
  { date: '2023-06-04', description: 'Mise à jour du système' },
]

export function ActivitesRecentes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {activites.map((activite, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{activite.date}</span>
              <span>{activite.description}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

