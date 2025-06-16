import { NextResponse } from "next/server"
import { WeatherService } from "@/server/services/weatherService"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { parcelleId, coordinates } = body

    if (!parcelleId || !coordinates) {
      return NextResponse.json({ error: "ID de parcelle et coordonnées requis" }, { status: 400 })
    }

    // Récupérer les données météo pour ces coordonnées
    const weatherData = await WeatherService.getWeatherData(coordinates)

    if (!weatherData) {
      return NextResponse.json({ error: "Données météo non disponibles pour cette localisation" }, { status: 404 })
    }

    // Vérifier si l'irrigation doit être ajustée
    const shouldAdjust = WeatherService.shouldAdjustIrrigation(weatherData)
    const reductionPercentage = WeatherService.getIrrigationReductionPercentage(weatherData)

    // Préparer la réponse
    const response = {
      parcelleId,
      shouldAdjustIrrigation: shouldAdjust,
      reductionPercentage,
      reason: shouldAdjust ? weatherData.impacts.irrigation.message : "Aucun ajustement nécessaire",
      forecast: {
        precipitation: weatherData.forecast[0]?.precipitation || 0,
        probability: weatherData.forecast[0]?.precipitation_probability || 0,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Erreur lors de l'ajustement de l'irrigation:", error)
    return NextResponse.json({ error: "Erreur lors du traitement de la demande" }, { status: 500 })
  }
}
