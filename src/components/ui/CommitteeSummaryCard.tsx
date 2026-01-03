import { ArrowUpRight } from "lucide-react"

type StatusType = "healthy" | "warning" | "risk"

type CommitteeSummaryCardProps = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  status: StatusType
  budget: string
  spent: string
  remaining: string
  percentage: number
  onClick?: () => void
}

const statusStyles: Record<StatusType, string> = {
  healthy: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  risk: "bg-red-100 text-red-700",
}

const ringColor: Record<StatusType, string> = {
  healthy: "stroke-green-500",
  warning: "stroke-yellow-500",
  risk: "stroke-red-500",
}

export function CommitteeSummaryCard({
  title,
  subtitle,
  icon,
  status,
  budget,
  spent,
  remaining,
  percentage,
  onClick,
}: CommitteeSummaryCardProps) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset =
    circumference - (percentage / 100) * circumference

  return (
    <div
      onClick={onClick}
  className="
    relative
    rounded-2xl
    p-5
    bg-gradient-to-br from-indigo-50 via-white to-slate-50
    border border-slate-200/70
    shadow-sm
    transition-all duration-300
    hover:shadow-lg hover:-translate-y-0.5
    hover:ring-1 hover:ring-indigo-300/50
  "
    >
      {/* MAIN GRID */}
      <div className="grid grid-cols-[1fr_auto] gap-4">
        {/* LEFT CONTENT */}
        <div>
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                {icon}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-slate-500">
                    {subtitle}
                  </p>
                )}

                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>

            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </div>

          {/* METRICS */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">BUDGET</p>
              <p className="font-semibold text-slate-900">
                {budget}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-400">SPENT</p>
              <p className="font-semibold text-indigo-600">
                {spent}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">REMAINING</p>
              <p className="font-semibold text-slate-900">
                {remaining}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT RING (NO OVERLAP) */}
        <div className="flex items-end justify-center">
          <svg width="48" height="48">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={ringColor[status]}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs font-semibold fill-slate-900"
            >
              {percentage}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
