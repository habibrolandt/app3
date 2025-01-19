import mongoose from "mongoose"

// Définition du schéma
const donneesCapteurSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
  },
  humidite: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

// Création et export du modèle
export const DonneesCapteur = mongoose.model("DonneesCapteur", donneesCapteurSchema)

