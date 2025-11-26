"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { X, Plus, Sliders, ChevronUp, Clock, CheckIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Markdown } from "@/components/ui/markdown"
import { getProviderIcon, AI_PROVIDER_NAMES, type AIProviderKey } from "@/components/icons/ai-provider-icons"
import type { AIProvidersResponse } from "@/lib/api/client"

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
  title = "",
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

  // AI Provider selection
  const [providers, setProviders] = useState<AIProvidersResponse | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")

  // Resizable sidebar (large screens only)
  const MIN_WIDTH = 320
  const MAX_WIDTH = 560
  const DEFAULT_WIDTH = 420
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH)
  const isResizingRef = useRef(false)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  // Handle resize drag
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizingRef.current = true
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return
      // Calculate new width from right edge of viewport
      const newWidth = window.innerWidth - e.clientX
      setSidebarWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)))
    }
    
    const handleMouseUp = () => {
      isResizingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  // Load providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const { fetchAIProviders } = await import("@/lib/api/client")
        const data = await fetchAIProviders()
        setProviders(data)
        setSelectedProvider(data.default.provider)
        setSelectedModel(data.default.model)
      } catch (error) {
        console.error("Failed to load AI providers:", error)
      }
    }
    loadProviders()
  }, [])

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

  const handleSend = async () => {
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
    
    const question = input
    setInput("")
    setIsTyping(true)

    // Create placeholder AI message for streaming
    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: AIChatMessage = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, aiMessage])

    // Use real streaming if not in marketing mode, otherwise use mock
    if (!_marketingMode && responseGenerator === undefined) {
      // Real streaming from backend
      const { streamAIChat } = await import("@/lib/api/client")
      
      try {
        await streamAIChat({
          userId: "user_123", // TODO: Get from auth context
          question,
          provider: selectedProvider,
          model: selectedModel,
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: msg.content + token }
                  : msg
              )
            )
          },
          onComplete: () => {
            setIsTyping(false)
          },
          onError: (error) => {
            console.error("AI chat error:", error)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { 
                      ...msg, 
                      content: "I'm sorry, I encountered an error. Please try again." 
                    }
                  : msg
              )
            )
            setIsTyping(false)
          },
        })
      } catch (error) {
        console.error("Failed to stream AI chat:", error)
        setIsTyping(false)
      }
    } else {
      // Mock response for marketing mode or when responseGenerator is provided
      const simulated = getAIResponse(question)
      const delay = Math.min(1800, 400 + Math.floor(Math.min(160, simulated.length) * 12))
      
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: simulated }
              : msg
          )
        )
        setIsTyping(false)
      }, delay)
    }
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
          data-chat-sidebar
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? sidebarWidth : undefined }}
          className="fixed inset-y-0 right-0 w-full sm:w-[clamp(300px,85vw,380px)] md:w-[clamp(340px,42vw,400px)] lg:w-auto bg-card border-l shadow-lg z-[120] flex flex-col"
        >
          {/* Resize handle - visible on large screens only, positioned on the border */}
          <div
            ref={resizeHandleRef}
            onMouseDown={handleResizeStart}
            className="hidden lg:flex absolute -left-1.5 top-0 bottom-0 w-3 cursor-ew-resize z-10 items-center justify-center group"
          >
            {/* Gripper dots pattern - centered on the border line */}
            <div className="flex flex-col gap-1 p-1 rounded bg-card border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-0.5 h-1 rounded-full bg-muted-foreground" />
              <div className="w-0.5 h-1 rounded-full bg-muted-foreground" />
              <div className="w-0.5 h-1 rounded-full bg-muted-foreground" />
            </div>
          </div>
          
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              {title ? <h2 className="text-sm font-semibold">{title}</h2> : null}
            </div>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewChat}
                    aria-label="Start new chat"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New chat</TooltipContent>
              </Tooltip>
              {/* Scenario switcher removed; configure via URL params (marketing, chat, scenario) */}
              {conversations.length === 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button variant="ghost" size="icon" aria-label="Conversation history" disabled>
                        <Clock className="h-4 w-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>No history</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Conversation history">
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
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>History</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </div>
      </div>

      <div ref={scrollWrapperRef} className="min-h-0 flex-1">
      <ScrollArea className="size-full">
        <div className="space-y-4 p-4">
          {beforeMessagesSlot}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" ? (
                <div className="w-full space-y-2">
                  <Markdown content={message.content} className="text-sm" />
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
          {!isAtBottom && (
            <div className="sticky bottom-2 flex justify-center">
              <Button
                size="sm"
                variant="secondary"
                // when hovered i want the button to rise a bit
                className="rounded-full mt-2 hover:opacity-100 active:opacity-100 focus:opacity-100 hover:bg-secondary hover:shadow hover:transition hover:translate-y-[-2px]"
                onClick={() => {
                  endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
                }}
              >
                Jump to latest
              </Button>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>
      </div>

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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 rounded-md"
                  aria-label="Add attachment"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add attachment</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 gap-1.5 px-2 rounded-md"
                      aria-label="AI Provider Settings"
                    >
                      {(() => {
                        const ProviderIcon = getProviderIcon(selectedProvider)
                        return ProviderIcon ? <ProviderIcon className="h-4 w-4" /> : <Sliders className="h-4 w-4" />
                      })()}
                      <span className="text-xs text-muted-foreground max-w-[80px] truncate">
                        {providers?.providers[selectedProvider]?.models.find(m => m.id === selectedModel)?.name || selectedModel || "Model"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>AI Provider & Model</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Select AI Provider</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {providers && Object.entries(providers.providers).map(([key, provider]) => {
                  const ProviderIcon = getProviderIcon(key)
                  const isSelected = key === selectedProvider
                  const isAvailable = provider.available
                  
                  return (
                    <DropdownMenuSub key={key}>
                      <DropdownMenuSubTrigger 
                        className={`${isSelected ? "font-medium" : ""} ${!isAvailable ? "opacity-50 pointer-events-none" : ""}`}
                        data-state={isSelected ? "checked" : undefined}
                        disabled={!isAvailable}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {ProviderIcon && <ProviderIcon className="h-4 w-4" />}
                          <span>{provider.name}</span>
                        </div>
                        {isSelected && (
                          <CheckIcon className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuSubTrigger>
                      {isAvailable && (
                        <DropdownMenuSubContent className="w-56">
                          {provider.models.map((model) => {
                            const isModelSelected = key === selectedProvider && model.id === selectedModel
                            return (
                              <DropdownMenuItem
                                key={model.id}
                                data-state={isModelSelected ? "checked" : undefined}
                                onClick={() => {
                                  setSelectedProvider(key)
                                  setSelectedModel(model.id)
                                }}
                              >
                                <span className={`flex-1 lowercase ${isModelSelected ? "font-medium" : ""}`}>
                                  {model.id}
                                </span>
                                {isModelSelected && (
                                  <CheckIcon className="h-4 w-4 text-primary shrink-0" />
                                )}
                              </DropdownMenuItem>
                            )
                          })}
                        </DropdownMenuSubContent>
                      )}
                    </DropdownMenuSub>
                  )
                })}
                {!providers && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Loading providers...
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  className="h-8 w-8 rounded-md"
                  onClick={handleSend}
                  aria-label="Send message"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
