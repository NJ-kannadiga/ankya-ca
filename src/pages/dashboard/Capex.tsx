
// @ts-nocheck

import { SpendBarChart } from "@/components/charts/SpendBarChart"
import { DashboardCards } from "@/components/ui/DashboardCards"
import { CommonTable } from "@/components/table/CommonTable"
import { TableColumn } from "@/components/table/types"
import { SpendingByCommitteeBar } from "@/components/charts/SpendingByCommitteeBar"
import { SpendPieChart } from "@/components/charts/SpendPieChart"

import { JSX, useMemo, useState } from "react"
import { Building2, Cpu, Settings } from "lucide-react"
import {generateColumnsFromData,generateRowsFromData} from "@/lib/utils"  
// Store & Utils
import { useExpenseStore } from "@/store/useExpenseStore"
import { formatINRShort } from "@/lib/utils"


export default function Capex() {

    const excelData = useExpenseStore((s) => s.excelData)
    const selectedQuarter = useExpenseStore((s) => s.selectedQuarter)
  const [sheetData, setSheetData] = useState<any>(null)


const cards1 = useMemo(() => {
  if (!excelData?.sheet0 || !excelData?.sheet2) {
    // ... return your default "0" array here
  }

  // 1. Calculate base values ONCE for efficiency
  const totalSpent = excelData?.sheet0.rows
    .filter((r: any) => r.Nature?.toLowerCase() === "capex" && r.Quarter === selectedQuarter)
    .reduce((sum: number, row: any) => sum + (Number(row["Total Expense Paid"]) || 0), 0);

  const approved = excelData?.sheet2?.rows?.find((r: any) => r.Nature?.toLowerCase() === "total" && r.Quarter === selectedQuarter)?.Amount || 0;

  // 2. Derive logic-based values
  const unapprovedAmt = Math.max(0, totalSpent - approved);
  // Show remaining only if we haven't exceeded the approved amount
  const remainingAmt = approved - totalSpent;
  const unapprovedText = remainingAmt > 0 ? `${remainingAmt.toFixed(2)} Remaining` : null;

  return [
    {
      title: "Total Spent",
      amount: totalSpent,
      percentText: null,
      isPositive: true,
      amountColor: "text-slate-900",
      cardAccent: "green",
    },
    {
      title: "Approved",
      amount: approved,
      percentText: null,
      isPositive: true,
      amountColor: "text-green-700",
      cardAccent: "green",
    },
    {
      title: "Unapproved",
      amount: unapprovedAmt,
      percentText: unapprovedText,
      isPositive: unapprovedAmt === 0, // Green if no unapproved spending
      amountColor: unapprovedAmt > 0 ? "text-red-600" : "text-green-700",
      cardAccent: unapprovedAmt > 0 ? "red" : "green",
    },
    {
        title: "Projects undertaken",
        amount: "0",
        percentText: null,
        isPositive: false,
        amountColor: "text-red-600",
        cardAccent: "red",
      },
      {
        title: "Projects completed",
        amount: "0",
        percentText: null,
        isPositive: true,
        amountColor: "text-green-700",
        cardAccent: "green",
      },
  ];
}, [excelData, selectedQuarter]);
const barChartData = useMemo(() => {
  if (!excelData?.sheet0 || !excelData?.sheet2) return [];

  // 1. Group Sheet 0 data by "Classification-1" for quick lookup
  const sheet0Totals = excelData.sheet0.rows.reduce((acc: any, row: any) => {
    // Apply filters: Capex and the Selected Quarter
    if (row.Nature?.toLowerCase() === "capex" && row.Quarter === selectedQuarter) {
      const key = row["Classification-1"];
      const amount = Number(row["Total Expense Paid"]) || 0;
      
      if (key) {
        acc[key] = (acc[key] || 0) + amount;
      }
    }
    return acc;
  }, {});

  // 2. Map Sheet 2 to the new format, excluding the 'Total' row
  return excelData.sheet2.rows
    .filter((r: any) => r.Nature?.toLowerCase() !== "total" && r.Quarter === selectedQuarter) // Remove "Total" row
    .map((r: any) => {
      // Logic: Match Sheet 2 "Nature" key with Sheet 0 "Classification-1" sum
      const categoryName = r.Nature; 
      
      return {
        name: categoryName,           // Renamed from Nature
        budget: Number(r.Amount) || 0, // Renamed from Amount
        utilized: sheet0Totals[categoryName] || 0 // The summed value from Sheet 0
      };
    });
}, [excelData, selectedQuarter]);
console.log(barChartData);


type Expense = {
  date: string
  vendor: string
  category: string
  description: string
  status: "Approved" | "Unapproved"
  amount: number
}



return (
  <>


    {/* KPI CARDS */}
    <div className="mt-6">
      <DashboardCards data={cards1} />
    </div>

    {/* BAR + DONUT SECTION */}
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT – BAR GRAPH */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
        <SpendingByCommitteeBar
          title="Spending by Committee"
          data={barChartData}
        />
      </div>

      {/* RIGHT – DONUT STACK */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SpendPieChart
            title="Spending by Project"
            showlegend={false}
            data={barChartData.map(item => ({
              name: item.name,
              value: item.utilized
            }))}
            centerValue={cards1.find(c => c.title === "Total Spent")?.amount || 0}

          />
        </div>

     <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center min-h-[200px]">
  {/* TITLE */}
  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
    Incomplete Project- Upcoming Cashflow
  </h3>

  {/* MAIN VALUE */}
  <div className="flex flex-col">
    <span className="text-xs font-medium text-slate-400 mb-1">
      Estimated Total
    </span>
    <div className="flex items-baseline gap-2">
      <span className="text-5xl font-extrabold text-blue-600 tracking-tight">
        ₹1
      </span>
      <span className="text-2xl font-bold text-blue-500">
        Cr.
      </span>
    </div>
  </div>

  {/* SUBTEXT / FOOTER */}
  <div className="mt-6 pt-4 border-t border-slate-50">
    <p className="text-xs text-slate-500">
      <span className="font-bold text-orange-500">●</span> 3 Projects pending final billing
    </p>
  </div>
</div>
      </div>
    </div>

    {/* THRESHOLD BAR + TABLE */}
    { excelData?.sheet0?.rows?.length > 0 && <div className="mt-12 grid grid-cols-1 gap-12">

      <CommonTable
        title="Capex Composition"
        columns={generateColumnsFromData(excelData?.sheet0?.rows.filter((r: any) => r.Nature?.toLowerCase() == "capex"))}
        data={generateRowsFromData(excelData?.sheet0?.rows.filter((r: any) => r.Nature?.toLowerCase() == "capex"))}
        onRowClick={(row) => console.log("Clicked:", row)}
      />
    </div>}
  </>
)
}