'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '../ui/label'
import { Droplet } from 'lucide-react'

export function ControleIrrigation() {
  const [irrigationAutomatique, setIrrigationAutomatique] = useState(false)

  const toggleIrrigation = async () => {
    const nouvelEtat = !irrigationAutomatique
    setIrrigationAutomatique(nouvelEtat)
    
    try {
      const response = await fetch('/api/irrigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actif: nouvelEtat }),
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'état de l\'irrigation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setIrrigationAutomatique(!nouvelEtat) // Revenir à l'état précédent en cas d'erreur
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5" />
          Contrôle de l'Irrigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="irrigation-auto"
            checked={irrigationAutomatique}
            onCheckedChange={toggleIrrigation}
          />
          <Label htmlFor="irrigation-auto">
            Irrigation Automatique {irrigationAutomatique ? 'Activée' : 'Désactivée'}
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}

