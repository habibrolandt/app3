import { io, type Socket } from "socket.io-client"
import { create } from "zustand"

export interface DonneeCapteur {
  _id: string
  humiditeSol: number
  pluieDetectee: boolean
  modeManuel: boolean
  systemeGlobal: boolean
  pompeActivee: boolean
  message?: string
  date: string
}

type SocketState = {
  socket: Socket | null
  connected: boolean
  lastData: DonneeCapteur | null
  dataHistory: DonneeCapteur[]
}

type SocketActions = {
  connect: () => void
  disconnect: () => void
  setLastData: (data: DonneeCapteur) => void
  addToHistory: (data: DonneeCapteur) => void
}

export const useSocketStore = create<SocketState & SocketActions>()((set, get) => ({
  socket: null,
  connected: false,
  lastData: null,
  dataHistory: [],

  connect: () => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Number.POSITIVE_INFINITY,
      withCredentials: true,
    })

    socket.on("connect", () => {
      set((state) => ({ ...state, connected: true }))
      console.log("Connected to server")
    })

    socket.on("disconnect", () => {
      set((state) => ({ ...state, connected: false }))
      console.log("Disconnected from server")
    })

    socket.on("nouvelles-donnees", (data: DonneeCapteur) => {
      set((state) => ({
        ...state,
        lastData: data,
        dataHistory: [data, ...state.dataHistory].slice(0, 100),
      }))
      console.log("Received new data:", data)
    })

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
    })

    set((state) => ({ ...state, socket }))
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set((state) => ({ ...state, socket: null, connected: false }))
    }
  },

  setLastData: (data: DonneeCapteur) => {
    set((state) => ({ ...state, lastData: data }))
  },

  addToHistory: (data: DonneeCapteur) => {
    set((state) => ({
      ...state,
      dataHistory: [data, ...state.dataHistory].slice(0, 100),
    }))
  },
}))

