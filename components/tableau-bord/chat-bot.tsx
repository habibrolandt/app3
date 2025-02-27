"use client"

import * as React from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Erreur lors de l'envoi du message. Veuillez réessayer." }])
    }
  }

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        size="icon"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          "fixed bottom-[100px] right-4 w-[320px] transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Assistant Irrigation</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea className="h-[300px] pr-2" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Comment puis-je vous aider avec votre irrigation ?
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex w-max max-w-[90%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                        message.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-gray-200",
                      )}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 bg-gray-100">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-blue-600 text-white hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}