import React from "react"
import { KPI_COLORS } from "@/lib/kpiColors"

type KpiCardProps = {
  title: string
  amount: any
  percentText?: string
  percentValue?: string
  colorKey?: keyof typeof KPI_COLORS
  percentColor?: string
}

export function KpiCard({
  title,
  amount,
  percentText,
  percentValue,
  colorKey = "total",
  percentColor = "text-orange-600",
}: KpiCardProps) {
  const accentColor = KPI_COLORS[colorKey] ?? KPI_COLORS.total

  return (
    <div
  className="
    bg-white rounded-xl
    shadow-sm
    p-5 min-h-[120px]
    flex flex-col justify-between

    w-fit min-w-[320px] max-w-[350px]

    /* ✅ HOVER ANIMATION */
    transform-gpu
    transition-all duration-300 ease-out
    hover:-translate-y-2
    hover:scale-[1.04]
    hover:shadow-2xl
  "
  style={{
    borderTop: `4px solid ${accentColor}`,
  }}
>
      {/* TITLE (FIXED OPACITY & WEIGHT) */}
    <p className="
  text-sm
  font-bold
  text-slate-900
  tracking-wide
  uppercase
  mb-2
">
  {title}
</p>

      {/* AMOUNT */}
      <div
        className="text-2xl font-bold"
        style={{ color: accentColor }}
      >
        {title.toLowerCase() === "community alert"
          ? amount
          : `₹ ${amount}`}
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        {percentValue && (
          <span
            className={`px-2 py-0.5 rounded-full ${percentColor} text-xs font-medium`}
          >
            {percentValue}
          </span>
        )}

        {percentText && (
          <span className="text-slate-500">
            {percentText}
          </span>
        )}
      </div>
    </div>
  )
}
