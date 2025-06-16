"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Droplet, AlertTriangle, HandIcon as HandWater } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function IrrigationManuelle() {
  const [irrigationActive, setIrrigationActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const toggleIrrigation = async () => {
    setLoading(true)
    const nouvelEtat = !irrigationActive

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 800))

      setIrrigationActive(nouvelEtat)
      toast({
        title: nouvelEtat ? "Irrigation manuelle activée" : "Irrigation manuelle désactivée",
        description: nouvelEtat
          ? "L'irrigation manuelle a été démarrée avec succès."
          : "L'irrigation manuelle a été arrêtée.",
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation de l'irrigation manuelle.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-2 border-amber-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <HandWater className="h-5 w-5 text-amber-600" />
          Irrigation Manuelle
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
            <div>
              <Label htmlFor="irrigation-manuelle" className="font-medium text-amber-800">
                Mode manuel
              </Label>
              <p className="text-sm text-amber-700">
                Utiliser uniquement en cas de défaillance du système automatique. L'irrigation manuelle n'est pas
                optimisée pour économiser l'eau.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Droplet className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800">Contrôle manuel</h3>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              {irrigationActive
                ? "L'irrigation manuelle est actuellement active. Vous pouvez l'arrêter à tout moment."
                : "Démarrez l'irrigation manuelle pour arroser immédiatement vos cultures."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Button
          id="irrigation-manuelle"
          onClick={toggleIrrigation}
          disabled={loading}
          className={cn(
            "w-full shadow-sm transition-all",
            irrigationActive ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700",
          )}
          variant={irrigationActive ? "destructive" : "default"}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Chargement...
            </span>
          ) : irrigationActive ? (
            "Arrêter l'irrigation"
          ) : (
            "Démarrer l'irrigation"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
