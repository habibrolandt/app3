"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  CloudRain,
  Droplet,
  AlertTriangle,
  HandIcon as HandWater,
  DropletIcon,
  CloudIcon,
  BarChart3Icon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useArduino } from "@/hooks/use-arduino"
import { cn } from "@/lib/utils"

export function SectionIrrigation() {
  const [loading, setLoading] = useState(false)
  const [irrigationActive, setIrrigationActive] = useState(false)
  const [meteoAdjustEnabled, setMeteoAdjustEnabled] = useState(true)
  const [currentReduction, setCurrentReduction] = useState(0)
  const [manualIrrigationActive, setManualIrrigationActive] = useState(false)
  const [forecast, setForecast] = useState<any>(null)
  const { toast } = useToast()
  const { sendCommand, loading: arduinoLoading } = useArduino({
    onSuccess: (result) => {
      console.log("Commande Arduino envoyée avec succès:", result)
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi de la commande Arduino:", error)
    },
  })

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

  const toggleIrrigation = async () => {
    setLoading(true)
    const newState = !irrigationActive

    try {
      // Envoyer la commande à l'Arduino
      await sendCommand({
        device: "irrigation_controller",
        action: newState ? "START_AUTO_IRRIGATION" : "STOP_AUTO_IRRIGATION",
        value: newState,
      })

      setIrrigationActive(newState)
      toast({
        title: newState ? "Irrigation activée" : "Irrigation désactivée",
        description: newState
          ? "Le système d'irrigation automatique est maintenant actif"
          : "Le système d'irrigation automatique est maintenant inactif",
      })
    } catch (error) {
      console.error("Erreur lors de l'activation/désactivation de l'irrigation:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMeteoAdjust = async () => {
    setLoading(true)
    const newState = !meteoAdjustEnabled

    try {
      // Envoyer la commande à l'Arduino
      await sendCommand({
        device: "irrigation_controller",
        action: "SET_WEATHER_ADJUST",
        value: newState,
      })

      setMeteoAdjustEnabled(newState)

      // Si on désactive l'ajustement météo, on réinitialise la réduction
      if (meteoAdjustEnabled) {
        setCurrentReduction(0)
      } else if (forecast && forecast.probability > 60) {
        // Si on active l'ajustement et qu'il y a des prévisions de pluie
        setCurrentReduction(75)
      }

      toast({
        title: newState ? "Ajustement météo activé" : "Ajustement météo désactivé",
        description: newState
          ? "L'irrigation sera automatiquement ajustée selon les prévisions météo"
          : "Les prévisions météo ne seront plus prises en compte pour l'irrigation",
      })
    } catch (error) {
      console.error("Erreur lors de l'activation/désactivation de l'ajustement météo:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleManualIrrigation = async () => {
    setLoading(true)
    const newState = !manualIrrigationActive

    try {
      // Envoyer la commande à l'Arduino
      await sendCommand({
        device: "irrigation_controller",
        action: newState ? "START_MANUAL_IRRIGATION" : "STOP_MANUAL_IRRIGATION",
        zone: "zone_nord",
      })

      setManualIrrigationActive(newState)
      toast({
        title: newState ? "Irrigation manuelle activée" : "Irrigation manuelle désactivée",
        description: newState
          ? "L'irrigation manuelle a été démarrée avec succès."
          : "L'irrigation manuelle a été arrêtée.",
      })
    } catch (error) {
      console.error("Erreur lors de l'activation/désactivation de l'irrigation manuelle:", error)
    } finally {
      setLoading(false)
    }
  }

  const isLoading = loading || arduinoLoading

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion de l'Irrigation</h2>
        <p className="text-gray-500">Contrôlez et surveillez vos systèmes d'irrigation</p>
      </div>

      <Card className="overflow-hidden border-0 shadow-md bg-white">
        <Tabs defaultValue="auto" className="w-full">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <div className="container mx-auto px-4 py-2">
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger
                  value="auto"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-md"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Contrôle Automatique
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 rounded-md"
                >
                  <HandWater className="h-4 w-4 mr-2" />
                  Irrigation Manuelle
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Contrôle Automatique */}
            <TabsContent value="auto" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Colonne 1: Contrôles principaux */}
                <div className="p-6 border-r border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Settings className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Paramètres d'Irrigation</h3>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
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
                        disabled={isLoading}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
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
                        disabled={isLoading || !irrigationActive}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        variant={irrigationActive ? "destructive" : "default"}
                        className={cn(
                          "w-full shadow-sm transition-all",
                          irrigationActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
                        )}
                        onClick={toggleIrrigation}
                        disabled={isLoading}
                      >
                        {isLoading ? (
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
                    </div>
                  </div>
                </div>

                {/* Colonne 2: Prévisions météo */}
                <div className="p-6 border-r border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <CloudRain className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Prévisions Météo</h3>
                  </div>

                  {meteoAdjustEnabled && forecast && (
                    <div className="space-y-4">
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

                      {currentReduction > 0 && (
                        <div className="rounded-lg bg-green-50 p-4 shadow-sm">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                              <Droplet className="h-4 w-4 text-green-600" />
                            </div>
                            <h3 className="font-medium text-green-800">Irrigation réduite de {currentReduction}%</h3>
                          </div>
                          <p className="mb-2 text-sm text-green-700">
                            Économie d'eau activée en raison des prévisions de pluie
                          </p>
                          <Progress
                            value={currentReduction}
                            className="h-2 bg-green-200"
                            indicatorClassName="bg-green-600"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!meteoAdjustEnabled && (
                    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <AlertTriangle className="h-5 w-5 text-gray-400" />
                        <p>L'ajustement météo est désactivé</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Colonne 3: Statistiques */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <BarChart3Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Statistiques d'Irrigation</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Économie d'eau ce mois</h4>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <DropletIcon className="h-5 w-5 text-blue-500" />
                          <span className="text-2xl font-bold text-blue-600">32%</span>
                        </div>
                        <span className="text-sm text-green-600">+12% vs mois dernier</span>
                      </div>
                      <Progress value={32} className="h-2 mt-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Efficacité du système</h4>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-green-500" />
                          <span className="text-2xl font-bold text-green-600">95%</span>
                        </div>
                        <span className="text-sm text-green-600">Excellent</span>
                      </div>
                      <Progress value={95} className="h-2 mt-2 bg-green-100" indicatorClassName="bg-green-500" />
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Prochaine maintenance</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CloudIcon className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">15 jours</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                          Planifier
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Irrigation Manuelle */}
            <TabsContent value="manual" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Colonne 1: Contrôles manuels */}
                <div className="p-6 border-r border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                      <HandWater className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Contrôle Manuel</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 shadow-sm">
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                      <div>
                        <Label htmlFor="irrigation-manuelle" className="font-medium text-amber-800">
                          Mode manuel
                        </Label>
                        <p className="text-sm text-amber-700">
                          Utiliser uniquement en cas de défaillance du système automatique. L'irrigation manuelle n'est
                          pas optimisée pour économiser l'eau.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-white border border-gray-100 p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <Droplet className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-800">État actuel</h3>
                      </div>
                      <p className="mb-4 text-sm text-gray-600">
                        {manualIrrigationActive
                          ? "L'irrigation manuelle est actuellement active. Vous pouvez l'arrêter à tout moment."
                          : "Démarrez l'irrigation manuelle pour arroser immédiatement vos cultures."}
                      </p>

                      <Button
                        id="irrigation-manuelle"
                        onClick={toggleManualIrrigation}
                        disabled={isLoading}
                        className={cn(
                          "w-full shadow-sm transition-all",
                          manualIrrigationActive ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700",
                        )}
                        variant={manualIrrigationActive ? "destructive" : "default"}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            Chargement...
                          </span>
                        ) : manualIrrigationActive ? (
                          "Arrêter l'irrigation"
                        ) : (
                          "Démarrer l'irrigation"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Colonne 2: Zones d'irrigation */}
                <div className="p-6 border-r border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <CloudIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Zones d'Irrigation</h3>
                  </div>

                  <div className="space-y-3">
                    {["Zone Nord", "Zone Est", "Zone Sud", "Zone Ouest"].map((zone, index) => (
                      <div key={index} className="rounded-lg bg-white border border-gray-100 p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-full ${index === 0 && manualIrrigationActive ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="font-medium">{zone}</span>
                          </div>
                          <Switch
                            checked={index === 0 && manualIrrigationActive}
                            disabled={!manualIrrigationActive || isLoading || index !== 0}
                            className="data-[state=checked]:bg-green-600"
                            onCheckedChange={async (checked) => {
                              if (index === 0) {
                                try {
                                  await sendCommand({
                                    device: "irrigation_controller",
                                    action: checked ? "ACTIVATE_ZONE" : "DEACTIVATE_ZONE",
                                    zone: "zone_nord",
                                  })
                                } catch (error) {
                                  console.error("Erreur lors de l'activation/désactivation de la zone:", error)
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50 p-3 shadow-sm">
                    <p className="text-sm text-blue-700">
                      Seule la Zone Nord est disponible pour l'irrigation manuelle dans cette démonstration.
                    </p>
                  </div>
                </div>

                {/* Colonne 3: Paramètres avancés */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Settings className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Paramètres Avancés</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Durée d'irrigation</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">15 minutes</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={!manualIrrigationActive || isLoading}
                            onClick={async () => {
                              try {
                                await sendCommand({
                                  device: "irrigation_controller",
                                  action: "SET_DURATION",
                                  value: 10, // minutes
                                })
                              } catch (error) {
                                console.error("Erreur lors de la modification de la durée:", error)
                              }
                            }}
                          >
                            -
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={!manualIrrigationActive || isLoading}
                            onClick={async () => {
                              try {
                                await sendCommand({
                                  device: "irrigation_controller",
                                  action: "SET_DURATION",
                                  value: 20, // minutes
                                })
                              } catch (error) {
                                console.error("Erreur lors de la modification de la durée:", error)
                              }
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Intensité</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Modérée</span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              disabled={!manualIrrigationActive || isLoading}
                              onClick={async () => {
                                try {
                                  await sendCommand({
                                    device: "irrigation_controller",
                                    action: "SET_INTENSITY",
                                    value: "high",
                                  })
                                } catch (error) {
                                  console.error("Erreur lors de la modification de l'intensité:", error)
                                }
                              }}
                            >
                              Changer
                            </Button>
                          </div>
                        </div>
                        <Progress value={50} className="h-2 bg-amber-100" indicatorClassName="bg-amber-500" />
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Programmation</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={!manualIrrigationActive || isLoading}
                        onClick={async () => {
                          try {
                            await sendCommand({
                              device: "irrigation_controller",
                              action: "SCHEDULE_IRRIGATION",
                              value: {
                                time: "08:00",
                                days: ["monday", "wednesday", "friday"],
                              },
                            })
                          } catch (error) {
                            console.error("Erreur lors de la programmation:", error)
                          }
                        }}
                      >
                        Programmer une irrigation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
