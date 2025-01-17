'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Battery, Sun, Zap } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const consommationJournaliere = [
  { heure: '00:00', solaire: 0, reseau: 30 },
  { heure: '04:00', solaire: 0, reseau: 25 },
  { heure: '08:00', solaire: 45, reseau: 15 },
  { heure: '12:00', solaire: 75, reseau: 10 },
  { heure: '16:00', solaire: 55, reseau: 12 },
  { heure: '20:00', solaire: 15, reseau: 28 },
]

const statistiques = [
  {
    titre: 'Production Solaire',
    valeur: '250 kWh',
    evolution: '+15%',
    icon: Sun,
    color: 'text-yellow-500',
  },
  {
    titre: 'Consommation Totale',
    valeur: '320 kWh',
    evolution: '-8%',
    icon: Zap,
    color: 'text-blue-500',
  },
  {
    titre: 'Autonomie',
    valeur: '78%',
    evolution: '+5%',
    icon: Battery,
    color: 'text-green-500',
  },
]

export default function PageEnergie() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestion de l'Énergie
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {statistiques.map((stat) => (
          <Card key={stat.titre}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.titre}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.valeur}</div>
              <p className={`text-xs ${
                stat.evolution.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.evolution} par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consommation Journalière</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consommationJournaliere}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="heure" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solaire" name="Énergie Solaire" fill="#eab308" stackId="a" />
                <Bar dataKey="reseau" name="Réseau Électrique" fill="#3b82f6" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

