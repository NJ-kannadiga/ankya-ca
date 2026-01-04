import { formatINRShort } from "@/lib/utils"
import { KPI_COLORS } from "@/lib/kpiColors"

type CommitteeCardProps = {
  name: string
  opex?: number
  capex?: number
  adhoc?: number
}

export function CommitteeCard({
  name,
  opex = 0,
  capex = 0,
  adhoc = 0,
}: CommitteeCardProps) {
  const total = opex + capex + adhoc || 1

  const opexPct = (opex / total) * 100
  const capexPct = (capex / total) * 100
  const adhocPct = (adhoc / total) * 100

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      {/* TITLE */}
      <h3 className="text-sm font-semibold text-slate-800 mb-3 truncate">
        {name}
      </h3>

      {/* SEGMENTED PROGRESS BAR */}
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex mb-4">
        {opex > 0 && (
          <div
            style={{
              width: `${opexPct}%`,
              backgroundColor: KPI_COLORS.opex,
            }}
          />
        )}
        {capex > 0 && (
          <div
            style={{
              width: `${capexPct}%`,
              backgroundColor: KPI_COLORS.capex,
            }}
          />
        )}
        {adhoc > 0 && (
          <div
            style={{
              width: `${adhocPct}%`,
              backgroundColor: KPI_COLORS.adhoc,
            }}
          />
        )}
      </div>

      {/* VALUES */}
      <div className="flex justify-between text-xs">
        <Value
          label="OPEX"
          value={opex}
          color={KPI_COLORS.opex}
        />
        <Value
          label="CAPEX"
          value={capex}
          color={KPI_COLORS.capex}
        />
        <Value
          label="AD-HOC"
          value={adhoc}
          color={KPI_COLORS.adhoc}
        />
      </div>
    </div>
  )
}

/* ===================== VALUE COMPONENT ===================== */

function Value({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium" style={{ color }}>
        {value ? formatINRShort(value) : "₹0"}
      </span>
    </div>
  )
}
