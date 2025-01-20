import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { connectDatabase } from "./config/database.ts"
import { DonneesCapteur } from "./models/DonneesCapteur.ts"

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
    const { humiditeSol, pluieDetectee, modeManuel, systemeGlobal } = req.body

    // Validation des données
    if (humiditeSol === undefined || 
        pluieDetectee === undefined || 
        modeManuel === undefined || 
        systemeGlobal === undefined) {
      return res.status(400).json({
        error: "Les champs humiditeSol, pluieDetectee, modeManuel et systemeGlobal sont requis"
      })
    }

    // Création d'une nouvelle entrée
    const nouvelleDonnee = new DonneesCapteur({
      humiditeSol,
      pluieDetectee,
      modeManuel,
      systemeGlobal,
      // pompeActivee et message sont optionnels car ils ont des valeurs par défaut
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
    const donnees = await DonneesCapteur.find()
      .sort({ date: -1 })
      .limit(100)
      .select({
        humiditeSol: 1,
        pluieDetectee: 1,
        modeManuel: 1,
        systemeGlobal: 1,
        pompeActivee: 1,
        message: 1,
        date: 1
      })

    res.json(donnees)
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Ajouter une route pour récupérer la dernière donnée
app.get("/api/donnees/last", async (req, res) => {
  try {
    const derniereDonnee = await DonneesCapteur.findOne()
      .sort({ date: -1 })
      .select({
        humiditeSol: 1,
        pluieDetectee: 1,
        modeManuel: 1,
        systemeGlobal: 1,
        pompeActivee: 1,
        message: 1,
        date: 1
      })

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
app.post("/api/pompe", async (req, res) => {
  try {
    const { pompeActivee } = req.body

    if (pompeActivee === undefined) {
      return res.status(400).json({
        error: "Le champ pompeActivee est requis"
      })
    }

    // Créer une nouvelle entrée avec l'état de la pompe mis à jour
    const nouvelleDonnee = new DonneesCapteur({
      humiditeSol: 0, // Valeur par défaut ou dernière valeur connue
      pluieDetectee: false,
      modeManuel: true, // Force le mode manuel quand on active/désactive la pompe
      systemeGlobal: true,
      pompeActivee: pompeActivee,
      message: `Pompe ${pompeActivee ? 'activée' : 'désactivée'} manuellement`
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
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})