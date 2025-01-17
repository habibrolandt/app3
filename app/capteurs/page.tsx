'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Battery, Droplets, Thermometer, Wind } from 'lucide-react'

const capteurs = [
  {
    id: 1,
    nom: 'Capteur Température',
    icon: Thermometer,
    valeur: '22°C',
    status: 'normal',
    batterie: '85%',
    donnees: [
      { time: '08:00', valeur: 18 },
      { time: '10:00', valeur: 20 },
      { time: '12:00', valeur: 22 },
      { time: '14:00', valeur: 24 },
      { time: '16:00', valeur: 23 },
      { time: '18:00', valeur: 21 },
    ]
  },
  {
    id: 2,
    nom: 'Capteur Humidité',
    icon: Droplets,
    valeur: '65%',
    status: 'attention',
    batterie: '72%',
    donnees: [
      { time: '08:00', valeur: 60 },
      { time: '10:00', valeur: 62 },
      { time: '12:00', valeur: 65 },
      { time: '14:00', valeur: 63 },
      { time: '16:00', valeur: 64 },
      { time: '18:00', valeur: 65 },
    ]
  },
  {
    id: 3,
    nom: 'Capteur Vent',
    icon: Wind,
    valeur: '12 km/h',
    status: 'normal',
    batterie: '90%',
    donnees: [
      { time: '08:00', valeur: 8 },
      { time: '10:00', valeur: 10 },
      { time: '12:00', valeur: 12 },
      { time: '14:00', valeur: 15 },
      { time: '16:00', valeur: 14 },
      { time: '18:00', valeur: 12 },
    ]
  },
]

export default function PageCapteurs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Analyse des Capteurs
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {capteurs.map((capteur) => (
          <Card key={capteur.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <capteur.icon className="h-5 w-5 text-gray-500" />
                  <span>{capteur.nom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{capteur.batterie}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-2xl font-bold">
                  {capteur.valeur}
                </div>
                <div className={`text-sm ${
                  capteur.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {capteur.status === 'normal' ? 'Normal' : 'Attention requise'}
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={capteur.donnees}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="valeur" 
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

