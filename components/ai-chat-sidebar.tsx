"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Bot, User, Plus, Sliders, Clock, ChevronUp } from "lucide-react"

export interface AIChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  icon?: LucideIcon
  initialMessages?: AIChatMessage[]
  promptPlaceholder?: string
  responseGenerator?: (query: string) => string
  beforeMessagesSlot?: ReactNode
  afterMessagesSlot?: ReactNode
  onSend?: (message: AIChatMessage) => void
}

export function AIChatSidebar({
  isOpen,
  onClose,
  title = "AI Financial Assistant",
  icon: Icon = Bot,
  initialMessages,
  promptPlaceholder = "Ask me anything about your account...",
  responseGenerator,
  beforeMessagesSlot,
  afterMessagesSlot,
  onSend,
}: AIChatSidebarProps) {
  const defaultMessages = useMemo<AIChatMessage[]>(
    () => [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your AI Financial Assistant. I can help learn about your finances, optimize your portfolio, and provide insights based on your account data. How can I assist you today?",
        timestamp: new Date(),
      },
    ],
    [],
  )

  const [messages, setMessages] = useState<AIChatMessage[]>(initialMessages ?? defaultMessages)
  const [input, setInput] = useState("")

  useEffect(() => {
    if (!initialMessages) {
      return
    }

    setMessages(initialMessages)
  }, [initialMessages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    onSend?.(userMessage)
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 600)
  }

  const getAIResponse = (query: string): string => {
    if (responseGenerator) {
      return responseGenerator(query)
    }

    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("automate") || lowerQuery.includes("strategy")) {
      return "I can help you set up automated trading strategies. You can create rules based on technical indicators, price movements, or market conditions. Would you like to create a new strategy or modify an existing one?"
    }
    if (lowerQuery.includes("portfolio") || lowerQuery.includes("optimize")) {
      return "Based on your current portfolio, I recommend diversifying into tech and healthcare sectors. Your current allocation shows 45% in tech stocks. Would you like me to suggest specific rebalancing actions?"
    }
    if (lowerQuery.includes("risk") || lowerQuery.includes("stop loss")) {
      return "I can help you set up risk management rules. I recommend setting stop-loss orders at 5-7% below your entry price for volatile stocks. Would you like me to apply this to your current positions?"
    }
    return "I understand you're asking about trading automation. Could you provide more details about what you'd like to achieve? I can help with strategy creation, risk management, portfolio optimization, and market analysis."
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-card border-l shadow-lg z-[70] flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">{title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close assistant">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {beforeMessagesSlot}
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <Card
                className={`p-3 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {afterMessagesSlot}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={promptPlaceholder}
            className="min-h-[120px] resize-none pr-4 pb-14"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          
          {/* Bottom controls */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Button 
                type="button" 
                variant="ghost" 
                className="h-8 w-8 rounded-md" 
                aria-label="Add attachment"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="h-8 w-8 rounded-md" 
                aria-label="Settings"
              >
                <Sliders className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-x-4">
              <Button 
                type="button" 
                className="h-8 w-8 rounded-md" 
                onClick={handleSend}
                aria-label="Send message"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
