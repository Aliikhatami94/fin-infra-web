"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import { trackPreferenceSlider } from "@/lib/analytics/events"

export type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, defaultValue, value, min = 0, max = 100, ...props }, ref) => {
    const resolvedThumbs = React.useMemo(() => {
      if (Array.isArray(value)) return value.length
      if (Array.isArray(defaultValue)) return defaultValue.length
      return 1
    }, [value, defaultValue])

    return (
      <SliderPrimitive.Root
        ref={ref}
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full select-none items-center touch-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className="absolute h-full bg-primary data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: resolvedThumbs }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm transition-[color,box-shadow] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-ring/50 hover:ring-4 disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Root>
    )
  },
)
Slider.displayName = SliderPrimitive.Root.displayName

interface SliderFieldProps extends SliderProps {
  label?: React.ReactNode
  labelId?: string
  description?: React.ReactNode
  formatValue?: (values: number[]) => string
  hideValueLabel?: boolean
  containerClassName?: string
  analyticsId?: string
  analyticsLabel?: string
}

export const SliderField = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderFieldProps>(
  (
    {
      label,
      labelId: labelIdProp,
      description,
      formatValue = (values) => values.map((value) => Math.round(value)).join(" – "),
      hideValueLabel = false,
      containerClassName,
      className,
      defaultValue,
      value,
      onValueChange,
      min = 0,
      max = 100,
      analyticsId,
      analyticsLabel,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const fieldId = props.id ?? generatedId

    const resolvedValue = React.useMemo(() => {
      if (Array.isArray(value)) return value
      if (Array.isArray(defaultValue)) return defaultValue
      if (typeof value === "number") return [value]
      if (typeof defaultValue === "number") return [defaultValue]
      return [min, max]
    }, [value, defaultValue, min, max])

    const [displayValues, setDisplayValues] = React.useState<number[]>(resolvedValue)

    React.useEffect(() => {
      setDisplayValues(resolvedValue)
    }, [resolvedValue])

    const actualLabelId = React.useMemo(() => {
      if (!label) return undefined
      if (labelIdProp) return labelIdProp
      if (React.isValidElement(label) && (label as any).props?.id) {
        return (label as any).props.id as string
      }
      return `${fieldId}-label`
    }, [label, labelIdProp, fieldId])

    const descriptionId = description ? `${fieldId}-description` : undefined

    const resolvedAnalyticsLabel = React.useMemo(() => {
      if (analyticsLabel) return analyticsLabel
      if (typeof label === "string") return label
      return undefined
    }, [analyticsLabel, label])

    const renderedLabel = React.useMemo(() => {
      if (!label) return null
      if (React.isValidElement(label)) {
        if (actualLabelId && !(label as any).props?.id) {
          return React.cloneElement(label as any, { id: actualLabelId }) as any
        }
        return label
      }
      return (
        <span id={actualLabelId} className="text-sm font-medium text-foreground">
          {label}
        </span>
      )
    }, [label, actualLabelId])

    const handleValueChange = (values: number[]) => {
      setDisplayValues(values)
      const sliderIdForAnalytics = analyticsId ?? fieldId
      trackPreferenceSlider({ sliderId: sliderIdForAnalytics, label: resolvedAnalyticsLabel, values })
      onValueChange?.(values)
    }

    return (
      <div className={cn("flex w-full flex-col gap-2", containerClassName)}>
        {renderedLabel || !hideValueLabel ? (
          <div className="flex items-center justify-between gap-3">
            {renderedLabel}
            {!hideValueLabel ? (
              <output
                id={`${fieldId}-value`}
                htmlFor={fieldId}
                aria-live="polite"
                className="text-sm font-medium text-foreground tabular-nums"
              >
                {formatValue(displayValues)}
              </output>
            ) : null}
          </div>
        ) : null}
        {description ? (
          <p id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
        <Slider
          ref={ref}
          id={fieldId}
          aria-labelledby={actualLabelId}
          aria-describedby={descriptionId}
          className={cn("mt-1", className)}
          defaultValue={defaultValue}
          value={value}
          min={min}
          max={max}
          onValueChange={handleValueChange}
          {...props}
        />
      </div>
    )
  },
)
SliderField.displayName = "SliderField"

export { Slider }
