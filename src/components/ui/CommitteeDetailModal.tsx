import { ArrowLeft, Download } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { SpendingByCommitteeBar } from "@/components/charts/SpendingByCommitteeBar"
import { SpendTrendLineChart } from "./SpendTrendLineChart"
import { CommonTable } from "@/components/table/CommonTable"
import { ReactNode } from "react"

// import { Committee } from "./committee.types"
type StatusType = "healthy" | "warning" | "risk"

type Props = {
  open: boolean
  onClose: () => void
  committee: Committee | null
  sheetData: any
}
// committee.types.ts
 type Committee = {
  id: number
  title: string
  subtitle?: string
icon?: ReactNode

  // Card values
  status?: string
  budget?: string
  spent?: string
  remaining?: string
  percentage?: number

  // Modal header
  quarter: string
  utilizationText: string

  // Modal charts
  trendData: any[]
  categoryBreakdown: {
    name: string
    utilized: number
  }[]

  // Modal table
  transactions: {
    date: string
    vendor: string
    category: string
    description: string
    amount: string
  }[]
}
type ExpenseRow = {
  "Classification-1"?: any
  "Total Expense Paid"?: any
}

type BarData = {
  name: string
  utilized: number
}
export function CommitteeDetailModal({ open, sheetData, onClose, committee }: Props) {
console.log(sheetData,"[][][]")
function generateColumnsFromData(data: any[]) {
  if (!data || !data.length) return []

  const keys = Object.keys(data[0])

  return [
    { key: "id", label: "SL.NO" },
    ...keys.map((key) => ({
      key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    })),
  ]
}

function buildClassification1BarData(
  rows: ExpenseRow[]
): BarData[] {
  if (!Array.isArray(rows)) return []

  const map = new Map<string, number>()

  rows.forEach((row) => {
    // ✅ SAFELY CONVERT TO STRING
    const raw = row["Classification-1"]

    if (raw === undefined || raw === null) return

    const classification = String(raw).trim()
    if (!classification) return

    // Ensure we are working with numbers
    const amount = Number(row["Total Expense Paid"]) || 0

    map.set(
      classification,
      (map.get(classification) || 0) + amount
    )
  })

  return Array.from(map.entries())
    .map(([name, utilized]) => ({ 
      name, 
      // ✅ CONVERT TO INTEGER
      // Math.round() turns 854.0700000000002 into 854
      utilized: Math.round(utilized) 
    }))
    // ✅ DESCENDING ORDER (Largest expenses at the top)
    .sort((a, b) => b.utilized - a.utilized)
}

function generateRowsFromData(data: any[]) {
  if (!data || !data.length) return []

  return data.map((item, index) => ({
    id: index + 1,
    ...item,
  }))
}
  const statusBadge: Record<string, string> = {
  healthy: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  risk: "bg-red-100 text-red-700",
}

const ringColor: Record<string, string> = {
  healthy: "stroke-green-500",
  warning: "stroke-yellow-500",
  risk: "stroke-red-500",
}
  if (!committee) return null

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-slate-50 flex flex-col">

        {/* HEADER */}
     {/* MODAL HEADER */}
<div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
  <div className="flex items-center justify-between gap-6">

    {/* LEFT – TITLE + META */}
    <div className="flex items-center gap-4">
      <button
        onClick={onClose}
        className="p-2 rounded-md hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
        {committee.icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900">
          {committee.title}
        </h2>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-slate-500">
            Spent:{" "}
            <span className="font-medium text-indigo-600">
              {committee.spent}
            </span>
            {" / "}
            <span className="font-medium text-slate-700">
              {committee.budget}
            </span>
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[committee.status]}`}
          >
            {committee.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>

    {/* RIGHT – PERCENTAGE RING + ACTION */}
    <div className="flex items-center gap-6">

      {/* Percentage Ring */}
      <svg width="44" height="44">
        <circle
          cx="22"
          cy="22"
          r="18"
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          strokeWidth="4"
          fill="none"
          strokeDasharray={2 * Math.PI * 18}
          strokeDashoffset={
            2 * Math.PI * 18 -
            (committee.percentage / 100) * (2 * Math.PI * 18)
          }
          className={ringColor[committee.status]}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs font-semibold fill-slate-900"
        >
          {committee.percentage}%
        </text>
      </svg>

      {/* Export Button */}
      <button className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-slate-50">
        <Download size={14} />
        Export
      </button>
    </div>
  </div>
</div>


        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white border rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-4">Spend Over Time</h3>
<SpendTrendLineChart rows={sheetData} />
            </div>

            <SpendingByCommitteeBar
              title="Category Breakdown"
              data={buildClassification1BarData(sheetData)}
            />
          </div>

          <CommonTable
            title="Transactions"
            enableSearch
            columns={generateColumnsFromData(sheetData)}
            data={generateRowsFromData(sheetData)}
          />
        </div>
      </div>
    </Modal>
  )
}
