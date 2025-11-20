import { MicroSparkline } from "@/components/ui/micro-sparkline"

interface MiniSparklineProps {
  trend: number
  data: number[]
  label: string
}

export function MiniSparkline({ trend, data, label }: MiniSparklineProps) {
  const color = trend > 0 ? "rgb(34, 197, 94)" : trend < 0 ? "rgb(239, 68, 68)" : "rgb(148, 163, 184)"

  return (
    <MicroSparkline
      data={data}
      color={color}
      strokeWidth={4}
      className="h-6 w-16"
      ariaLabel={label}
    />
  )
}
