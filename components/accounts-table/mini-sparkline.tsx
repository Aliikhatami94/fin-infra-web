interface MiniSparklineProps {
  trend: number
}

export function MiniSparkline({ trend }: MiniSparklineProps) {
  const points = 7
  const data: number[] = []

  for (let i = 0; i < points; i += 1) {
    const value = 50 + Math.random() * 20 + (trend > 0 ? i * 2 : -i * 2)
    data.push(value)
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const pointsStr = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  const color = trend > 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"

  return (
    <svg className="w-12 h-6" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={pointsStr}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
