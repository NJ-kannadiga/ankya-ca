import { useNavigate } from "react-router-dom"
import { LayoutDashboard, FileUp, Scan } from "lucide-react"
import { TopNav } from "@/components/home/TopNav"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ef] to-[#f7faf7]">
      <TopNav />

      <div className="px-6 py-12">
        <h1 className="text-xl font-semibold text-slate-800 mb-8">
          Welcome to    <span className="text-lg font-semibold text-[#4E1C5A]">
            ANKYA
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          
          {/* DASHBOARD */}
          <ModuleCard
            title="Dashboard"
            description="View KPIs, charts, and committee insights"
            icon={<LayoutDashboard size={22} />}
            onClick={() => navigate("/dashboard")}
          />

          {/* CXP EXPORT (ROUTING ONLY) */}
          <ModuleCard
            title="CXP Export"
            description="Export data (coming soon)"
            icon={<FileUp size={22} />}
            onClick={() => navigate("/cxp-export")}
          />

          {/* OCR (ROUTING ONLY) */}
          <ModuleCard
            title="OCR"
            description="Invoice OCR processing (coming soon)"
            icon={<Scan size={22} />}
            onClick={() => navigate("/ocr")}
          />
        </div>
      </div>
    </div>
  )
}

function ModuleCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer p-6"
    >
      <div className="flex items-center gap-3 mb-3 text-green-700">
        {icon}
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  )
}
