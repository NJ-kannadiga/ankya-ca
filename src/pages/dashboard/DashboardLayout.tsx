import { TopNav } from "@/components/ui/TopNav"
import { SideNav } from "@/components/ui/SideNav"
import { Outlet } from "react-router-dom"
import { DashboardCards } from "@/components/ui/DashboardCards"
import { SpendBarChart } from "@/components/charts/SpendBarChart"
import { SpendPieChart } from "@/components/charts/SpendPieChart"
import { CommitteeSnapshots } from "@/components/CommitteeSnapshots"

export default function DashboardLayout() {

  return (
  <div className="flex">
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="min-h-screen bg-gradient-to-b from-[#eef2ef] to-[#f7faf7] px-6 py-8 overflow-x-hidden">
            <Outlet />
        </main>
      </div>

      {/* RIGHT SIDEBAR */}
      <SideNav />
    </div>
  )
}
