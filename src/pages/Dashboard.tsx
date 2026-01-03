import { TopNav } from "@/components/ui/TopNav"
import { SideNav } from "@/components/ui/SideNav"
import { Outlet } from "react-router-dom"
import { DashboardCards } from "@/components/ui/DashboardCards"
import { SpendBarChart } from "@/components/charts/SpendBarChart"
import { SpendPieChart } from "@/components/charts/SpendPieChart"
import { CommitteeSnapshots } from "@/components/CommitteeSnapshots"
import { useState } from "react"

export default function Dashboard() {
    const [excelData, setExcelData] = useState(null);

    const cards = [
    {
      title: "Total Spend (Q1)",
      amount: "1.1 Cr",
      percentValue: "12%",
      isPositive: true,
    },
    {
      title: "OPEX Actuals",
      amount: "27.3 L",
      percentValue: "72% of total",
      isPositive: true,
    },
    {
      title: "CAPEX Actuals",
      amount: "78.0 L",
      percentText: "21% of total",
      amountColor: "text-green-700",
    },
    {
      title: "Ad-Hoc Spend",
      amount: "4.7 L",
      percentText: "7% of total",
      amountColor: "text-orange-600",
    },
  ]
  const barData = [
    { name: "Marketing", opex: 28, capex: 0, adhoc: 0 },
    { name: "Facilities", opex: 25, capex: 0, adhoc: 0 },
    { name: "Technology", opex: 23, capex: 0, adhoc: 0 },
    { name: "Operations", opex: 21, capex: 0, adhoc: 0 },
    { name: "HR", opex: 14, capex: 0, adhoc: 0 },
  ]

  const pieData = [
    { name: "OPEX", value: 72 },
    { name: "CAPEX", value: 21 },
    { name: "AD-HOC", value: 7 },
  ]

const committeeData = [
  {
    name: "Marketing",
    quarter: "Q1 2026",
    opex: "₹5.8L",
    capex: "₹19.7L",
    adhoc: "₹96,318",
  },
  {
    name: "Facilities",
    quarter: "Q1 2026",
    opex: "₹4.8L",
    capex: "₹19.3L",
    adhoc: "₹30,735",
  },
  {
    name: "Technology",
    quarter: "Q1 2026",
    opex: "₹5.5L",
    capex: "₹15.7L",
    adhoc: "₹1.9L",
  },
  {
    name: "Operations",
    quarter: "Q1 2026",
    opex: "₹7.7L",
    capex: "₹13.6L",
    adhoc: "₹0",
  },
  {
    name: "Human Resources",
    quarter: "Q1 2026",
    opex: "₹3.5L",
    capex: "₹9.8L",
    adhoc: "₹1.5L",
  },  {
    name: "Operations",
    quarter: "Q1 2026",
    opex: "₹7.7L",
    capex: "₹13.6L",
    adhoc: "₹0",
  },
  {
    name: "Human Resources",
    quarter: "Q1 2026",
    opex: "₹3.5L",
    capex: "₹9.8L",
    adhoc: "₹1.5L",
  },
]

const handleExcelParsed = (finalData) => {
    console.log("📦 Data received in parent:", finalData);
    setExcelData(finalData);

    // 👉 trigger summary / charts / API calls here
  };

  return (
  <div className="flex">
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <TopNav onExcelParsed={handleExcelParsed} />
        <main className="min-h-screen bg-gradient-to-b from-[#eef2ef] to-[#f7faf7] px-6 py-8 overflow-x-hidden">

          <div>
      <DashboardCards data={cards} />
    </div>
    {/* GRAPHS */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BAR GRAPH (WIDER) */}
        <div className="lg:col-span-2">
          <SpendBarChart data={barData} />
        </div>

        {/* PIE GRAPH */}
        <SpendPieChart data={pieData} total="1.1 Cr" />
      </div>

      <CommitteeSnapshots data={committeeData} />

          <Outlet />
        </main>
      </div>

      {/* RIGHT SIDEBAR */}
      <SideNav />
    </div>
  )
}
