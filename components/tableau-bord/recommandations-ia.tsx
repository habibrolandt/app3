'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Lightbulb } from 'lucide-react'

const recommandations = [
  "Réduire l'irrigation de la parcelle 2 de 10% cette semaine",
  "Vérifier le capteur d'humidité de la parcelle 3",
  "Envisager la récolte de la parcelle 1 dans les 7 prochains jours",
]

export function RecommandationsIA() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>Recommandations IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommandations.map((reco, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="font-bold text-green-600">{index + 1}.</span>
              <span>{reco}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

