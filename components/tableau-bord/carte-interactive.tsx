'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(
  () => import('../map-component'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        Chargement de la carte...
      </div>
    )
  }
)

export function CarteInteractive() {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Carte des Parcelles - Daoukro, Côte d'Ivoire</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MapWithNoSSR />
      </CardContent>
    </Card>
  )
}

