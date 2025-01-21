"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Droplet, AlertTriangle } from "lucide-react"
import { useToast } from "../../components/ui/use-toast"

export function IrrigationManuelle() {
  const [irrigationActive, setIrrigationActive] = useState(false)
  const { toast } = useToast()

  const toggleIrrigation = async () => {
    const nouvelEtat = !irrigationActive
    setIrrigationActive(nouvelEtat)

    try {
      const response = await fetch("/api/irrigation-manuelle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actif: nouvelEtat }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'activation de l'irrigation manuelle")
      }

      toast({
        title: nouvelEtat ? "Irrigation manuelle activée" : "Irrigation manuelle désactivée",
        description: nouvelEtat
          ? "L'irrigation manuelle a été démarrée avec succès."
          : "L'irrigation manuelle a été arrêtée.",
      })
    } catch (error) {
      console.error("Erreur:", error)
      setIrrigationActive(!nouvelEtat) // Revenir à l'état précédent en cas d'erreur
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation de l'irrigation manuelle.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5" />
          Irrigation Manuelle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <Label htmlFor="irrigation-manuelle" className="text-sm text-yellow-700">
              Utiliser uniquement en cas de défaillance du système automatique
            </Label>
          </div>
          <Button
            id="irrigation-manuelle"
            onClick={toggleIrrigation}
            variant={irrigationActive ? "destructive" : "default"}
            className="w-full"
          >
            {irrigationActive ? "Arrêter l'irrigation" : "Démarrer l'irrigation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

