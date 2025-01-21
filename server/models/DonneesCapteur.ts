import mongoose from "mongoose"

export interface IDonneesCapteur {
  humiditeSol: number
  pluieDetectee: boolean
  modeManuel: boolean
  systemeGlobal: boolean
  pompeActivee: boolean
  message?: string
  date: Date
}

const donneesCapteurSchema = new mongoose.Schema<IDonneesCapteur>({
  humiditeSol: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  pluieDetectee: {
    type: Boolean,
    required: true,
    default: false,
  },
  modeManuel: {
    type: Boolean,
    required: true,
    default: false,
  },
  systemeGlobal: {
    type: Boolean,
    required: true,
    default: true,
  },
  pompeActivee: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

// Middleware pour vérifier les seuils d'humidité
donneesCapteurSchema.pre("save", function (next) {
  if (this.humiditeSol < 30 && !this.pompeActivee && !this.modeManuel) {
    this.pompeActivee = true
    this.message = "Irrigation automatique activée - Humidité basse"
  }
  next()
})

export const DonneesCapteur = mongoose.model<IDonneesCapteur>("DonneesCapteur", donneesCapteurSchema)

