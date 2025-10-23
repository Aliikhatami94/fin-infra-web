import { formatCurrency, formatNumber, formatPercent } from "@/lib/format"

type Formatter = (value: number) => string

type DescribeTimeSeriesArgs<T> = {
  data: T[]
  metric: string
  getLabel: (point: T) => string
  getValue: (point: T) => number
  formatValue?: Formatter
  includeEndValue?: boolean
}

export function describeTimeSeries<T>({
  data,
  metric,
  getLabel,
  getValue,
  formatValue = (value) => formatNumber(value, { maximumFractionDigits: 0 }),
  includeEndValue = true,
}: DescribeTimeSeriesArgs<T>) {
  if (!data || data.length === 0) {
    return `No data available for ${metric}.`
  }

  const firstPoint = data[0]
  const lastPoint = data[data.length - 1]

  const startValue = getValue(firstPoint)
  const endValue = getValue(lastPoint)
  const delta = endValue - startValue
  const changeDirection = delta === 0 ? "remained unchanged" : delta > 0 ? "increased" : "decreased"
  const changeMagnitude = formatValue(Math.abs(delta))
  const percentChange =
    startValue !== 0
      ? formatPercent(Math.abs((delta / startValue) * 100), { maximumFractionDigits: 1 })
      : null

  const startLabel = getLabel(firstPoint)
  const endLabel = getLabel(lastPoint)

  const endValueText = includeEndValue ? ` and ended at ${formatValue(endValue)}` : ""
  const percentText = percentChange ? ` (${percentChange})` : ""

  if (delta === 0) {
    return `${metric} from ${startLabel} to ${endLabel}${endValueText} and ${changeDirection}.`
  }

  return `${metric} from ${startLabel} to ${endLabel}${endValueText} ${changeDirection} by ${changeMagnitude}${percentText}.`
}

export const currencySummaryFormatter: Formatter = (value) =>
  formatCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const numberSummaryFormatter: Formatter = (value) =>
  formatNumber(value, { maximumFractionDigits: 0 })
