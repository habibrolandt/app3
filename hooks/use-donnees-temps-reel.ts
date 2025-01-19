import { useState, useEffect } from "react"
import io, { type Socket } from "socket.io-client"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

interface DonneesCapteur {
  temperature: number
  humidite: number
  date: string
  _id: string
}

export function useDonneesTempsReel() {
  const [donnees, setDonnees] = useState<DonneesCapteur[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Connexion initiale à Socket.io
    const socketInstance = io(BACKEND_URL)
    setSocket(socketInstance)

    // Récupération des données initiales
    fetch(`${BACKEND_URL}/api/donnees/stream`)
      .then((res) => res.json())
      .then((data) => setDonnees(data))
      .catch((err) => console.error("Erreur lors de la récupération des données:", err))

    // Gestion des événements de connexion
    socketInstance.on("connect", () => {
      setIsConnected(true)
      console.log("Connecté au serveur Socket.io")
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
      console.log("Déconnecté du serveur Socket.io")
    })

    // Écoute des nouvelles données
    socketInstance.on("nouvelles-donnees", (nouvelleDonnee: DonneesCapteur) => {
      setDonnees((prev) => [nouvelleDonnee, ...prev].slice(0, 100))
    })

    // Nettoyage à la déconnexion
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { donnees, isConnected }
}

