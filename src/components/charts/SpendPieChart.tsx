import { Import } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {  formatINRShort } from "@/lib/utils";
const DEFAULT_COLORS = [
  "#000000",
  "#16a34a",
  "#a0aec0",
  "#dc2626",
  "#f59e0b",
]
type SpendPieChartProps=any
export function SpendPieChart({
  data,
  title = "Overall Composition",
  centerLabel = "TOTAL",
  centerValue,
}: SpendPieChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* TITLE */}
      <h2 className="text-xl font-bold text-slate-700 mb-4 tracking-tight">
        {title}
      </h2>

      {/* CHART */}
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={95}
              dataKey="value"
              stroke="none"
            >
              {data.map((slice, index) => (
                <Cell
                  key={slice.name}
                  fill={
                    slice.color ??
                    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number, name: string) => [
                formatINRShort(value),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER TEXT */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerLabel && (
              <p className="text-xs text-slate-500">
                {centerLabel}
              </p>
            )}
            {centerValue && (
              <p className="text-lg font-bold text-slate-900">
                ₹{formatINRShort(centerValue)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* LEGEND (AUTO) */}
      <div className="mt-4 flex flex-wrap gap-6 text-xs text-slate-600">
        {data.map((slice, index) => (
          <div
            key={slice.name}
            className="flex items-center gap-2"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  slice.color ??
                  DEFAULT_COLORS[index % DEFAULT_COLORS.length],
              }}
            />
            <span className="font-medium">{slice.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
