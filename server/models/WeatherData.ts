import mongoose, { Schema, type Document } from "mongoose"

export interface IWeatherAlert {
  title: string
  description: string
  severity: "info" | "warning" | "severe"
  createdAt: Date
}

export interface IWeatherForecast {
  date: Date
  temperature: {
    min: number
    max: number
  }
  condition: string
  precipitation: number
  precipitation_probability: number
  icon: string
}

export interface IWeatherData extends Document {
  locationName: string
  coordinates: {
    lat: number
    lon: number
  }
  current: {
    temperature: number
    condition: string
    humidity: number
    icon: string
    updatedAt: Date
  }
  forecast: IWeatherForecast[]
  alerts: IWeatherAlert[]
  impacts: {
    irrigation: {
      reduction: number
      message: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

const WeatherSchema = new Schema<IWeatherData>(
  {
    locationName: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    current: {
      temperature: { type: Number, required: true },
      condition: { type: String, required: true },
      humidity: { type: Number, required: true },
      icon: { type: String, required: true },
      updatedAt: { type: Date, default: Date.now },
    },
    forecast: [
      {
        date: { type: Date, required: true },
        temperature: {
          min: { type: Number, required: true },
          max: { type: Number, required: true },
        },
        condition: { type: String, required: true },
        precipitation: { type: Number, required: true },
        precipitation_probability: { type: Number, required: true },
        icon: { type: String, required: true },
      },
    ],
    alerts: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        severity: {
          type: String,
          enum: ["info", "warning", "severe"],
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    impacts: {
      irrigation: {
        reduction: { type: Number, required: true },
        message: { type: String, required: true },
      },
    },
  },
  { timestamps: true },
)

export default mongoose.models.WeatherData || mongoose.model<IWeatherData>("WeatherData", WeatherSchema)
