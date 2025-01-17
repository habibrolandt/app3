import { MetriqueTableauBord } from '../components/tableau-bord/metrique'
import { ConsommationEau } from '../components/tableau-bord/consommation-eau'
import { PrevisionMeteo } from '../components/tableau-bord/prevision-meteo'
import { StatutCapteurs } from '../components/tableau-bord/statut-capteurs'
import { ActivitesRecentes } from '../components/tableau-bord/activites-recentes'
import { RecommandationsIA } from '../components/tableau-bord/recommandations-ia'
import { ConsommationEnergie } from '../components/tableau-bord/consommation-energie'
import { CarteInteractive } from '../components/tableau-bord/carte-interactive'
import { ControleIrrigation } from '../components/tableau-bord/controle-irrigation'

export default function PageTableauBord() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Tableau de Bord
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetriqueTableauBord />
        <ControleIrrigation />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ConsommationEau />
        <ConsommationEnergie />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <CarteInteractive />
        </div>
        <div className="space-y-6">
          <PrevisionMeteo />
          <StatutCapteurs />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ActivitesRecentes />
        <RecommandationsIA />
      </div>
    </div>
  )
}

