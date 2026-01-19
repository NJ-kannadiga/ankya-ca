// @ts-nocheck

import { JSX, useMemo, useState } from "react"
import { Building2, Cpu, Settings } from "lucide-react"

// Store & Utils
import { useExpenseStore } from "@/store/useExpenseStore"
import { formatINRShort } from "@/lib/utils"

// Components
import { DashboardCards } from "@/components/ui/DashboardCards"
import { SpendPieChart } from "@/components/charts/SpendPieChart"
import { SpendingByCommitteeBar } from "@/components/charts/SpendingByCommitteeBar"
import { CommitteeSummarySlider } from "@/components/ui/CommitteeSummarySlider"
import { TreemapChart } from "@/components/ui/treemap"
// Types
type Expense = {
  date: string
  vendor: string
  category: string
  description: string
  amount: number
}

// --- CONSTANTS & HELPERS ---

const DEFAULT_CHART_COLOR = "#E2E8F0"

const iconMap: Record<string, JSX.Element> = {
  building: <Building2 className="h-5 w-5 text-indigo-600" />,
  cpu: <Cpu className="h-5 w-5 text-indigo-600" />,
  settings: <Settings className="h-5 w-5 text-indigo-600" />,
}

function getIconKey(name: string) {
  if (name.match(/IT|Technology|Electrical/i)) return "cpu"
  if (name.match(/Security|Safety|Utilities/i)) return "settings"
  return "building"
}

function getSubtitle(name: string) {
  return name.includes("&") ? name : `${name} Committee`
}

function getStatus(percentage: number) {
  if (percentage >= 100) return "risk"
  if (percentage >= 75) return "warning"
  return "healthy"
}

// --- DATA TRANSFORMATION LOGIC ---

function buildTotalExpenditureCard(rows: any[], selectedQuarter: string) {
  const operatingRows = rows.filter(
    (r) => r.Nature === "Operating" && r.Quarter === selectedQuarter
  )

  const classificationMap: Record<string, number> = {}
  operatingRows.forEach((row) => {
    const key = row.Classification?.trim()
    const amount = Number(row["Total Expense Paid"]) || 0
    if (!key) return
    classificationMap[key] = (classificationMap[key] || 0) + amount
  })

  const data = Object.entries(classificationMap).map(([name, total]) => ({
    name,
    utilized: Number(total.toFixed(2)),
  }))

  const grandTotal = data.reduce((sum, item) => sum + item.utilized, 0)

  return {
    title: "Total Expenditure",
    amount: grandTotal,
    totalAmount: grandTotal,
    percentText: null,
    isPositive: true,
    data: data.length > 0 ? data : [],
  }
}

function buildUnspentBalanceCard(totalBudgetCard: any, totalExpenditureCard: any) {
  const utilizedMap: Record<string, number> = {}
  totalExpenditureCard.data.forEach((item: any) => {
    utilizedMap[item.name] = item.utilized || 0
  })

  let totalRemain = 0
  const data = totalBudgetCard.data.map((item: any) => {
    const budget = item.budget || 0
    const utilized = utilizedMap[item.name] || 0
    const diff = budget - utilized
    const remain = diff > 0 ? diff : 0
    const overUtilized = diff < 0 ? diff : 0
    totalRemain += remain

    return { name: item.name, budget, remain, overUtilized }
  })

  return {
    title: "Unspent Balance",
    amount: totalRemain,
    totalAmount: totalRemain,
    percentText: null,
    isPositive: true,
    amountColor: "text-green-700",
    data,
  }
}

function buildCommunityAlertCard(unspentBalanceCard: any, totalBudgetCard: any) {
  const overUtilizedCount = unspentBalanceCard.data.filter((item: any) => item.overUtilized < 0).length
  const totalCount = totalBudgetCard.data.length || 0
  const percent = totalCount > 0 ? Math.round((overUtilizedCount / totalCount) * 100) : 0

  return {
    title: "Community Alert",
    amount: `${overUtilizedCount}/${totalCount}`,
    percentValue: `${percent}% of total budget`,
    isPositive: false,
    amountColor: "text-slate-900",
    percentColor: "text-red-600",
    data: unspentBalanceCard.data.filter((item: any) => item.overUtilized < 0),
  }
}

// --- MAIN COMPONENT ---

