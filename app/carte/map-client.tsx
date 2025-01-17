'use client'

import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(
  () => import('../../components/map-component'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        Chargement de la carte...
      </div>
    )
  }
)

export default function MapClient() {
  return <MapWithNoSSR />
}

