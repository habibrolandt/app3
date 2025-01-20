import { NextResponse } from 'next/server'

// Cette variable devrait être remplacée par une solution de stockage partagé dans une application de production
global.irrigationActive = global.irrigationActive || false

export async function POST(req: Request) {
  try {
    const { actif } = await req.json()
    global.irrigationActive = actif

    // Ici, vous pouvez ajouter la logique pour contrôler votre système d'irrigation physique

    return NextResponse.json({ success: true, etatIrrigation: global.irrigationActive })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'état de l\'irrigation:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ etatIrrigation: global.irrigationActive })
}
