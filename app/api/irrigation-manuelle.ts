import { NextResponse } from "next/server"

let irrigationManuelleActive = false // Variable pour stocker l'état d'irrigation manuelle

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (typeof body.actif !== "boolean") {
      return NextResponse.json(
        { message: "Format de données invalide" },
        { status: 400 }
      )
    }

    irrigationManuelleActive = body.actif // Met à jour l'état d'irrigation

    return NextResponse.json({
      message: irrigationManuelleActive
        ? "Irrigation manuelle activée"
        : "Irrigation manuelle désactivée",
    })
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ actif: irrigationManuelleActive })
}
