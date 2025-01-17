'use client'

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../ui/card'
import { Droplets, Sprout, Battery, Gauge } from 'lucide-react'
import { motion } from 'framer-motion'

const metrics = [
  {
    title: 'État des sols',
    value: 'Optimal',
    icon: Sprout,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Rendement prévu',
    value: '3.2 tonnes',
    icon: Gauge,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Consommation d\'eau',
    value: '12.5 m³',
    icon: Droplets,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100',
  },
  {
    title: 'Économie d\'énergie',
    value: '85%',
    icon: Battery,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
]

export function MetriqueTableauBord() {
  return (
    <>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  )
}

