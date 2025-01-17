'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Lun', solaire: 30, réseau: 40 },
  { name: 'Mar', solaire: 35, réseau: 35 },
  { name: 'Mer', solaire: 40, réseau: 30 },
  { name: 'Jeu', solaire: 25, réseau: 45 },
  { name: 'Ven', solaire: 50, réseau: 20 },
  { name: 'Sam', solaire: 45, réseau: 25 },
  { name: 'Dim', solaire: 55, réseau: 15 },
]

export function ConsommationEnergie() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Consommation d'énergie</span>
          <span className="text-sm text-gray-500">(en kWh)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="solaire" stackId="a" fill="#22c55e" />
              <Bar dataKey="réseau" stackId="a" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

