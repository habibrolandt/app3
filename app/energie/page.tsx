"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Battery, Sun, Zap, DollarSign, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const consommationData = {
  journaliere: [
    { heure: "00:00", solaire: 0, reseau: 30 },
    { heure: "04:00", solaire: 0, reseau: 25 },
    { heure: "08:00", solaire: 45, reseau: 15 },
    { heure: "12:00", solaire: 75, reseau: 10 },
    { heure: "16:00", solaire: 55, reseau: 12 },
    { heure: "20:00", solaire: 15, reseau: 28 },
  ],
  hebdomadaire: [
    { jour: "Lun", solaire: 180, reseau: 120 },
    { jour: "Mar", solaire: 200, reseau: 100 },
    { jour: "Mer", solaire: 190, reseau: 110 },
    { jour: "Jeu", solaire: 210, reseau: 90 },
    { jour: "Ven", solaire: 180, reseau: 120 },
    { jour: "Sam", solaire: 160, reseau: 140 },
    { jour: "Dim", solaire: 150, reseau: 150 },
  ],
  mensuelle: [
    { semaine: "S1", solaire: 1200, reseau: 800 },
    { semaine: "S2", solaire: 1300, reseau: 700 },
    { semaine: "S3", solaire: 1100, reseau: 900 },
    { semaine: "S4", solaire: 1400, reseau: 600 },
  ],
}

const statistiques = [
  {
    titre: "Production Solaire",
    valeur: "250 kWh",
    evolution: "+15%",
    icon: Sun,
    color: "text-yellow-500",
  },
  {
    titre: "Consommation Totale",
    valeur: "320 kWh",
    evolution: "-8%",
    icon: Zap,
    color: "text-blue-500",
  },
  {
    titre: "Autonomie",
    valeur: "78%",
    evolution: "+5%",
    icon: Battery,
    color: "text-green-500",
  },
  {
    titre: "Économies",
    valeur: "45 €",
    evolution: "+12%",
    icon: DollarSign,
    color: "text-emerald-500",
  },
]

const conseilsEconomie = [
  "Optimisez l'irrigation nocturne pour profiter des tarifs réduits.",
  "Installez des panneaux solaires supplémentaires pour augmenter l'autonomie.",
  "Utilisez des pompes à eau plus efficaces pour réduire la consommation.",
  "Mettez en place un système de récupération d'eau de pluie.",
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function PageEnergie() {
  const [periode, setPeriode] = useState("journaliere")
  const [conseilsVisible, setConseilsVisible] = useState(false)

  const data = consommationData[periode as keyof typeof consommationData]
  const xKey = periode === "journaliere" ? "heure" : periode === "hebdomadaire" ? "jour" : "semaine"

  const repartitionEnergie = [
    { name: "Solaire", value: 250 },
    { name: "Réseau", value: 70 },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestion de l'Énergie</h1>

      <div className="grid gap-6 md:grid-cols-4">
        {statistiques.map((stat, index) => (
          <motion.div
            key={stat.titre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.titre}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.valeur}</div>
                <p className={`text-xs ${stat.evolution.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                  {stat.evolution} par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Consommation Énergétique</CardTitle>
            <Tabs value={periode} onValueChange={setPeriode}>
              <TabsList>
                <TabsTrigger value="journaliere">Jour</TabsTrigger>
                <TabsTrigger value="hebdomadaire">Semaine</TabsTrigger>
                <TabsTrigger value="mensuelle">Mois</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solaire" name="Énergie Solaire" fill="#eab308" stackId="a" />
                <Bar dataKey="reseau" name="Réseau Électrique" fill="#3b82f6" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition de l'Énergie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repartitionEnergie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {repartitionEnergie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Conseils d'Économie d'Énergie</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setConseilsVisible(!conseilsVisible)}>
                {conseilsVisible ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={false}
              animate={{ height: conseilsVisible ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2">
                {conseilsEconomie.map((conseil, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>{conseil}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