export default function Opex() {
  const excelData = useExpenseStore((s) => s.excelData)
  const selectedQuarter = useExpenseStore((s) => s.selectedQuarter)
const [sheetData, setSheetData] = useState<any>(null)
  // Core Data Calculation
  const cards = useMemo(() => {
    if (!excelData?.sheet0 || !excelData?.sheet1) {
      // Return default "0" structure if no data
      const defaultBudget = { title: "Total Budget Approved", amount: "₹0", totalAmount: 0, data: [] }
      const defaultSpend = { title: "Total Expenditure", amount: "₹0", totalAmount: 0, data: [] }
      const defaultUnspent = { title: "Unspent Balance", amount: "₹0", totalAmount: 0, data: [] }
      const defaultAlert = { title: "Community Alert", amount: "0/0",  data: [] }
      return [defaultBudget, defaultSpend, defaultUnspent, defaultAlert]
    }

    const sheet0Rows = excelData.sheet0.rows.filter((res: any) => res.Nature === "Operating" && res.Quarter === selectedQuarter )
    const sheet1Rows = excelData.sheet1.rows
setSheetData(sheet0Rows)
    const totalRow = sheet1Rows.find((r: any) => r.Nature?.toLowerCase() === "total" && r.Quarter === selectedQuarter)
    console.log("Total Row:", totalRow);
    const totalBudgetCard = {
      title: "Total Budget Approved",
      amount: totalRow?.Amount || 0,
      totalAmount: totalRow?.Amount || 0,
      percentText: null,
      isPositive: true,
      data: sheet1Rows
        .filter((r: any) => r.Nature?.toLowerCase() !== "total" && r.Quarter === selectedQuarter)
        .map((r: any) => ({
          name: r.Nature,
          budget: Number(r.Amount || 0),
        })),
    }

    const totalExpenditureCard = buildTotalExpenditureCard(sheet0Rows, selectedQuarter)
    const unspentBalanceCard = buildUnspentBalanceCard(totalBudgetCard, totalExpenditureCard)
    const communityAlertCard = buildCommunityAlertCard(unspentBalanceCard, totalBudgetCard)

    return [totalBudgetCard, totalExpenditureCard, unspentBalanceCard, communityAlertCard]
  }, [excelData, selectedQuarter])

  // Bar Graph Data Derivation
  const barDataVal = useMemo(() => {
    const budgetCard = cards.find((c) => c.title === "Total Budget Approved")
    const expenditureCard = cards.find((c) => c.title === "Total Expenditure")

    if (!budgetCard?.data.length) return []

    const utilizedMap: Record<string, number> = {}
    expenditureCard?.data.forEach((item: any) => {
      utilizedMap[item.name] = item.utilized || 0
    })

    return budgetCard.data.map((item: any) => ({
      name: item.name,
      budget: item.budget || 0,
      utilized: utilizedMap[item.name] || 0,
    }))
  }, [cards])

  // Committee Slider Data Derivation
  const committeeDataVal = useMemo(() => {
    const budgetCard = cards.find((c) => c.title === "Total Budget Approved")
    const spendCard = cards.find((c) => c.title === "Total Expenditure")

    if (!budgetCard?.data.length) return []

    const utilizedMap: Record<string, number> = {}
    spendCard?.data.forEach((i: any) => {
      utilizedMap[i.name] = i.utilized || 0
    })

    return budgetCard.data.map((item: any, index: number) => {
      const budget = item.budget || 0
      const spent = utilizedMap[item.name] || 0
      const remaining = Math.max(budget - spent, 0)
      const percentage = budget ? Math.round((spent / budget) * 100) : 0
      const iconKey = getIconKey(item.name)

      return {
        id: index + 1,
        title: item.name,
        subtitle: getSubtitle(item.name),
        status: getStatus(percentage),
        budget: formatINRShort(budget),
        spent: formatINRShort(spent),
        remaining: formatINRShort(remaining),
        percentage,
        icon: iconMap[iconKey] || iconMap.building,
      }
    })
  }, [cards])

  // Safe variables for Pie Chart
  const totalSpend = cards.find((c) => c.title === "Total Expenditure")?.totalAmount || 0
  const unspentBal = cards.find((c) => c.title === "Unspent Balance")?.totalAmount || 0
  const totalBudgetValue = cards.find((c) => c.title === "Total Budget Approved")?.totalAmount || 0

  return (
    <div className="space-y-12">
      {/* KPI CARDS */}
      <div>
        <DashboardCards data={cards} />
      </div>

      {/* CHARTS SECTION */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
  {/* LEFT COLUMN: Pie + Treemap stacked */}
  <div className="flex flex-col gap-6 lg:col-span-1">
    {/* Pie Chart */}
    <SpendPieChart
      title="Spend vs Balance"
      data={[
        {
          name: "Spend",
          value: Number(totalSpend),
          color: totalSpend > 0 ? "#dc2626" : DEFAULT_CHART_COLOR,
        },
        {
          name: "Balance",
          value: Number(unspentBal),
          color: unspentBal > 0 ? "#16a34a" : DEFAULT_CHART_COLOR,
        },
      ]}
      centerValue={totalBudgetValue}
    />

    {/* Treemap (stacked below Pie) */}
      <TreemapChart data={cards.find((c) => c.title === "Total Expenditure")?.data} title="Classification Treemap" />

   
  </div>

  {/* RIGHT COLUMN: Bar Chart */}
  <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm">
    <SpendingByCommitteeBar
      data={barDataVal}
      title="Spending by Committee"
      className="flex-1 h-full"
    />
  </div>
</div>


      {/* COMMITTEE SLIDER */}
      {committeeDataVal.length > 0 && (
        <CommitteeSummarySlider data={committeeDataVal} sheetData={sheetData} />
      )}
    </div>
  )
}