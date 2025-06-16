import { NextResponse } from "next/server"

// Fonction pour récupérer les données météo depuis un service externe
async function fetchWeatherData(lat: number, lon: number) {
  try {
    // Récupérer la clé API depuis les variables d'environnement
    const apiKey = process.env.OPENWEATHERMAP_API_KEY

    // Si pas de clé API, utiliser directement les données simulées
    if (!apiKey) {
      console.warn("Clé API météo non configurée, utilisation de données simulées")
      return getMockWeatherData()
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&lang=fr&appid=${apiKey}`

      const response = await fetch(url)

      if (!response.ok) {
        console.error(`Erreur API météo: ${response.status}`)
        // En cas d'erreur d'API, utiliser les données simulées
        return getMockWeatherData()
      }

      const data = await response.json()

      // Formater les données pour notre application
      return {
        current: {
          temperature: Math.round(data.current.temp),
          condition: data.current.weather[0].description,
          humidity: data.current.humidity,
          icon: data.current.weather[0].icon,
        },
        forecast: data.daily.map((day: any) => ({
          date: new Date(day.dt * 1000).toISOString(),
          temperature: {
            min: Math.round(day.temp.min),
            max: Math.round(day.temp.max),
          },
          condition: day.weather[0].description,
          precipitation: day.rain ? day.rain : 0,
          precipitation_probability: Math.round(day.pop * 100),
          icon: day.weather[0].icon,
        })),
        alerts: data.alerts
          ? data.alerts.map((alert: any) => ({
              title: alert.event,
              description: alert.description,
              severity: getSeverity(alert.event),
            }))
          : [],
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo:", error)
      // En cas d'erreur, utiliser les données simulées
      return getMockWeatherData()
    }
  } catch (error) {
    console.error("Erreur générale:", error)
    // En cas d'erreur, utiliser les données simulées
    return getMockWeatherData()
  }
}

// Fonction pour générer des données météo simulées (pour le développement)
function getMockWeatherData() {
  // Générer des dates pour les 7 prochains jours
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString()
  })

  // Conditions météo possibles
  const conditions = ["clear", "cloudy", "partly cloudy", "rain", "showers"]

  // Générer des prévisions aléatoires
  const forecast = dates.map((date) => {
    const minTemp = Math.floor(Math.random() * 10) + 20 // Entre 20 et 29°C
    const maxTemp = minTemp + Math.floor(Math.random() * 5) + 1 // Min + 1-5°C
    const conditionIndex = Math.floor(Math.random() * conditions.length)
    const precipitation = conditions[conditionIndex].includes("rain") ? Math.random() * 10 : 0
    const probability = conditions[conditionIndex].includes("rain")
      ? Math.floor(Math.random() * 60) + 40
      : Math.floor(Math.random() * 30)

    return {
      date,
      temperature: {
        min: minTemp,
        max: maxTemp,
      },
      condition: conditions[conditionIndex],
      precipitation,
      precipitation_probability: probability,
      icon: conditions[conditionIndex],
    }
  })

  // Données actuelles
  const currentConditionIndex = Math.floor(Math.random() * conditions.length)

  return {
    current: {
      temperature: Math.floor(Math.random() * 10) + 25, // Entre 25 et 34°C
      condition: conditions[currentConditionIndex],
      humidity: Math.floor(Math.random() * 30) + 50, // Entre 50 et 79%
      icon: conditions[currentConditionIndex],
    },
    forecast,
    alerts:
      Math.random() > 0.7
        ? [
            {
              title: "Fortes pluies",
              description: "Risque de fortes pluies dans les prochaines 24 heures",
              severity: "warning",
            },
          ]
        : [],
  }
}

// Déterminer la sévérité d'une alerte
function getSeverity(eventType: string): "info" | "warning" | "severe" {
  const eventLower = eventType.toLowerCase()

  if (eventLower.includes("severe") || eventLower.includes("extreme") || eventLower.includes("emergency")) {
    return "severe"
  } else if (eventLower.includes("warning")) {
    return "warning"
  } else {
    return "info"
  }
}

export async function GET() {
  try {
    // Coordonnées de Daoukro, Côte d'Ivoire
    const lat = 7.0559
    const lon = -3.9621

    const weatherData = await fetchWeatherData(lat, lon)

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Erreur dans la route API météo:", error)
    // En cas d'erreur, retourner des données simulées
    return NextResponse.json(getMockWeatherData())
  }
}
