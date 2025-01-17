'use client'

import { useState, useEffect } from 'react'
import io from 'socket.io-client'

export type DonneesCapteur = {
  capteurId: string
  valeur: number
  type: 'temperature' | 'humidite' | 'vent'
  horodatage: string
}

export function utiliserDonneesCapteurs() {
  const [donneesCapteurs, setDonneesCapteurs] = useState<Map<string, DonneesCapteur>>(new Map())
  
  useEffect(() => {
    // Récupération initiale des données
    fetch('/api/donnees-capteurs')
      .then(res => res.json())
      .then(donnees => {
        setDonneesCapteurs(new Map(Object.entries(donnees)))
      })

    // Connexion au WebSocket
    const socket = io()

    socket.on('mise-a-jour-capteur', (donnees: DonneesCapteur) => {
      setDonneesCapteurs(prev => new Map(prev).set(donnees.capteurId, donnees))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return donneesCapteurs
}

