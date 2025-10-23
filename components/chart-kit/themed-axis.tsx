"use client"

import { XAxis, YAxis, type XAxisProps, type YAxisProps } from "recharts"

interface ThemedXAxisProps extends XAxisProps {
  axis: "x"
}

interface ThemedYAxisProps extends YAxisProps {
  axis: "y"
}

type ThemedAxisProps = ThemedXAxisProps | ThemedYAxisProps

export function ThemedAxis(props: ThemedAxisProps) {
  const sharedProps = {
    tickLine: false,
    axisLine: false,
    stroke: "hsl(var(--muted-foreground))",
    fontSize: 12,
    tick: { fill: "hsl(var(--muted-foreground))" },
  }

  if (props.axis === "x") {
    const { axis: _axis, ...rest } = props
    return <XAxis {...sharedProps} {...rest} />
  }

  const { axis: _axis, width = 48, ...rest } = props
  return <YAxis {...sharedProps} width={width} {...rest} />
}
