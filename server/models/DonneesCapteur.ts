import mongoose from "mongoose";

// Définition du schéma
const donneesCapteurSchema = new mongoose.Schema({
  humiditeSol: {
    type: Number,
    required: true,
  },
  pluieDetectee: {
    type: Boolean,
    required: true,
  },
  modeManuel: {
    type: Boolean,
    required: true,
  },
  systemeGlobal: {
    type: Boolean,
    required: true,
  },
  pompeActivee: {
    type: Boolean,
    default: false, // Par défaut, la pompe est désactivée
  },
  message: {
    type: String,
    default: null, // Champ optionnel pour les messages spécifiques
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Création et export du modèle
export const DonneesCapteur = mongoose.model("DonneesCapteur", donneesCapteurSchema);
