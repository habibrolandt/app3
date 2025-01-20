// import { Server } from 'socket.io'
// import { NextApiResponseServerIO } from '@/types/next'
import { NextResponse } from 'next/server'

const irrigationActive = false
const SEUIL_HUMIDITE = 30 // Seuil d'humidité en pourcentage

const donneesCapteurs = new Map()

// Point de terminaison POST pour l'envoi des données Arduino
export async function POST(req: Request) {
  try {
    const donnees = await req.json()
    
    // Validation des données entrantes
    if (!donnees.capteurId || !donnees.valeur || !donnees.type) {
      return NextResponse.json({ erreur: 'Format de données invalide' }, { status: 400 })
    }

    // Stockage des dernières données du capteur
    donneesCapteurs.set(donnees.capteurId, {
      ...donnees,
      horodatage: new Date().toISOString()
    })

    // Logique d'irrigation automatique
    if (irrigationActive && donnees.type === 'humidite' && donnees.valeur < SEUIL_HUMIDITE) {
      // Déclencher l'irrigation
      console.log(`Déclenchement de l'irrigation pour le capteur ${donnees.capteurId}`)
      // Ajoutez ici la logique pour activer votre système d'irrigation
    }

    // Diffusion à tous les clients connectés
    const io = (global as any).io
    if (io) {
      io.emit('mise-a-jour-capteur', {
        capteurId: donnees.capteurId,
        valeur: donnees.valeur,
        type: donnees.type,
        horodatage: new Date().toISOString()
      })
    }

    return NextResponse.json({ succes: true })
  } catch (erreur) {
    console.error('Erreur lors du traitement des données du capteur:', erreur)
    return NextResponse.json({ erreur: 'Erreur interne du serveur' }, { status: 500 })
  }
}

// Point de terminaison GET pour récupérer les dernières données
export async function GET() {
  return NextResponse.json(Object.fromEntries(donneesCapteurs))
}

