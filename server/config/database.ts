import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// URL de connexion MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://leatitiaguehi1:Leatitia2020@cluster0.yiv09.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Options de configuration Mongoose
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as mongoose.ConnectOptions

// Fonction de connexion à la base de données
export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connecté à MongoDB Atlas avec succès")
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB:", error)
    process.exit(1)
  }
}

// Gestion des événements de connexion
mongoose.connection.on("error", (err) => {
  console.error("❌ Erreur MongoDB:", err)
})

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Déconnecté de MongoDB")
})

process.on("SIGINT", async () => {
  await mongoose.connection.close()
  process.exit(0)
})

