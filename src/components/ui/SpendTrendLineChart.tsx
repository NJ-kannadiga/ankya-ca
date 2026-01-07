import { useMemo, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

/* ================= TYPES & HELPERS ================= */

type Level = "day" | "week" | "month"

export type ExpenseRow = {
  "Bank Account": string
  "Payment Date": string
  "Vendor Name": string
  "Total Expense Paid": number
  Nature: string
  Classification: string
  "Classification-1": string
  Quarter: string
}

function parseDate(dateStr: string) {
  return new Date(dateStr.replace(/-/g, " "))
}

// Helper to get week number for grouping
function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/* ================= UPDATED AGGREGATION ================= */
function parsePaymentDate(dateStr?: string | number): Date | null {
  if (dateStr === null || dateStr === undefined) return null

  // ---------- EXCEL SERIAL DATE (Number) ----------
  if (typeof dateStr === "number" && !isNaN(dateStr)) {
    // Excel dates assume 1900 leap year bug so we subtract 1
    // Excel day 1 = 1900-01-01 → JS time
    const excelEpoch = new Date(1900, 0, 1)
    const jsDate = new Date(excelEpoch.getTime() + (dateStr - 2) * 86400000)
    return jsDate
  }

  // If string contains only digits (no slash/dash), try number parse
  const trimmed = String(dateStr).trim()

  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed)
    if (!isNaN(n)) {
      const excelEpoch = new Date(1900, 0, 1)
      return new Date(excelEpoch.getTime() + (n - 2) * 86400000)
    }
  }

  // ===============================
  // Format 1: DD-MMM-YY  (03-Dec-25)
  // ===============================
  if (trimmed.includes("-")) {
    const parts = trimmed.split("-")
    if (parts.length === 3) {
      const [dayStr, monStr, yearStr] = parts
      const monthMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2,
        Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8,
        Oct: 9, Nov: 10, Dec: 11,
      }

      const month = monthMap[monStr]
      if (month === undefined) return null

      const day = Number(dayStr)
      const year =
        yearStr.length === 2 ? Number(`20${yearStr}`) : Number(yearStr)

      if (!isFinite(day) || !isFinite(year)) return null

      return new Date(year, month, day)
    }
  }

  // ===============================
  // Format 2: DD/MM/YYYY  (15/12/2025)
  // ===============================
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/")
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts

      const day = Number(dayStr)
      const month = Number(monthStr) - 1
      const year = Number(yearStr)

      if (!isFinite(day) || !isFinite(month) || !isFinite(year)) {
        return null
      }

      return new Date(year, month, day)
    }
  }

  return null
}


function aggregateData(rows: ExpenseRow[], level: Level) {
  const map = new Map<string, any>()

  rows.forEach((r) => {
    const date = parsePaymentDate(r["Payment Date"])
    if (!date) return // 🚨 skip invalid dates safely

    let key = ""
    let label = ""

    // ======================
    // DAY LEVEL
    // ======================
    if (level === "day") {
      // YYYY-MM-DD (safe sortable key)
      key = date.toISOString().slice(0, 10)

      label = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    }

    // ======================
    // WEEK LEVEL (ISO-like)
    // ======================
    else if (level === "week") {
      const weekNum = getWeekNumber(date)
      const year = date.getFullYear()

      key = `${year}-W${String(weekNum).padStart(2, "0")}`
      label = `Week ${weekNum}`
    }

    // ======================
    // MONTH LEVEL
    // ======================
    else {
      const year = date.getFullYear()
      const month = date.getMonth() // 0-based

      key = `${year}-${String(month + 1).padStart(2, "0")}`

      label = date.toLocaleString("en-IN", {
        month: "short",
        year: "2-digit",
      })
    }

    if (!map.has(key)) {
      map.set(key, {
        key,        // used for sorting
        label,      // display label
        value: 0,   // aggregated amount
        rows: [],   // drill-down rows
      })
    }

    const group = map.get(key)

    // 🔥 numeric safety (Excel strings / float noise)
    const amount = Number(r["Total Expense Paid"]) || 0
    group.value += amount
    group.rows.push(r)
  })

  // ======================
  // Sort chronologically
  // ======================
  return Array.from(map.values()).sort((a, b) =>
    a.key.localeCompare(b.key)
  )
}


/* ================= UPDATED CUSTOM TOOLTIP ================= */

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null

  const rawRows: ExpenseRow[] = payload[0].payload.rows
  
  // Group by Vendor for the tooltip summary
  const vendorSummary = rawRows.reduce((acc, curr) => {
    const name = curr["Vendor Name"]
    if (!acc[name]) acc[name] = 0
    acc[name] += curr["Total Expense Paid"]
    return acc
  }, {} as Record<string, number>)

  const sortedVendors = Object.entries(vendorSummary)
    .sort((a, b) => b[1] - a[1]) // Show highest spenders first

  return (
    <div className="bg-white border rounded-lg shadow-xl p-3 text-xs space-y-2 min-w-[200px] border-slate-200">
      <div className="font-bold text-slate-500 mb-1 border-b pb-1 uppercase">
        {payload[0].payload.label} Summary
      </div>
      {sortedVendors.slice(0, 5).map(([name, total], i) => (
        <div key={i} className="flex justify-between gap-4">
          <span className="text-slate-700 truncate max-w-[120px]">{name}</span>
          <span className="font-semibold text-indigo-600">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
      {sortedVendors.length > 5 && (
        <div className="text-slate-400 italic">
          + {sortedVendors.length - 5} more vendors
        </div>
      )}
      <div className="pt-1 mt-1 border-t flex justify-between font-bold text-slate-900">
        <span>Total</span>
        <span>₹{payload[0].value.toLocaleString("en-IN")}</span>
      </div>
    </div>
  )
}

/* ================= COMPONENT ================= */

export function SpendTrendLineChart({ rows }: { rows: ExpenseRow[] }) {
  const [level, setLevel] = useState<Level>("day")

  const data = useMemo(() => aggregateData(rows, level), [rows, level])

  return (
    /* 1. Ensure the outermost container has a height, or use h-full if the parent has a height */
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-full min-h-[400px]">
      
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-sm font-semibold text-slate-700">Spending Trend</h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(["day", "week", "month"] as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all
                ${level === l 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Changed h-64 to flex-1 and h-full so it expands to 100% of available space */}
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="label" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              /* Improved formatter for large values */
              tickFormatter={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}k`} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fill="url(#trendGrad)"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}