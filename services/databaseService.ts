import axios from "axios"

const API_URL = "http://localhost:5000/api"

export interface CapteurData {
  humiditeSol: number
  pluieDetectee: boolean
  modeManuel: boolean
  systemeGlobal: boolean
  pompeActivee?: boolean
  message?: string
}

export const databaseService = {
  // Enregistrer de nouvelles données
  async saveCapteurData(data: CapteurData) {
    try {
      const response = await axios.post(`${API_URL}/donnees`, data)
      return response.data
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données:", error)
      throw error
    }
  },

  // Récupérer l'historique des données
  async getHistoriqueDonnees() {
    try {
      const response = await axios.get(`${API_URL}/donnees/stream`)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error)
      throw error
    }
  },

  // Récupérer la dernière donnée
  async getDerniereDonnee() {
    try {
      const response = await axios.get(`${API_URL}/donnees/last`)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération de la dernière donnée:", error)
      throw error
    }
  },

  // Mettre à jour l'état de la pompe
  async updatePompeState(etat: boolean) {
    try {
      const response = await axios.post(`${API_URL}/pompe`, { pompeActivee: etat })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état de la pompe:", error)
      throw error
    }
  },
}

