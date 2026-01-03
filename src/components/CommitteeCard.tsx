import { formatINRShort } from "@/lib/utils"

export function CommitteeCard({
  name,
  opex = 0,
  capex = 0,
  adhoc = 0,
}) {
  const total = opex + capex + adhoc || 1

  const opexPct = (opex / total) * 100
  const capexPct = (capex / total) * 100
  const adhocPct = (adhoc / total) * 100

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      {/* TITLE */}
      <h3 className="text-sm font-semibold text-slate-800 mb-3">
        {name}
      </h3>

      {/* SINGLE SEGMENTED PROGRESS BAR */}
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex mb-4">
        {opex > 0 && (
          <div
            className="bg-slate-900"
            style={{ width: `${opexPct}%` }}
          />
        )}
        {capex > 0 && (
          <div
            className="bg-green-600"
            style={{ width: `${capexPct}%` }}
          />
        )}
        {adhoc > 0 && (
          <div
            className="bg-orange-500"
            style={{ width: `${adhocPct}%` }}
          />
        )}
      </div>

      {/* INLINE VALUES (OLD STYLE FEEL) */}
      <div className="flex justify-between text-xs">
        <Value label="OPEX" value={opex} color="text-slate-900" />
        <Value label="CAPEX" value={capex} color="text-green-600" />
        <Value label="AD-HOC" value={adhoc} color="text-orange-500" />
      </div>
    </div>
  )
}

function Value({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${color}`}>
        {value ? formatINRShort(value) : "₹0"}
      </span>
    </div>
  )
}
