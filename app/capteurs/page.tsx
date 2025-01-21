"use client"

import { useEffect, useState, useCallback } from "react"
import { io } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Battery, Droplets, Thermometer, Wind } from "lucide-react"
import { motion } from "framer-motion"
import { databaseService, type CapteurData } from "../../services/databaseService"
import { Button } from "../../components/ui/button"
import { useToast } from "../../components/ui/use-toast"

type DonneeCapteur = CapteurData & {
  _id: string
  date: string
}

export default function PageCapteurs() {
  const [capteurs, setCapteurs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [socket, setSocket] = useState<any>(null)
  const { toast } = useToast()

  const handleNewData = useCallback(
    async (nouvelleDonnee: CapteurData) => {
      try {
        // Enregistrer dans la base de données
        const savedData = await databaseService.saveCapteurData(nouvelleDonnee)

        // Mettre à jour l'interface
        setCapteurs((prevCapteurs) => {
          return prevCapteurs.map((capteur) => {
            const newData = {
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              valeur: nouvelleDonnee.humiditeSol,
            }

            // Vérifier les seuils critiques
            if (capteur.id === 2 && nouvelleDonnee.humiditeSol < 30) {
              toast({
                title: "Alerte humidité",
                description: `Niveau d'humidité critique: ${nouvelleDonnee.humiditeSol}%`,
                variant: "destructive",
              })
            }

            return {
              ...capteur,
              valeur:
                capteur.id === 2
                  ? `${nouvelleDonnee.humiditeSol}%`
                  : capteur.id === 1
                    ? `${nouvelleDonnee.humiditeSol}°C`
                    : nouvelleDonnee.systemeGlobal
                      ? "Actif"
                      : "Inactif",
              status:
                capteur.id === 2
                  ? nouvelleDonnee.humiditeSol < 30
                    ? "attention"
                    : "normal"
                  : capteur.id === 1
                    ? nouvelleDonnee.humiditeSol > 30
                      ? "attention"
                      : "normal"
                    : nouvelleDonnee.systemeGlobal
                      ? "normal"
                      : "attention",
              donnees: [...capteur.donnees.slice(-19), newData],
            }
          })
        })
      } catch (error) {
        console.error("Erreur lors du traitement des nouvelles données:", error)
        toast({
          title: "Erreur",
          description: "Impossible de traiter les nouvelles données",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // Initialisation de Socket.IO
  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnection: true,
    })

    socketInstance.on("connect", () => {
      toast({
        title: "Connecté",
        description: "Connection au serveur établie",
      })
    })

    socketInstance.on("disconnect", () => {
      toast({
        title: "Déconnecté",
        description: "Connection au serveur perdue",
        variant: "destructive",
      })
    })

    socketInstance.on("nouvelles-donnees", handleNewData)

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [handleNewData, toast])

  // Chargement initial des données
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const historique = await databaseService.getHistoriqueDonnees()

        const capteursInit = [
          {
            id: 1,
            nom: "Capteur Température",
            icon: Thermometer,
            valeur: `${historique[0]?.humiditeSol}°C`,
            status: historique[0]?.humiditeSol > 30 ? "attention" : "normal",
            batterie: "85%",
            donnees: historique.map((item: DonneeCapteur) => ({
              time: new Date(item.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              valeur: item.humiditeSol,
            })),
          },
          {
            id: 2,
            nom: "Capteur Humidité",
            icon: Droplets,
            valeur: `${historique[0]?.humiditeSol}%`,
            status: historique[0]?.humiditeSol < 30 ? "attention" : "normal",
            batterie: "72%",
            donnees: historique.map((item: DonneeCapteur) => ({
              time: new Date(item.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              valeur: item.humiditeSol,
            })),
          },
          {
            id: 3,
            nom: "État Système",
            icon: Wind,
            valeur: historique[0]?.systemeGlobal ? "Actif" : "Inactif",
            status: historique[0]?.systemeGlobal ? "normal" : "attention",
            batterie: "90%",
            donnees: historique.map((item: DonneeCapteur) => ({
              time: new Date(item.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              valeur: item.humiditeSol,
            })),
          },
        ]

        setCapteurs(capteursInit)
      } catch (error) {
        console.error("Erreur lors du chargement des données initiales:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données initiales",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [toast])

  const handleIrrigationToggle = async (capteurId: number) => {
    try {
      const derniereDonnee = await databaseService.getDerniereDonnee()
      const nouvelEtat = !derniereDonnee.pompeActivee

      await databaseService.updatePompeState(nouvelEtat)

      toast({
        title: nouvelEtat ? "Irrigation activée" : "Irrigation désactivée",
        description: `L'irrigation a été ${nouvelEtat ? "activée" : "désactivée"} avec succès`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'état de l'irrigation",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analyse des Capteurs</h1>
        <Button onClick={() => handleIrrigationToggle(2)} className="bg-green-600 hover:bg-green-700">
          <Droplets className="mr-2 h-4 w-4" />
          Contrôler l'irrigation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {capteurs.map((capteur) => (
          <motion.div
            key={capteur.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
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
                  <motion.div
                    key={capteur.valeur}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold"
                  >
                    {capteur.valeur}
                  </motion.div>
                  <div className={`text-sm ${capteur.status === "normal" ? "text-green-600" : "text-yellow-600"}`}>
                    {capteur.status === "normal" ? "Normal" : "Attention requise"}
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={capteur.donnees}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          borderRadius: "4px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="valeur"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                        animationDuration={500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

