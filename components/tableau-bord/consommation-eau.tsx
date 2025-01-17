'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', parcelle1: 4, parcelle2: 3 },
  { name: 'Fév', parcelle1: 3, parcelle2: 4 },
  { name: 'Mar', parcelle1: 5, parcelle2: 3 },
  { name: 'Avr', parcelle1: 4, parcelle2: 5 },
  { name: 'Mai', parcelle1: 3, parcelle2: 4 },
  { name: 'Jun', parcelle1: 6, parcelle2: 3 },
]

export function ConsommationEau() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Consommation d'eau</span>
          <span className="text-sm text-gray-500">(en m³)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="parcelle1" 
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                name="Parcelle 1"
              />
              <Line 
                type="monotone" 
                dataKey="parcelle2" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                name="Parcelle 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

