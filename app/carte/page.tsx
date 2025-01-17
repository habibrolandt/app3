import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import MapClient from './map-client'

const parcelles = [
  { 
    id: 1, 
    nom: 'Parcelle 1', 
    surface: '2.5 hectares',
    culture: 'Blé',
    irrigation: 'Active',
    humidite: '65%'
  },
  { 
    id: 2, 
    nom: 'Parcelle 2', 
    surface: '3.2 hectares',
    culture: 'Maïs',
    irrigation: 'Inactive',
    humidite: '45%'
  },
  { 
    id: 3, 
    nom: 'Parcelle 3', 
    surface: '1.8 hectares',
    culture: 'Tournesol',
    irrigation: 'Active',
    humidite: '70%'
  },
]

export default function PageCarte() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Carte des Parcelles
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {parcelles.map((parcelle) => (
          <Card key={parcelle.id}>
            <CardHeader>
              <CardTitle>{parcelle.nom}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Surface</dt>
                  <dd>{parcelle.surface}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Culture</dt>
                  <dd>{parcelle.culture}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">État irrigation</dt>
                  <dd className={parcelle.irrigation === 'Active' ? 'text-green-600' : 'text-gray-600'}>
                    {parcelle.irrigation}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Humidité du sol</dt>
                  <dd>{parcelle.humidite}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-[600px]">
        <CardContent className="p-0">
          <MapClient />
        </CardContent>
      </Card>
    </div>
  )
}

