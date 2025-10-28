import type { AIChatMessage } from '@/components/ai-chat-sidebar'

function now(): Date {
  return new Date()
}

export function getMarketingChatPreset(name?: string | null): AIChatMessage[] {
  const scenario = (name ?? '').toLowerCase()

  switch (scenario) {
    case 'portfolio':
      return [
        {
          id: 'm-1',
          role: 'assistant',
          content:
            "Hi! I analyzed your portfolio. You're a bit overweight in tech (45%). Want a quick rebalance suggestion?",
          timestamp: now(),
        },
        {
          id: 'm-2',
          role: 'user',
          content: 'Yes, show me a 60/40 variant with lower volatility.',
          timestamp: now(),
        },
        {
          id: 'm-3',
          role: 'assistant',
          content:
            'Proposed: 35% US Total Market, 15% Intl, 10% Tech, 25% Bonds, 15% Cash/Short-Term. Est. -22% variance vs current. Apply?',
          timestamp: now(),
        },
      ]

    case 'budget':
      return [
        {
          id: 'm-1',
          role: 'assistant',
          content: 'Your dining category is trending +18% MoM. Want me to set a soft cap and weekly reminder?',
          timestamp: now(),
        },
        {
          id: 'm-2',
          role: 'user',
          content: 'Set a $300 cap and remind me on Fridays.',
          timestamp: now(),
        },
        {
          id: 'm-3',
          role: 'assistant',
          content: 'Done. Cap set to $300 with weekly Friday reminders at 9am. I will notify if you exceed 80% mid-week.',
          timestamp: now(),
        },
      ]

    case 'crypto':
      return [
        { id: 'm-1', role: 'assistant', content: 'BTC is +2.4% today; ETH is flat. Want to rebalance to 70/30 BTC/ETH?', timestamp: now() },
        { id: 'm-2', role: 'user', content: "What's the impact if BTC pulls back 5%?", timestamp: now() },
        { id: 'm-3', role: 'assistant', content: 'Portfolio drawdown est. -3.1%. I can set a trailing stop at 4% for BTC—apply?', timestamp: now() },
      ]

    default:
      return [
        {
          id: 'm-1',
          role: 'assistant',
          content:
            "Hello! I'm your AI Financial Assistant. Ask about accounts, budgets, investments, or set automations.",
          timestamp: now(),
        },
        { id: 'm-2', role: 'user', content: 'How did my net worth change this month?', timestamp: now() },
        {
          id: 'm-3',
          role: 'assistant',
          content:
            'Net worth +$4,820 (↑2.6%). Biggest gains from brokerage (+$3,100). Do you want a breakdown by category?',
          timestamp: now(),
        },
      ]
  }
}
