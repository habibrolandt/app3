import WeatherData, { type IWeatherData } from "../../app3/server/models/WeatherData"
import { connectDatabase } from "../../app3/server/config/database"

export interface Coordinates {
  lat: number
  lon: number
}

export interface WeatherImpact {
  irrigation: {
    reduction: number
    message: string
  }
}

export class WeatherService {
  /**
   * Sauvegarde les données météo dans la base de données
   */
  static async saveWeatherData(weatherData: Partial<IWeatherData>): Promise<IWeatherData> {
    await connectDatabase()

    // Mettre à jour ou créer un enregistrement pour cette localisation
    const data = await WeatherData.findOneAndUpdate(
      {
        "coordinates.lat": weatherData.coordinates?.lat,
        "coordinates.lon": weatherData.coordinates?.lon,
      },
      weatherData,
      { new: true, upsert: true },
    )

    return data
  }

  /**
   * Récupère les dernières données météo pour une localisation donnée
   */
  static async getWeatherData(coordinates: Coordinates): Promise<IWeatherData | null> {
    await connectDatabase()

    return WeatherData.findOne({
      "coordinates.lat": coordinates.lat,
      "coordinates.lon": coordinates.lon,
    }).sort({ updatedAt: -1 })
  }

  /**
   * Calcule l'impact des prévisions météo sur l'irrigation
   */
  static calculateIrrigationImpact(weatherData: any): WeatherImpact {
    // Si probabilité de précipitation > 60% dans les prochaines 24h
    const precipitationProba = weatherData.forecast[0]?.precipitation_probability || 0
    const precipitationAmount = weatherData.forecast[0]?.precipitation || 0

    if (precipitationProba > 60 && precipitationAmount > 5) {
      return {
        irrigation: {
          reduction: 100, // Annulation complète
          message: "Irrigation annulée - Pluie attendue",
        },
      }
    } else if (precipitationProba > 40 && precipitationAmount > 2) {
      return {
        irrigation: {
          reduction: 50, // Réduction de 50%
          message: "Irrigation réduite - Possibilité de pluie",
        },
      }
    } else {
      return {
        irrigation: {
          reduction: 0,
          message: "Irrigation normale",
        },
      }
    }
  }

  /**
   * Vérifie si l'irrigation doit être ajustée en fonction des prévisions météo
   */
  static shouldAdjustIrrigation(weatherData: any): boolean {
    const impact = this.calculateIrrigationImpact(weatherData)
    return impact.irrigation.reduction > 0
  }

  /**
   * Obtient le pourcentage de réduction de l'irrigation en fonction des prévisions
   */
  static getIrrigationReductionPercentage(weatherData: any): number {
    const impact = this.calculateIrrigationImpact(weatherData)
    return impact.irrigation.reduction
  }
}
