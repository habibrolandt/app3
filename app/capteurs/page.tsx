'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Battery, Droplets, Thermometer, Wind } from 'lucide-react'

type DonneeCapteur = {
  _id: string
  humiditeSol: number
  pluieDetectee: boolean
  modeManuel: boolean
  systemeGlobal: boolean
  pompeActivee?: boolean
  message?: string
  date: string
}

export default function PageCapteurs() {
  const [capteurs, setCapteurs] = useState<any[]>([]) // Liste des capteurs et leurs données
  const [loading, setLoading] = useState<boolean>(true) // Pour gérer l'état de chargement

  // Effect pour récupérer les données à partir de l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/donnees/stream') // Assure-toi que l'URL est correcte
        const donnees = response.data

        // Transformer les données pour correspondre au format que tu utilises dans la carte
        const capteursAdaptés = [
          {
            id: 1,
            nom: 'Capteur Température',
            icon: Thermometer,
            valeur: `${donnees[0]?.humiditeSol}°C`, // Utilisation de l'humidité du sol comme exemple
            status: 'normal',
            batterie: '85%',
            donnees: donnees.map((item: DonneeCapteur) => ({
              time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              valeur: item.humiditeSol, // Humidité du sol comme exemple
            })),
          },
          {
            id: 2,
            nom: 'Capteur Humidité',
            icon: Droplets,
            valeur: `${donnees[0]?.humiditeSol}%`, // Humidité comme valeur
            status: 'attention',
            batterie: '72%',
            donnees: donnees.map((item: DonneeCapteur) => ({
              time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              valeur: item.humiditeSol, // Humidité comme exemple
            })),
          },
          {
            id: 3,
            nom: 'Capteur Vent',
            icon: Wind,
            valeur: '12 km/h', // Exemple fixe pour le vent
            status: 'normal',
            batterie: '90%',
            donnees: donnees.map((item: DonneeCapteur) => ({
              time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              valeur: item.humiditeSol, // Exemple, remplacer par une vraie donnée
            })),
          },
        ]
        
        setCapteurs(capteursAdaptés)
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Chargement des données...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Analyse des Capteurs
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {capteurs.map((capteur) => (
          <Card key={capteur.id}>
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
                <div className="text-2xl font-bold">
                  {capteur.valeur}
                </div>
                <div className={`text-sm ${
                  capteur.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {capteur.status === 'normal' ? 'Normal' : 'Attention requise'}
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={capteur.donnees}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="valeur" 
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
