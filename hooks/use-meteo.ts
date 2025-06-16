"use client"

import { useState, useEffect } from "react"

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

export function useMeteo() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        setLoading(true)
        const response = await fetch("/api/meteo/previsions")

        if (!response.ok) {
          throw new Error("Impossible de récupérer les données météo")
        }

        const data = await response.json()
        setWeatherData(data)
      } catch (err) {
        console.error("Erreur lors de la récupération des données météo:", err)
        setError("Erreur lors de la récupération des données météo")
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()

    // Actualiser les données toutes les heures
    const intervalId = setInterval(fetchWeatherData, 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Fonction pour vérifier si l'irrigation devrait être ajustée
  function shouldAdjustIrrigation() {
    if (!weatherData || !weatherData.forecast || weatherData.forecast.length === 0) {
      return false
    }

    const tomorrowForecast = weatherData.forecast[0]
    const precipitationProba = tomorrowForecast.precipitation_probability
    const precipitationAmount = tomorrowForecast.precipitation

    // Si probabilité > 60% et précipitation > 5mm
    return precipitationProba > 60 && precipitationAmount > 5
  }

  // Fonction pour calculer le pourcentage de réduction de l'irrigation
  function getIrrigationReduction() {
    if (!weatherData || !weatherData.forecast || weatherData.forecast.length === 0) {
      return 0
    }

    const tomorrowForecast = weatherData.forecast[0]
    const precipitationProba = tomorrowForecast.precipitation_probability
    const precipitationAmount = tomorrowForecast.precipitation

    if (precipitationProba > 60 && precipitationAmount > 5) {
      return 100 // Annulation totale
    } else if (precipitationProba > 40 && precipitationAmount > 2) {
      return 50 // Réduction partielle
    }

    return 0 // Pas de réduction
  }

  // Message concernant l'irrigation
  function getIrrigationMessage() {
    const reduction = getIrrigationReduction()

    if (reduction === 100) {
      return "Irrigation annulée - Pluie prévue"
    } else if (reduction === 50) {
      return "Irrigation réduite - Possibilité de pluie"
    } else {
      return "Irrigation normale"
    }
  }

  return {
    weatherData,
    loading,
    error,
    shouldAdjustIrrigation,
    getIrrigationReduction,
    getIrrigationMessage,
  }
}
