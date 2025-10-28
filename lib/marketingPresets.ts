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
            "I took a fresh pass at your portfolio and noticed you're a bit overweight in tech (~45%). That's worked well recently, but it concentrates risk. If you're open to it, I can suggest a calmer allocation that still keeps upside exposure while smoothing drawdowns.",
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
            'Here’s a balanced starting point: 35% US Total Market, 15% International, 10% Tech tilt, 25% Intermediate Bonds, 10% TIPS, and 5% Cash/Short-Term. Based on your history, this would have reduced peak drawdowns by ~22% while keeping long-term returns within 0.6% of your current trajectory.',
          timestamp: now(),
        },
        {
          id: 'm-4',
          role: 'user',
          content: 'How would that affect my monthly volatility?',
          timestamp: now(),
        },
        {
          id: 'm-5',
          role: 'assistant',
          content:
            'Monthly volatility would drop from ~6.1% to ~4.7% on average. In practical terms: fewer sharp swings and a higher chance of staying invested through dips. I can also add a lightweight 5% tech momentum sleeve if you want a little extra growth kicker.',
          timestamp: now(),
        },
        {
          id: 'm-6',
          role: 'user',
          content: 'Let’s try it. Can you stage the trades so taxes are minimized?',
          timestamp: now(),
        },
        {
          id: 'm-7',
          role: 'assistant',
          content:
            'Absolutely. I’ll prioritize tax-advantaged accounts first and use existing lots to harvest losses where it makes sense. Estimated realized gains are near zero; fees look minimal. Ready for me to draft the orders for review?',
          timestamp: now(),
        },
      ]

    case 'budget':
      return [
        {
          id: 'm-1',
          role: 'assistant',
          content:
            'Heads up: dining is trending +18% month over month. Totally normal this time of year, but if you want to rein it in, we can use a soft cap and a gentle weekly check-in—no shaming, just a nudge.',
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
          content:
            'Done. Dining cap set to $300 with a friendly Friday reminder at 9am. I’ll also surface a mid-week heads-up if you cross 80% of the cap so you can course-correct without stress.',
          timestamp: now(),
        },
        {
          id: 'm-4',
          role: 'user',
          content: 'Can you suggest one cut that won’t feel painful?',
          timestamp: now(),
        },
        {
          id: 'm-5',
          role: 'assistant',
          content:
            'One easy win: move two weekday lunches to home-prepped meals. That alone saves ~$46 this month based on your recent average. I can drop a quick grocery list into your notes app if that helps.',
          timestamp: now(),
        },
        {
          id: 'm-6',
          role: 'user',
          content: 'Yes, add the grocery list and keep the reminders.',
          timestamp: now(),
        },
        {
          id: 'm-7',
          role: 'assistant',
          content:
            'All set. I added a 10‑item list with easy meals under 10 minutes. I’ll check in next Friday and we can adjust the cap if it felt too tight.',
          timestamp: now(),
        },
      ]

    case 'crypto':
      return [
        { id: 'm-1', role: 'assistant', content: 'BTC is up ~2.4% today while ETH is roughly flat. If we move to a clean 70/30 BTC/ETH split, your risk stays focused but the variance tightens a bit. Want me to stage a small rebalance?', timestamp: now() },
        { id: 'm-2', role: 'user', content: "What's the impact if BTC pulls back 5%?", timestamp: now() },
        { id: 'm-3', role: 'assistant', content: 'If BTC gives back 5%, your portfolio drawdown would be about −3.1% in this setup. If you’d like, I can add a 4% trailing stop on BTC to cap downside without constantly babysitting the chart.', timestamp: now() },
        { id: 'm-4', role: 'user', content: 'Let’s do the trailing stop and a small rebalance.', timestamp: now() },
        { id: 'm-5', role: 'assistant', content: 'You got it. I’ll shift 3% from ETH to BTC to clean up the ratio and place a 4% trailing stop on BTC. You’ll get a heads-up before anything executes so you can approve with one tap.', timestamp: now() },
      ]

    default:
      return [
        {
          id: 'm-1',
          role: 'assistant',
          content:
            "Welcome back! I’m your AI Financial Assistant—happy to help with accounts, budgets, investments, or automations. If you tell me your goal, I’ll shape the plan around it.",
          timestamp: now(),
        },
        { id: 'm-2', role: 'user', content: 'How did my net worth change this month?', timestamp: now() },
        {
          id: 'm-3',
          role: 'assistant',
          content:
            'You’re up $4,820 this month (↑2.6%). The biggest tailwind was your brokerage at +$3,100, followed by 401(k) contributions and a small cash build. Would you like a clean breakdown by category or by account?',
          timestamp: now(),
        },
        { id: 'm-4', role: 'user', content: 'Show me by category, and flag anything unusual.', timestamp: now() },
        {
          id: 'm-5',
          role: 'assistant',
          content:
            'By category: Investments +$3,640, Retirement +$920, Cash +$410, Liabilities −$150. One small anomaly: utilities spiked ~22% after a back-billed charge. I can set a one-time note so it doesn’t skew your trendline—want me to do that?',
          timestamp: now(),
        },
        { id: 'm-6', role: 'user', content: 'Yes, add the note and keep me posted if it repeats.', timestamp: now() },
        {
          id: 'm-7',
          role: 'assistant',
          content:
            'Added. I’ll watch that category and let you know if it trends instead of being a one-off. Anything else you want to dig into while we’re here?',
          timestamp: now(),
        },
      ]
  }
}
