'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Sun, Cloud, CloudRain } from 'lucide-react'

const previsions = [
  { jour: 'Lun', icon: Sun, temp: '22°C' },
  { jour: 'Mar', icon: Cloud, temp: '20°C' },
  { jour: 'Mer', icon: CloudRain, temp: '18°C' },
  { jour: 'Jeu', icon: Sun, temp: '23°C' },
  { jour: 'Ven', icon: Cloud, temp: '21°C' },
]

export function PrevisionMeteo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévisions Météo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {previsions.map((jour) => (
            <div key={jour.jour} className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-500">{jour.jour}</span>
              <jour.icon className="h-8 w-8 text-blue-500 my-2" />
              <span className="text-sm font-bold">{jour.temp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

