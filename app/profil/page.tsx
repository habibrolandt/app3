import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { BarChart, Clock, MapPin, User } from 'lucide-react'

const profile = {
  nom: 'Yeo Francois',
  role: 'Agriculteur',
  location: 'daoukro, cote d\'ivoire',
  parcelles: 3,
  surface: '12.5 hectares',
  activites: [
    {
      date: '12 Jan 2024',
      action: 'Mise à jour du système d\'irrigation',
      parcelle: 'Parcelle 1'
    },
    {
      date: '11 Jan 2024',
      action: 'Analyse des données des capteurs',
      parcelle: 'Toutes les parcelles'
    },
    {
      date: '10 Jan 2024',
      action: 'Planification des semis',
      parcelle: 'Parcelle 3'
    }
  ]
}

export default function PageProfil() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Profil
        </h1>
        <Button>
          Modifier le profil
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl font-medium text-green-700">JD</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.nom}</h2>
                  <p className="text-gray-500">{profile.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <BarChart className="h-4 w-4" />
                  {profile.parcelles} parcelles · {profile.surface}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.activites.map((activite, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-2 w-2 mt-2 rounded-full bg-green-500" />
                  <div>
                    <div className="font-medium">{activite.action}</div>
                    <div className="text-sm text-gray-500">
                      {activite.parcelle} · {activite.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

