import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { connectDatabase } from "./config/database.js"
import { DonneesCapteur } from "./models/DonneesCapteur.js"
import dotenv from "dotenv"
import type { Request, Response } from "express"

dotenv.config()

// Types pour les requêtes
interface DonneesRequest {
  humiditeSol: number
  pluieDetectee: boolean
  modeManuel: boolean
  systemeGlobal: boolean
  pompeActivee?: boolean
  message?: string
}

// Initialisation des applications
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Connexion à la base de données
connectDatabase()

// Route POST pour recevoir les données des capteurs
app.post("/api/donnees", async (req: Request<{}, {}, DonneesRequest>, res: Response) => {
  try {
    const { humiditeSol, pluieDetectee, modeManuel, systemeGlobal } = req.body

    // Validation des données
    if (
      humiditeSol === undefined ||
      pluieDetectee === undefined ||
      modeManuel === undefined ||
      systemeGlobal === undefined
    ) {
      return res.status(400).json({
        error: "Les champs humiditeSol, pluieDetectee, modeManuel et systemeGlobal sont requis",
      })
    }

    // Validation de l'humidité
    if (humiditeSol < 0 || humiditeSol > 100) {
      return res.status(400).json({
        error: "L'humidité doit être comprise entre 0 et 100",
      })
    }

    // Création d'une nouvelle entrée
    const nouvelleDonnee = new DonneesCapteur({
      humiditeSol,
      pluieDetectee,
      modeManuel,
      systemeGlobal,
    })

    // Sauvegarde dans la base de données
    await nouvelleDonnee.save()

    // Émission des nouvelles données via Socket.io
    io.emit("nouvelles-donnees", nouvelleDonnee)

    res.status(201).json(nouvelleDonnee)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Route GET pour le streaming des données
app.get("/api/donnees/stream", async (_req: Request, res: Response) => {
  try {
    const donnees = await DonneesCapteur.find().sort({ date: -1 }).limit(100).select("-__v")

    res.json(donnees)
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Route pour récupérer la dernière donnée
app.get("/api/donnees/last", async (_req: Request, res: Response) => {
  try {
    const derniereDonnee = await DonneesCapteur.findOne().sort({ date: -1 }).select("-__v")

    if (!derniereDonnee) {
      return res.status(404).json({ message: "Aucune donnée trouvée" })
    }

    res.json(derniereDonnee)
  } catch (error) {
    console.error("Erreur lors de la récupération de la dernière donnée:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Route pour mettre à jour l'état de la pompe
app.post("/api/pompe", async (req: Request<{}, {}, { pompeActivee: boolean }>, res: Response) => {
  try {
    const { pompeActivee } = req.body

    if (pompeActivee === undefined) {
      return res.status(400).json({
        error: "Le champ pompeActivee est requis",
      })
    }

    // Récupérer la dernière donnée pour conserver l'humidité
    const derniereDonnee = await DonneesCapteur.findOne().sort({ date: -1 })

    const nouvelleDonnee = new DonneesCapteur({
      humiditeSol: derniereDonnee?.humiditeSol || 0,
      pluieDetectee: derniereDonnee?.pluieDetectee || false,
      modeManuel: true,
      systemeGlobal: true,
      pompeActivee: pompeActivee,
      message: Pompe ${pompeActivee ? "activée" : "désactivée"} manuellement,
    })

    await nouvelleDonnee.save()
    io.emit("nouvelles-donnees", nouvelleDonnee)

    res.status(200).json(nouvelleDonnee)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'état de la pompe:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
  console.log("👤 Nouveau client connecté")

  socket.on("disconnect", () => {
    console.log("👋 Client déconnecté")
  })
})

// Démarrage du serveur
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(` 🚀 Serveur démarré sur le port ${PORT}`)
})