"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SpeedometerProps {
  value: number
  maxValue: number
  title: string
  color?: string
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  unit?: string
  animated?: boolean
}

export function Speedometer({
  value,
  maxValue,
  title,
  color = "hsl(var(--primary))",
  size = "md",
  showValue = true,
  unit = "",
  animated = true,
}: SpeedometerProps) {
  const [currentValue, setCurrentValue] = useState(0)

  // Size mappings
  const sizeMap = {
    sm: {
      width: 120,
      height: 120,
      fontSize: "text-xs",
      titleSize: "text-sm",
      valueSize: "text-lg",
      strokeWidth: 8,
    },
    md: {
      width: 180,
      height: 180,
      fontSize: "text-sm",
      titleSize: "text-base",
      valueSize: "text-2xl",
      strokeWidth: 10,
    },
    lg: {
      width: 240,
      height: 240,
      fontSize: "text-base",
      titleSize: "text-lg",
      valueSize: "text-3xl",
      strokeWidth: 12,
    },
  }

  const { width, height, fontSize, titleSize, valueSize, strokeWidth } = sizeMap[size]

  // Animation effect
  useEffect(() => {
    if (!animated) {
      setCurrentValue(value)
      return
    }

    const startValue = 0
    const duration = 1500
    const startTime = performance.now()

    const animateValue = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easedProgress = easeOutCubic(progress)

      setCurrentValue(startValue + (value - startValue) * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animateValue)
      }
    }

    requestAnimationFrame(animateValue)
  }, [value, animated])

  // Easing function for smoother animation
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3)
  }

  // Calculate angles for the gauge
  const startAngle = -135
  const endAngle = 135
  const angleRange = endAngle - startAngle
  const valueAngle = startAngle + (currentValue / maxValue) * angleRange

  // Calculate coordinates for the needle
  const centerX = width / 2
  const centerY = height / 2
  const needleLength = (width / 2) * 0.8
  const needleX = centerX + needleLength * Math.cos((valueAngle * Math.PI) / 180)
  const needleY = centerY + needleLength * Math.sin((valueAngle * Math.PI) / 180)

  // Calculate the arc path
  const radius = width / 2 - strokeWidth / 2

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  const backgroundArc = describeArc(centerX, centerY, radius, startAngle, endAngle)
  const progressArc = describeArc(centerX, centerY, radius, startAngle, valueAngle)

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className={cn("font-medium text-center mb-2", titleSize)}>{title}</h3>
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress track */}
          <path d={progressArc} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />

          {/* Removed Tick marks */}
          {/* Removed Needle */}
          {/* Removed Needle center */}
        </svg>

        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center mt-8">
            <span className={cn("font-semibold", valueSize)}>
              {Math.round(currentValue)}
              {unit && <span className="text-muted-foreground text-sm ml-1">{unit}</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

