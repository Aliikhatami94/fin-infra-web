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
    stroke: "#888888",
    fontSize: 12,
    tick: { fill: "#888888" },
    tickLine: true,
    axisLine: true,
    tickMargin: 8,
  }

  if (props.axis === "x") {
    const { axis: _axis, ...rest } = props
    return <XAxis {...sharedProps} {...rest} />
  }

  const { axis: _axis, width = 48, ...rest } = props
  return <YAxis {...sharedProps} width={width} {...rest} />
}
