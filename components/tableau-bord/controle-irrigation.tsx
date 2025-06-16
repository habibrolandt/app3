"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CloudRain, Droplet, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function ControleIrrigation() {
  const [loading, setLoading] = useState(false)
  const [irrigationActive, setIrrigationActive] = useState(false)
  const [meteoAdjustEnabled, setMeteoAdjustEnabled] = useState(true)
  const [currentReduction, setCurrentReduction] = useState(0)
  const [forecast, setForecast] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simuler la récupération des paramètres d'irrigation
    setLoading(true)
    setTimeout(() => {
      setIrrigationActive(false)
      setMeteoAdjustEnabled(true)

      // Simuler des données de prévisions
      setForecast({
        precipitation: 8.5,
        probability: 75,
        message: "Pluie prévue demain",
      })

      // Si les prévisions indiquent de la pluie, réduire l'irrigation
      if (meteoAdjustEnabled) {
        setCurrentReduction(75)
      }

      setLoading(false)
    }, 1000)
  }, [])

  const toggleIrrigation = () => {
    setLoading(true)
    setTimeout(() => {
      setIrrigationActive(!irrigationActive)
      toast({
        title: !irrigationActive ? "Irrigation activée" : "Irrigation désactivée",
        description: !irrigationActive
          ? "Le système d'irrigation automatique est maintenant actif"
          : "Le système d'irrigation automatique est maintenant inactif",
      })
      setLoading(false)
    }, 500)
  }

  const toggleMeteoAdjust = () => {
    setLoading(true)
    setTimeout(() => {
      setMeteoAdjustEnabled(!meteoAdjustEnabled)

      // Si on désactive l'ajustement météo, on réinitialise la réduction
      if (meteoAdjustEnabled) {
        setCurrentReduction(0)
      } else if (forecast && forecast.probability > 60) {
        // Si on active l'ajustement et qu'il y a des prévisions de pluie
        setCurrentReduction(75)
      }

      toast({
        title: !meteoAdjustEnabled ? "Ajustement météo activé" : "Ajustement météo désactivé",
        description: !meteoAdjustEnabled
          ? "L'irrigation sera automatiquement ajustée selon les prévisions météo"
          : "Les prévisions météo ne seront plus prises en compte pour l'irrigation",
      })
      setLoading(false)
    }, 500)
  }

  return (
    <Card className="overflow-hidden border-2 border-green-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Settings className="h-5 w-5 text-green-600" />
          Contrôle de l'Irrigation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="irrigation-auto" className="font-medium text-gray-800">
                Irrigation Automatique
              </Label>
              <p className="text-sm text-muted-foreground">Activer/désactiver le système</p>
            </div>
            <Switch
              id="irrigation-auto"
              checked={irrigationActive}
              onCheckedChange={toggleIrrigation}
              disabled={loading}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="meteo-adjust" className="font-medium text-gray-800">
                Ajustement Météo
              </Label>
              <p className="text-sm text-muted-foreground">Ajuster selon les prévisions</p>
            </div>
            <Switch
              id="meteo-adjust"
              checked={meteoAdjustEnabled}
              onCheckedChange={toggleMeteoAdjust}
              disabled={loading || !irrigationActive}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {meteoAdjustEnabled && forecast && (
            <div className="rounded-lg bg-blue-50 p-4 shadow-sm">
              <h3 className="mb-3 font-medium text-blue-800">Prévision actuelle</h3>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <CloudRain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{forecast.message}</p>
                  <div className="flex gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5 text-blue-500" />
                      {forecast.probability}%
                    </span>
                    <span className="flex items-center gap-1">
                      <CloudRain className="h-3.5 w-3.5 text-blue-500" />
                      {forecast.precipitation} mm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {meteoAdjustEnabled && currentReduction > 0 && (
            <div className="rounded-lg bg-green-50 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Droplet className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-medium text-green-800">Irrigation réduite de {currentReduction}%</h3>
              </div>
              <p className="mb-2 text-sm text-green-700">Économie d'eau activée en raison des prévisions de pluie</p>
              <Progress value={currentReduction} className="h-2 bg-green-200" indicatorClassName="bg-green-600" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Button
          variant={irrigationActive ? "destructive" : "default"}
          className={cn(
            "w-full shadow-sm transition-all",
            irrigationActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
          )}
          onClick={toggleIrrigation}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Chargement...
            </span>
          ) : irrigationActive ? (
            "Désactiver l'irrigation"
          ) : (
            "Activer l'irrigation"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
