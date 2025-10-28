"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { X, TrendingUp, Plus, Sliders, ChevronUp, Clock } from "lucide-react"

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
  // Marketing/demo helpers
  prefillInput?: string | null
  autoplay?: boolean
  marketingMode?: boolean
  currentScenario?: string | null
  onScenarioChange?: (scenario: string) => void
  onMessagesChange?: (messages: AIChatMessage[]) => void
}

interface AIConversation {
  id: string
  title: string
  messages: AIChatMessage[]
  createdAt: Date
}

export function AIChatSidebar({
  isOpen,
  onClose,
  title = "AI Financial Assistant",
  icon: Icon = TrendingUp,
  initialMessages,
  promptPlaceholder = "Ask me anything about your account...",
  responseGenerator,
  beforeMessagesSlot,
  afterMessagesSlot,
  onSend,
  prefillInput,
  autoplay = false,
  marketingMode: _marketingMode = false,
  currentScenario: _currentScenario = null,
  onScenarioChange: _onScenarioChange,
  onMessagesChange,
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

  const initialMsgs = initialMessages ?? defaultMessages
  const [messages, setMessages] = useState<AIChatMessage[]>(initialMsgs)
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement | null>(null)
  const hasSavedCurrentRef = useRef(false)
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null)
  const scrollViewportRef = useRef<HTMLElement | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const autoplayRanForRef = useRef<string | null>(null)

  // Do not save conversations until the user actually sends a message
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  useEffect(() => {
    if (!initialMessages) return
    // If autoplay is enabled and we haven't run it for this batch, simulate reveal
    const batchKey = initialMessages.map((m) => m.id).join('|')
    if (autoplay && autoplayRanForRef.current !== batchKey) {
      autoplayRanForRef.current = batchKey
      let cancelled = false
      ;(async () => {
        setMessages([])
        setIsTyping(false)
        // small initial delay
        await new Promise((r) => setTimeout(r, 350))
        for (const msg of initialMessages) {
          if (cancelled) break
          if (msg.role === 'assistant') {
            setIsTyping(true)
            // type time proportional to content length
            const base = 350
            const perChar = 18
            const delay = Math.min(2000, base + Math.floor(Math.min(120, msg.content.length) * perChar))
            await new Promise((r) => setTimeout(r, delay))
            setIsTyping(false)
          } else {
            // brief delay for user messages too, but shorter
            await new Promise((r) => setTimeout(r, 220))
          }
          setMessages((prev) => [...prev, msg])
        }
      })()
      return () => {
        // cancel any pending sequence
        cancelled = true
        setIsTyping(false)
      }
    } else {
      setMessages(initialMessages)
    }
  }, [initialMessages, autoplay])

  // Prefill input when instructed (marketing/demo)
  useEffect(() => {
    if (prefillInput && !input) {
      setInput(prefillInput)
    }
  }, [prefillInput, input])

  // Auto-scroll to newest message when messages change or the panel opens
  useEffect(() => {
    // next frame to allow layout to settle
    const id = requestAnimationFrame(() => {
      if (isAtBottom || autoplay) {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    })
    return () => cancelAnimationFrame(id)
  }, [messages, isOpen, isAtBottom, autoplay])

  // Track scroll position of the ScrollArea viewport
  useEffect(() => {
    const root = scrollWrapperRef.current
    if (!root) return
    const viewport = root.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
    scrollViewportRef.current = viewport
    if (!viewport) return
    const handle = () => {
      const el = viewport
      const threshold = 32
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
      setIsAtBottom(atBottom)
    }
    viewport.addEventListener('scroll', handle, { passive: true })
    // initialize
    handle()
    return () => viewport.removeEventListener('scroll', handle)
  }, [isOpen])

  // Emit messages change to parent when needed (e.g., to persist)
  useEffect(() => {
    onMessagesChange?.(messages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  // Keep current conversation in sync with messages and derive a simple title
  useEffect(() => {
    if (!currentConversationId) return
    const hasUserMessage = messages.some((m) => m.role === "user")
    // Only keep a saved conversation updated after the first user message exists
    if (!hasUserMessage) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversationId
          ? {
              ...c,
              messages,
              title: messages.find((m) => m.role === "user")?.content.slice(0, 40) || c.title,
            }
          : c,
      ),
    )
  }, [messages, currentConversationId])

  const handleNewChat = () => {
    const base: AIChatMessage[] = defaultMessages
    // Reset to a fresh, unsaved conversation (not added to history until user sends a message)
    setCurrentConversationId(null)
    hasSavedCurrentRef.current = false
    setMessages(base)
    setInput("")
  }

  const openConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (!conv) return
    setCurrentConversationId(conv.id)
    hasSavedCurrentRef.current = true
    setMessages(conv.messages)
    setInput("")
    // scroll will happen via effect
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => {
      const next = [...prev, userMessage]
      // If this is the first user message in an unsaved chat, create and save it now
      if (!currentConversationId && !hasSavedCurrentRef.current) {
        const newId = `c-${Date.now()}`
        const newConv: AIConversation = {
          id: newId,
          title: userMessage.content.slice(0, 40) || "New chat",
          messages: next,
          createdAt: new Date(),
        }
        setConversations((prevC) => [newConv, ...prevC])
        setCurrentConversationId(newId)
        hasSavedCurrentRef.current = true
      }
      return next
    })
    onSend?.(userMessage)
    setInput("")

    // Simulate AI response with a brief typing delay
    setIsTyping(true)
    const simulated = getAIResponse(input)
    const delay = Math.min(1800, 400 + Math.floor(Math.min(160, simulated.length) * 12))
    setTimeout(() => {
      const aiMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: simulated,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, delay)
  }

  const getAIResponse = (query: string): string => {
    if (responseGenerator) {
      return responseGenerator(query)
    }

    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("automate") || lowerQuery.includes("strategy")) {
      return "I can help you set up an automated strategy that fits your style—rules based on indicators, price moves, or simple schedules. Tell me the signal you trust most, and I’ll sketch a first pass you can tweak in seconds."
    }
    if (lowerQuery.includes("portfolio") || lowerQuery.includes("optimize")) {
      return "Looking at your portfolio, a small rebalance could lower hiccups without cutting growth. Want a quick proposal with the exact trades and the before/after picture so you can sanity‑check it?"
    }
    if (lowerQuery.includes("risk") || lowerQuery.includes("stop loss")) {
      return "We can add guardrails that run in the background—like a 5–7% stop for volatile names or a trailing stop that locks in gains. Say the word and I’ll wire it up to your current positions."
    }
    return "Got it. If you share the outcome you want—grow, protect, or simplify—I’ll suggest the cleanest path and set up the pieces for you to approve."
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 right-0 w-full sm:w-[clamp(300px,85vw,380px)] md:w-[clamp(340px,42vw,400px)] lg:w-[clamp(360px,36vw,420px)] xl:w-[clamp(380px,32vw,440px)] bg-card border-l shadow-lg z-[70] flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border/40 bg-card/80 text-primary shadow-sm">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <h2 className="font-semibold">{title}</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewChat}
                aria-label="Start new chat"
                title="New chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
              {/* Scenario switcher removed; configure via URL params (marketing, chat, scenario) */}
              {conversations.length === 0 ? (
                <Button variant="ghost" size="icon" aria-label="Conversation history" title="No history" disabled>
                  <Clock className="h-4 w-4" />
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Conversation history" title="History">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel>Previous conversations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {conversations.map((c) => (
                      <DropdownMenuItem key={c.id} onClick={() => openConversation(c.id)} className="py-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{c.title || "New chat"}</div>
                          <div className="text-xs text-muted-foreground">
                            {c.createdAt.toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close assistant">
                <X className="h-4 w-4" />
              </Button>
            </div>
      </div>

      <div ref={scrollWrapperRef} className="min-h-0 flex-1">
      <ScrollArea className="size-full p-4">
        <div className="space-y-4">
          {beforeMessagesSlot}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" ? (
                <div className="w-full space-y-2">
                  <p className="text-sm leading-snug text-foreground">{message.content}</p>
                  <p className="mt-0.5 text-[10px] leading-none opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ) : (
                <div className="inline-block max-w-[80%] rounded-2xl bg-muted/60 px-3 py-2 text-foreground space-y-2">
                  <p className="text-sm leading-snug">{message.content}</p>
                  <p className="mt-0.5 text-[10px] leading-none opacity-60 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-full space-y-2">
                <p className="text-sm leading-snug text-muted-foreground">Assistant is typing…</p>
              </div>
            </div>
          )}
          {afterMessagesSlot}
          <div ref={endRef} />
        </div>
      </ScrollArea>
      </div>

      {!isAtBottom && (
        <div className="pointer-events-auto absolute bottom-24 left-0 right-0 flex justify-center">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full shadow"
            onClick={() => {
              endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }}
          >
            Jump to latest
          </Button>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={promptPlaceholder}
            className="min-h-[100px] max-h-[200px] resize-none overflow-y-auto pr-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>
        {/* Bottom controls - placed below the textarea to avoid overlap with text */}
        <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
