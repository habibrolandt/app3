"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ArduinoCommand {
  device: string
  action: string
  value?: number | boolean | string
  zone?: string
}

interface UseArduinoOptions {
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export function useArduino(options: UseArduinoOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastResult, setLastResult] = useState<any>(null)
  const { toast } = useToast()

  // Fonction pour envoyer une commande à l'Arduino
  const sendCommand = async (command: ArduinoCommand) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/arduino/commande", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi de la commande: ${response.status}`)
      }

      const result = await response.json()
      setLastResult(result)

      // Afficher une notification de succès
      toast({
        title: "Commande envoyée",
        description: `${command.action} envoyé à ${command.device}`,
      })

      // Appeler le callback de succès si fourni
      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)

      // Afficher une notification d'erreur
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })

      // Appeler le callback d'erreur si fourni
      if (options.onError) {
        options.onError(error)
      }

      throw error
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour récupérer l'état d'un appareil
  const getDeviceStatus = async (deviceId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/arduino/commande?device=${deviceId}`)

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'état: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    sendCommand,
    getDeviceStatus,
    loading,
    error,
    lastResult,
  }
}
