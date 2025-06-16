"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Droplet, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface IrrigationSettings {
  id: string
  meteoAdjustEnabled: boolean
  currentReduction: number
  lastUpdated: string
}

export default function ControleIrrigationMeteo() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<IrrigationSettings>({
    id: "default",
    meteoAdjustEnabled: true,
    currentReduction: 0,
    lastUpdated: new Date().toISOString(),
  })
  const [forecast, setForecast] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simuler la récupération des paramètres
    setLoading(true)
    setTimeout(() => {
      setSettings({
        id: "default",
        meteoAdjustEnabled: true,
        currentReduction: 0,
        lastUpdated: new Date().toISOString(),
      })

      // Simuler des données de prévisions
      setForecast({
        precipitation: 8.5,
        probability: 75,
        message: "Pluie prévue demain",
      })

      setLoading(false)
    }, 1000)
  }, [])

  const toggleMeteoAdjust = async () => {
    setLoading(true)
    try {
      // Simuler l'API pour activer/désactiver l'ajustement météo
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSettings({
        ...settings,
        meteoAdjustEnabled: !settings.meteoAdjustEnabled,
        lastUpdated: new Date().toISOString(),
      })

      toast({
        title: !settings.meteoAdjustEnabled ? "Ajustement météo activé" : "Ajustement météo désactivé",
        description: !settings.meteoAdjustEnabled
          ? "L'irrigation sera automatiquement ajustée selon les prévisions météo"
          : "Les prévisions météo ne seront plus prises en compte pour l'irrigation",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier les paramètres",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshForecast = async () => {
    setLoading(true)
    try {
      // Simuler l'API pour récupérer les prévisions météo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simuler une mise à jour des prévisions
      const newProbability = Math.floor(Math.random() * 100)
      const newPrecipitation = (Math.random() * 10).toFixed(1)

      let message = "Conditions sèches prévues"
      let reduction = 0

      if (newProbability > 70) {
        message = "Fortes pluies prévues"
        reduction = 100
      } else if (newProbability > 40) {
        message = "Précipitations légères prévues"
        reduction = 50
      }

      setForecast({
        precipitation: Number.parseFloat(newPrecipitation),
        probability: newProbability,
        message,
      })

      setSettings({
        ...settings,
        currentReduction: reduction,
        lastUpdated: new Date().toISOString(),
      })

      toast({
        title: "Prévisions mises à jour",
        description: message,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les prévisions météo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CloudRain className="h-5 w-5 text-blue-500" />
          Ajustement Météo de l'Irrigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="meteoAdjust">Ajustement automatique</Label>
              <p className="text-sm text-muted-foreground">Ajuste l'irrigation selon les prévisions météo</p>
            </div>
            <Switch
              id="meteoAdjust"
              checked={settings.meteoAdjustEnabled}
              onCheckedChange={toggleMeteoAdjust}
              disabled={loading}
            />
          </div>

          {settings.meteoAdjustEnabled && forecast && (
            <>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h3 className="text-sm font-medium mb-2">Prévision actuelle</h3>
                <div className="flex items-center gap-2 text-sm mb-2">
                  {forecast.probability > 60 ? (
                    <CloudRain className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Cloud className="h-4 w-4 text-gray-500" />
                  )}
                  <span>{forecast.message}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Droplet className="h-3.5 w-3.5 text-blue-500" />
                    <span>Probabilité: {forecast.probability}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CloudRain className="h-3.5 w-3.5 text-blue-500" />
                    <span>Précipitation: {forecast.precipitation} mm</span>
                  </div>
                </div>
              </div>

              {settings.currentReduction > 0 && (
                <div
                  className={`p-3 rounded-md border ${settings.currentReduction === 100 ? "bg-green-50 border-green-100" : "bg-yellow-50 border-yellow-100"}`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 ${settings.currentReduction === 100 ? "text-green-500" : "text-yellow-500"}`}
                    />
                    <span className="text-sm font-medium">
                      {settings.currentReduction === 100
                        ? "Irrigation annulée"
                        : `Irrigation réduite de ${settings.currentReduction}%`}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Économie d'eau activée en raison des prévisions de pluie
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Dernière mise à jour: {new Date(settings.lastUpdated).toLocaleString()}
              </div>
            </>
          )}

          <Button variant="outline" size="sm" onClick={refreshForecast} disabled={loading} className="w-full">
            {loading ? "Mise à jour..." : "Actualiser les prévisions"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
