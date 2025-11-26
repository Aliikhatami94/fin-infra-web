# AI Chat Integration Plan

## Current State Analysis

### ✅ Already Exists

**Backend (fin-api):**
- `/v0/ai/chat` endpoint in `src/fin_api/routers/v0/ai.py`
- `/v0/ai/chat/history` - Get conversation history
- `/v0/ai/categorize` - Transaction categorization
- Uses `fin-infra.chat.easy_financial_conversation`
- Lazy-loaded chatbot with OpenAI provider

**Frontend (fin-web):**
- `components/ai-chat-sidebar.tsx` - Full chat UI component
- Message history, typing indicators, autoplay
- Conversation management
- Already integrated in dashboard layout (commented out)

**AI Infrastructure (ai-infra):**
- `CoreLLM` - Direct LLM interface (chat, streaming)
- `CoreAgent` - Agent with tools, streaming, fallbacks
- Providers: OpenAI, Anthropic, Google GenAI, xAI, MistralAI
- Streaming support: `astream_agent_tokens`, `arun_agent_stream`
- Tool calling with HITL (Human-in-the-Loop)

### ❌ Missing / Needs Implementation

1. **Backend streaming endpoint** - Current `/v0/ai/chat` doesn't stream responses
2. **Frontend API client** - No fetch functions for AI endpoints
3. **Real-time streaming** - Frontend needs SSE or WebSocket integration
4. **Financial context injection** - Need to pass user's account data to AI
5. **Tool integration** - AI should call backend APIs for real-time data
6. **Error handling** - Graceful degradation when AI unavailable

---

## Implementation Plan

### Phase 1: Backend Streaming Endpoint (fin-api) ✅ COMPLETE

**File**: `src/fin_api/routers/v0/ai.py`

**✅ Implemented:**
- `/v0/ai/chat/stream` - Streaming chat with SSE
- `/v0/ai/providers` - List available providers and models
- Provider-agnostic: Users can choose OpenAI, Gemini, Claude, Grok, or Mistral
- Updated `ChatRequest` model with `provider` and `model` fields
- Smart defaults: Gemini 2.0 Flash (most cost-effective)

Add streaming chat endpoint:

```python
from fastapi.responses import StreamingResponse
from ai_infra.llm import CoreAgent, Providers, Models

agent = CoreAgent()  # Initialize once at module level

@router.post("/chat/stream")
async def stream_financial_chat(request: ChatRequest) -> StreamingResponse:
    """
    Stream AI responses for financial chat.
    
    Uses ai-infra's CoreAgent with streaming for real-time responses.
    """
    async def generate():
        try:
            # Build context from user data
            context_msg = build_financial_context(request.user_id, request.context)
            
            # Create messages array
            messages = [
                {"role": "system", "content": context_msg},
                {"role": "user", "content": request.question}
            ]
            
            # Stream tokens from agent
            async for token, meta in agent.astream_agent_tokens(
                messages=messages,
                provider=Providers.google_genai,  # Fast and cheap
                model_name=Models.google_genai.gemini_2_5_flash.value,
                model_kwargs={"temperature": 0.7},
            ):
                # Yield as SSE format
                yield f"data: {json.dumps({'token': token})}\n\n"
            
            # Final message to close stream
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

def build_financial_context(user_id: str, additional_context: dict | None) -> str:
    """Build system prompt with user's financial data."""
    # TODO: Fetch user's actual financial data
    # - Net worth from dashboard
    # - Recent transactions
    # - Portfolio allocation
    # - Budget status
    return f"""You are a helpful financial assistant for a personal finance app.
    
User: {user_id}
Current net worth: {additional_context.get('net_worth', 'Unknown')}
Monthly income: {additional_context.get('income', 'Unknown')}

Provide helpful, actionable financial advice. Be concise and specific.
"""
```

### Phase 2: Frontend API Client

**File**: `lib/api/client.ts`

Add AI chat functions:

