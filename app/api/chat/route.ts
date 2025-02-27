import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Récupérer les données d'irrigation depuis MongoDB
    const response = await fetch("http://127.0.0.1:5000/api/donnees/stream")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const irrigationData = await response.json()

    const systemPrompt = `Tu es un assistant spécialisé en irrigation intelligente. 
    Utilise ces données d'irrigation pour fournir des conseils pertinents: ${JSON.stringify(irrigationData)}
    Base tes recommandations sur l'historique des données et les conditions actuelles.`

    const result = await fetch("http://127.0.0.1:8000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: systemPrompt, userMessage: message }),
    }).then((res) => res.json())

    return NextResponse.json({ message: result.message })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}