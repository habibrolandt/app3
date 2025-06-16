"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, Droplets, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface WeatherData {
  current: {
    temperature: number
    condition: string
    humidity: number
    icon: string
  }
  forecast: Array<{
    date: string
    temperature: { min: number; max: number }
    condition: string
    precipitation: number
    precipitation_probability: number
    icon: string
  }>
  alerts: Array<{
    title: string
    description: string
    severity: "info" | "warning" | "severe"
  }>
}

export default function MeteoLocale() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch("/api/meteo/previsions")
        if (!response.ok) {
          throw new Error("Impossible de récupérer les données météo")
        }
        const data = await response.json()
        setWeatherData(data)

        // Vérifier s'il y a des alertes météo importantes
        const severeAlerts = data.alerts?.filter((alert) => alert.severity === "severe")
        if (severeAlerts && severeAlerts.length > 0) {
          toast({
            title: "Alerte météo importante",
            description: severeAlerts[0].description,
            variant: "destructive",
          })
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données météo")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()

    // Mettre à jour les données toutes les heures
    const intervalId = setInterval(fetchWeatherData, 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [toast])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "rain":
      case "showers":
      case "drizzle":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "clear":
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
      case "partly cloudy":
      case "overcast":
        return <Cloud className="h-6 w-6 text-gray-500" />
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { weekday: "short" })
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </Card>
    )
  }

  if (error || !weatherData) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium">Données météo indisponibles</h3>
          <p className="text-sm text-muted-foreground">Veuillez réessayer ultérieurement</p>
        </div>
      </Card>
    )
  }

  // Calculer l'impact sur l'irrigation
  const calculerImpactIrrigation = () => {
    // Si probabilité de précipitation > 60% dans les prochaines 24h
    const precipitationProba = weatherData.forecast[0]?.precipitation_probability || 0
    const precipitationAmount = weatherData.forecast[0]?.precipitation || 0

    if (precipitationProba > 60 && precipitationAmount > 5) {
      return {
        message: "Irrigation réduite - Pluie attendue",
        reduction: 100, // Annulation complète
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
      }
    } else if (precipitationProba > 40 && precipitationAmount > 2) {
      return {
        message: "Irrigation réduite - Possibilité de pluie",
        reduction: 50, // Réduction de 50%
        icon: <Droplets className="h-5 w-5 text-blue-300" />,
      }
    } else {
      return {
        message: "Irrigation normale",
        reduction: 0,
        icon: <Droplets className="h-5 w-5 text-gray-500" />,
      }
    }
  }

  const impactIrrigation = calculerImpactIrrigation()

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Météo locale</h2>

      {/* Météo actuelle */}
      <div className="flex items-center justify-between mb-4 p-2 bg-slate-50 rounded-md">
        <div className="flex items-center gap-2">
          {getWeatherIcon(weatherData.current.condition)}
          <div>
            <span className="text-2xl font-bold">{weatherData.current.temperature}°C</span>
            <p className="text-sm text-muted-foreground">{weatherData.current.condition}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>{weatherData.current.humidity}%</span>
          </div>
        </div>
      </div>

      {/* Impact sur l'irrigation */}
      <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
        <div className="flex items-center gap-2 mb-1">
          {impactIrrigation.icon}
          <h3 className="font-medium">{impactIrrigation.message}</h3>
        </div>
        {impactIrrigation.reduction > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Économie d'eau</span>
              <span>{impactIrrigation.reduction}%</span>
            </div>
            <Progress value={impactIrrigation.reduction} className="h-2" />
          </div>
        )}
      </div>

      {/* Prévisions */}
      <h3 className="font-medium mb-2">Prévisions 5 jours</h3>
      <div className="grid grid-cols-5 gap-1">
        {weatherData.forecast.slice(0, 5).map((day, index) => (
          <div key={index} className="text-center p-2 rounded-md hover:bg-slate-50">
            <div className="text-sm font-medium">{formatDate(day.date)}</div>
            <div className="my-1">{getWeatherIcon(day.condition)}</div>
            <div className="text-xs flex justify-center gap-1">
              <span className="text-red-500">{day.temperature.max}°</span>
              <span className="text-blue-500">{day.temperature.min}°</span>
            </div>
            {day.precipitation_probability > 20 && (
              <div className="text-xs text-blue-500 mt-1 flex items-center justify-center gap-1">
                <Droplets className="h-3 w-3" />
                <span>{day.precipitation_probability}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Alertes météo */}
      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <div className="mt-3">
          <h3 className="font-medium mb-2">Alertes</h3>
          {weatherData.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-2 mb-2 rounded-md text-sm ${
                alert.severity === "severe"
                  ? "bg-red-50 border border-red-200"
                  : alert.severity === "warning"
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-blue-50 border border-blue-200"
              }`}
            >
              <p className="font-medium">{alert.title}</p>
              <p className="text-xs">{alert.description}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