```typescript
/**
 * Stream AI chat responses
 */
export async function streamAIChat(
  question: string,
  userId: string,
  context?: Record<string, any>,
  onToken?: (token: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  const token = localStorage.getItem("auth_token")
  if (!token) throw new Error("No auth token")

  const response = await fetch(`${API_URL}/v0/ai/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question, user_id: userId, context }),
  })

  if (!response.ok) {
    throw new Error(`Failed to stream chat: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error("No response body")

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") return

          try {
            const parsed = JSON.parse(data)
            if (parsed.error) {
              onError?.(new Error(parsed.error))
            } else if (parsed.token) {
              onToken?.(parsed.token)
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Get AI chat history
 */
export async function fetchAIChatHistory(userId: string) {
  return apiFetch<{
    user_id: string
    exchanges: Array<{
      question: string
      answer: string
      timestamp: string | null
    }>
    count: number
  }>(`/v0/ai/chat/history?user_id=${userId}`)
}

/**
 * Clear AI chat history
 */
export async function clearAIChatHistory(userId: string) {
  return apiFetch<{ success: boolean; message: string }>(
    `/v0/ai/chat/history?user_id=${userId}`,
    { method: "DELETE" }
  )
}
```

### Phase 3: Update AI Chat Sidebar Component

**File**: `components/ai-chat-sidebar.tsx`

Add streaming support:

```typescript
const handleSubmit = async () => {
  if (!input.trim() || !user?.id) return

  const userMsg: AIChatMessage = {
    id: Date.now().toString(),
    role: "user",
    content: input.trim(),
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMsg])
  setInput("")
  setIsTyping(true)

  // Collect streamed response
  let assistantContent = ""
  const assistantMsgId = (Date.now() + 1).toString()

  try {
    await streamAIChat(
      userMsg.content,
      user.id,
      {
        net_worth: kpiData?.netWorth,
        income: kpiData?.monthlyIncome,
      },
      (token) => {
        // Append token to response
        assistantContent += token
        
        // Update message in real-time
        setMessages((prev) => {
          const existing = prev.find((m) => m.id === assistantMsgId)
          if (existing) {
            return prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: assistantContent }
                : m
            )
          } else {
            return [
              ...prev,
              {
                id: assistantMsgId,
                role: "assistant",
                content: assistantContent,
                timestamp: new Date(),
              },
            ]
          }
        })
      },
      (error) => {
        console.error("Chat error:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "I'm sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
        ])
      }
    )
  } catch (error) {
    console.error("Failed to send message:", error)
  } finally {
    setIsTyping(false)
  }
}
```

### Phase 4: Enable in Dashboard Layout

**File**: `app/dashboard/layout.tsx`

Uncomment and configure AI chat:

```typescript
// Enable AI chat with real backend integration
<AIChatSidebar
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
  title="Financial Assistant"
  // Remove mock response generator - use real streaming
  onMessagesChange={handleMessagesChange}
/>
```

### Phase 5: Add Financial Tools for AI

**Backend tools** (in fin-api):

```python
# File: src/fin_api/routers/v0/ai_tools.py

from langchain.tools import tool

@tool
def get_account_balance(account_id: str) -> dict:
    """Get current balance for a specific account."""
    # Call banking API
    return {"account_id": account_id, "balance": 1234.56}

@tool
def get_recent_transactions(days: int = 7) -> list:
    """Get recent transactions for the user."""
    # Call transactions API
    return [{"description": "Coffee", "amount": -4.50, "date": "2025-11-24"}]

@tool
def get_budget_status() -> dict:
    """Get current budget vs actual spending."""
    # Call budget API
    return {"budget": 2000, "spent": 1500, "remaining": 500}

# Update streaming endpoint to include tools
async def stream_financial_chat(request: ChatRequest):
    tools = [get_account_balance, get_recent_transactions, get_budget_status]
    
    async for token, meta in agent.astream_agent_tokens(
        messages=messages,
        provider=Providers.google_genai,
        model_name=Models.google_genai.gemini_2_5_flash.value,
        tools=tools,  # ← Add tools here
        model_kwargs={"temperature": 0.7},
    ):
        yield f"data: {json.dumps({'token': token})}\n\n"
```

---

## Testing Plan

### 1. Backend Testing

```bash
# Test streaming endpoint
curl -N -X POST http://localhost:8000/v0/ai/chat/stream \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"What is my net worth?","user_id":"test-user"}'
```

### 2. Frontend Testing

- Open dashboard
- Click AI chat icon
- Type message
- Verify streaming response appears word-by-word
- Test error handling (disconnect backend)
- Test conversation history

### 3. Integration Testing

- Verify AI uses real account data
- Test tool calls (balance, transactions)
- Check response quality and accuracy

---

## Environment Variables

**Backend (.env)**:
```bash
# Required for ai-infra
GOOGLE_API_KEY=your_google_api_key
# Or use OpenAI
OPENAI_API_KEY=your_openai_key
# Or Anthropic
ANTHROPIC_API_KEY=your_anthropic_key
```

**Frontend (.env.local)**:
```bash
NEXT_PUBLIC_ENABLE_AI_CHAT=true
```

---

## Deployment Checklist

- [ ] Add AI provider API key to Railway/production env
- [ ] Test streaming endpoint in production
- [ ] Monitor token usage and costs
- [ ] Set up rate limiting for AI endpoints
- [ ] Add analytics for AI feature usage
- [ ] Create fallback responses for API failures
- [ ] Document AI capabilities for users

---

## Cost Considerations

**Google Gemini 2.0 Flash** (recommended):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Very fast, supports streaming

**OpenAI GPT-4o** (alternative):
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens
- Higher quality, more expensive

**Estimated costs:**
- 100 chats/day × 500 tokens/chat = 50K tokens/day
- Monthly: ~1.5M tokens = ~$0.50/month (Gemini) or ~$15/month (GPT-4o)

---

## Next Steps

1. ✅ Research complete - ai-infra fully supports streaming
2. 🔨 Implement backend streaming endpoint
3. 🔨 Add frontend API client functions
4. 🔨 Update AI chat sidebar with streaming
5. 🔨 Add financial tools for AI to call
6. 🔨 Test end-to-end integration
7. 🚀 Enable in production
