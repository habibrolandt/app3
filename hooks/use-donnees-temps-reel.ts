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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let socketInstance: Socket | null = null

    const connectSocket = () => {
      socketInstance = io(BACKEND_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socketInstance.on("connect", () => {
        setIsConnected(true)
        setError(null)
        console.log("Connecté au serveur Socket.io")
      })

      socketInstance.on("disconnect", () => {
        setIsConnected(false)
        console.log("Déconnecté du serveur Socket.io")
      })

      socketInstance.on("connect_error", (err) => {
        console.error("Erreur de connexion Socket.io:", err)
        setError("Impossible de se connecter au serveur. Veuillez réessayer plus tard.")
      })

      // Vérifiez si socketInstance est correctement défini avant de l'utiliser
      if (socketInstance) {
        socketInstance.on("nouvelles-donnees", (nouvelleDonnee: DonneesCapteur) => {
          setDonnees((prev) => [nouvelleDonnee, ...prev].slice(0, 100))
        })
      }

      setSocket(socketInstance)
    }

    connectSocket()

    // Récupération des données initiales
    console.log("BACKEND_URL:", BACKEND_URL)
    fetch(`${BACKEND_URL}/api/donnees/stream`)
      .then((res) => {
        console.log("HTTP Response Status:", res.status)
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log("Données reçues:", data)
        setDonnees(data)
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données:", err)
        setError("Impossible de charger les données. Veuillez réessayer plus tard.")
      })

    // Nettoyage à la déconnexion
    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [])

  return { donnees, isConnected, error }
}