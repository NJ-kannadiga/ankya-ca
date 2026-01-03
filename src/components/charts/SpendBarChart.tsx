import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

/* ===================== TYPES ===================== */

type ThresholdConfig = {
  enabled: boolean
  value: number
}

type SpendBarChartProps = {
  data: {
    name: string
    opex: number
    capex: number
    adhoc: number
  }[]
  threshold?: ThresholdConfig
  Gtitle?: string
}

/* ===================== HELPERS ===================== */

// 🇮🇳 Indian number formatter (K / L / Cr)
import { formatINRShort } from "@/lib/utils"

/* ===================== COMPONENT ===================== */

export function SpendBarChart({
  data,
  threshold,
  Gtitle = "Spend Mix by Committee",
}: SpendBarChartProps) {
  const isThresholdEnabled = threshold?.enabled === true

  // 🔁 Transform data only if threshold is enabled
  const chartData = isThresholdEnabled
    ? data.map((item) => ({
        name: item.name,

        // split OPEX into safe + excess
        opexSafe: Math.min(item.opex, threshold!.value),
        opexExcess:
          item.opex > threshold!.value
            ? item.opex - threshold!.value
            : 0,

        capex: item.capex,
        adhoc: item.adhoc,
      }))
    : data

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* TITLE */}
      <h2 className="text-xl font-bold text-slate-700 mb-4 tracking-tight">
        {Gtitle}
      </h2>

      {/* CHART */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            {/* X AXIS */}
         <XAxis
  dataKey="name"
  interval={0}
  tick={{ fontSize: 12, fill: "#475569" }}
  height={60}
/>

            {/* Y AXIS */}
            <YAxis
              tickFormatter={formatINRShort}
              width={80}
            />

            {/* TOOLTIP */}
            <Tooltip
              formatter={(value: number) => formatINRShort(value)}
            />

            {/* OPEX */}
            {isThresholdEnabled ? (
              <>
                <Bar
                  dataKey="opexSafe"
                  stackId="opex"
                  fill="#16a34a" // green
                />
                <Bar
                  dataKey="opexExcess"
                  stackId="opex"
                  fill="#dc2626" // red
                />
              </>
            ) : (
              <Bar dataKey="opex" fill="#000000" />
            )}

            {/* CAPEX & AD-HOC */}
            <Bar dataKey="capex" fill="#2f855a" />
            <Bar dataKey="adhoc" fill="#a0aec0" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="mt-4 flex gap-6 text-xs text-slate-600 flex-wrap">
        {isThresholdEnabled ? (
          <>
            <span className="text-green-700">● OPEX (Within Threshold)</span>
            <span className="text-red-600">● OPEX (Above Threshold)</span>
          </>
        ) : (
          <span>● OPEX</span>
        )}
        <span>● CAPEX</span>
        <span>● AD-HOC</span>
      </div>
    </div>
  )
}
