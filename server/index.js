import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { connectDatabase } from "./config/database"
import { DonneesCapteur } from "./models/DonneesCapteur"

// Initialisation des applications
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors())
app.use(express.json())

// Connexion à la base de données
connectDatabase()

// Route POST pour recevoir les données des capteurs
app.post("/api/donnees", async (req, res) => {
  try {
    const { temperature, humidite } = req.body

    // Validation des données
    if (temperature === undefined || humidite === undefined) {
      return res.status(400).json({
        error: "Les champs temperature et humidite sont requis",
      })
    }

    // Création d'une nouvelle entrée
    const nouvelleDonnee = new DonneesCapteur({
      temperature,
      humidite,
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
app.get("/api/donnees/stream", async (req, res) => {
  try {
    // Récupération des 100 dernières entrées
    const donnees = await DonneesCapteur.find().sort({ date: -1 }).limit(100)

    res.json(donnees)
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error)
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
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})

