import { CommitteeCard } from "./CommitteeCard"
import { LayoutGrid } from "lucide-react"

export function CommitteeSnapshots({ data }) {
  return (
    <div className="mt-12">
      {/* HEADER */}
<div className="flex items-center gap-3 mb-5">
  <div className="p-2 rounded-md bg-slate-100">
    <LayoutGrid size={16} className="text-slate-600" />
  </div>
  <h2 className="text-base font-semibold text-slate-900 tracking-wide">
    Committee Snapshots
  </h2>
</div>
      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
        "
      >
        {data.map((item, index) => (
          <CommitteeCard key={index} {...item} />
        ))}
      </div>
    </div>
  )
}
