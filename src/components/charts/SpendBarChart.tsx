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

const LAKH = 100_000
const CRORE = 10_000_000

const Y_TICKS = [
  0 * LAKH,
  10 * LAKH,
  20 * LAKH,
  40 * LAKH,
  60 * LAKH,
  80 * LAKH,
  1 * CRORE,
]

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

  const WrappedXAxisTick = ({ x, y, payload }: any) => {
    const text = payload.value
    const words = text.split(" ")

    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      if ((currentLine + word).length <= 12) {
        currentLine += (currentLine ? " " : "") + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    })

    if (currentLine) lines.push(currentLine)

    return (
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fill="#475569"
        fontSize={12}
      >
        {lines.map((line, index) => (
          <tspan key={index} x={x} dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    )
  }

  // Transform data only if threshold is enabled
  const chartData = isThresholdEnabled
    ? data.map((item) => ({
        name: item.name,
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
              tick={<WrappedXAxisTick />}
              height={80}
            />

            {/* Y AXIS */}
            <YAxis
              domain={[0, 1 * CRORE]}
              ticks={Y_TICKS}
              tickFormatter={formatINRShort}
              width={70}
              tick={{ fontSize: 12, fill: "#475569" }}
              allowDataOverflow
            />

            {/* TOOLTIP */}
            <Tooltip formatter={(value: number) => formatINRShort(value)} />

            {/* STACKED BARS */}
            {isThresholdEnabled ? (
              <>
                <Bar
                  dataKey="opexSafe"
                  stackId="total"
                  fill="#16a34a" // green
                />
                <Bar
                  dataKey="opexExcess"
                  stackId="total"
                  fill="#dc2626" // red
                />
              </>
            ) : (
              <Bar
                dataKey="opex"
                stackId="total"
                fill="#4E1C5A"
                minPointSize={6}
              />
            )}
            <Bar
              dataKey="capex"
              stackId="total"
              fill="#E4B83E"
              minPointSize={6}
            />
            <Bar
              dataKey="adhoc"
              stackId="total"
              fill="#AC88D2"
              minPointSize={6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      {/* <div className="mt-4 flex gap-6 text-xs text-slate-600 flex-wrap">
        {isThresholdEnabled ? (
          <>
            <span className="text-green-700">● OPEX (Within Threshold)</span>
            <span className="text-red-600">● OPEX (Above Threshold)</span>
          </>
        ) : (
          <span className="text-purple-800">● OPEX</span>
        )}
        <span className="text-yellow-600">● CAPEX</span>
        <span className="text-indigo-600">● AD-HOC</span>
      </div> */}
    </div>
  )
}
