// @ts-nocheck


import { SpendBarChart } from "@/components/charts/SpendBarChart"
import { DashboardCards } from "@/components/ui/DashboardCards"
import { CommonTable } from "@/components/table/CommonTable"
import { TableColumn } from "@/components/table/types"
import { SpendingByCommitteeBar } from "@/components/charts/SpendingByCommitteeBar"
import { SpendPieChart } from "@/components/charts/SpendPieChart"

import { JSX, useMemo, useState } from "react"
import { Building2, Cpu, Settings } from "lucide-react"

// Store & Utils
import { useExpenseStore } from "@/store/useExpenseStore"
import { formatINRShort } from "@/lib/utils"
export default function Adhoc() {
      const excelData = useExpenseStore((s) => s.excelData)
    const selectedQuarter = useExpenseStore((s) => s.selectedQuarter)
  const [sheetData, setSheetData] = useState<any>(null)


const cards = useMemo(() => {
  if (!excelData?.sheet0 || !excelData?.sheet2) {
     // ... default return
  }

  const totalSpent = excelData?.sheet0?.rows
    .filter((r: any) => 
      // Ensure the comparison string is lowercase to match .toLowerCase()
      r.Nature?.toLowerCase() === "ad-hoc" && 
      r.Quarter === selectedQuarter
    )
    .reduce((sum: number, row: any) => sum + (Number(row["Total Expense Paid"]) || 0), 0);

  // Note: Ensure Sheet2 "total" row is also handled safely for casing
  const approved = excelData?.sheet2?.rows?.find(
    (r: any) => r.Nature?.toLowerCase() === "total"
  )?.Amount || 0;

  const unapprovedAmt = Math.max(0, totalSpent - approved);
  const remainingAmt = approved - totalSpent;
  const unapprovedText = remainingAmt > 0 ? `${remainingAmt.toFixed(2)} Remaining` : null;

  console.log("Ad-Hoc Check:", { totalSpent, approved, selectedQuarter });

  return [
    {
      title: "TOTAL SPENT",
      amount: totalSpent,
      percentText: null,
      isPositive: true,
      amountColor: "text-orange-600",
      cardAccent: "orange",
    },
    // You can add your Unapproved card here using unapprovedAmt and unapprovedText
  ];
}, [excelData, selectedQuarter]);
const barChartData = useMemo(() => {
  if (!excelData?.sheet0) return [];

  // 1. Group and Sum by Classification
  const groupedData = excelData.sheet0.rows.reduce((acc: any, row: any) => {
    const isAdHoc = row.Nature?.toLowerCase() === "ad-hoc";
    const isCorrectQuarter = row.Quarter === selectedQuarter;

    if (isAdHoc && isCorrectQuarter) {
      // Use Classification (e.g., "Water & Sewage")
      const key = row["Classification"];
      const amount = Number(row["Total Expense Paid"]) || 0;

      if (key) {
        acc[key] = (acc[key] || 0) + amount;
      }
    }
    return acc;
  }, {});

  // 2. Convert the object { "Category": 100 } into array [{ name: "Category", utilized: 100 }]
  return Object?.entries(groupedData)?.map(([name, utilized]) => ({
    name,
    utilized: Number((utilized as number).toFixed(2)), // Keep 2 decimal places
  }));
}, [excelData?.sheet0, selectedQuarter]);
console.log(barChartData);
  const barData = [
    { name: "Marketing",  adhoc: 20 },
    { name: "Facilities",  adhoc: 54 },
    { name: "Technology",  adhoc: 45 },
    { name: "Operations",  adhoc: 0 },
    { name: "HR",  adhoc: 0 },
  ]
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

function generateRowsFromData(data: any[]) {
  if (!data || !data.length) return []

  return data.map((item, index) => ({
    id: index + 1,
    ...item,
  }))
}
const cards1 = [
  {
    title: "TOTAL SPENT",
    amount: "4.7 L",
    percentText: null,
    isPositive: true,
    amountColor: "text-orange-600",
    cardAccent: "orange",
  },

]

type Expense = {
  date: string
  vendor: string
  category: string
  description: string
  amount: number
}

const columns: TableColumn<Expense>[] = [
  { key: "date", label: "Date" },
  { key: "vendor", label: "Vendor" },
  {
    key: "category",
    label: "Category",
    render: (row) => (
      <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
        {row.category}
      </span>
    ),
  },
  { key: "description", label: "Description" },
  {
    key: "amount",
    label: "Amount",
    // align: "right",
    render: (row) => `₹${row.amount.toLocaleString("en-IN")}`,
  },
]

const data: Expense[] = [
  {
    date: "2026-01-05",
    vendor: "Marriott",
    category: "Office Supplies",
    description: "New laptops",
    amount: 48296,
  },
   {
    date: "2026-01-05",
    vendor: "Marriott",
    category: "Office Supplies",
    description: "New laptops",
    amount: 48296,
  },
   {
    date: "2026-01-05",
    vendor: "Marriott",
    category: "Office Supplies",
    description: "New laptops",
    amount: 48296,
  },
   {
    date: "2026-01-05",
    vendor: "Marriott",
    category: "Office Supplies",
    description: "New laptops",
    amount: 48296,
  },
   {
    date: "2026-01-05",
    vendor: "Marriott",
    category: "Office Supplies",
    description: "New laptops",
    amount: 48296,
  },
]
return (
    <>
          <div>
                <DashboardCards data={cards} />
              </div>
         {/* GRAPHS */}
           <div className="mt-12 grid grid-cols-1 lg:grid-cols-1 gap-12">
             {/* BAR GRAPH (WIDER) */}
             <div className="lg:col-span-2">
<div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 h-[500px]">
  <SpendingByCommitteeBar
    title="AD-HOC Distribution"
    data={barChartData}
  />
</div>
    </div>
     { excelData.sheet0.rows.length > 0 && <div className="mt-12 grid grid-cols-1 gap-12">

      <CommonTable
        title="Ad-Hoc Composition"
        columns={generateColumnsFromData(excelData.sheet0.rows.filter((r: any) => r.Nature?.toLowerCase() == "ad-hoc" ))}
        data={generateRowsFromData(excelData.sheet0.rows.filter((r: any) => r.Nature?.toLowerCase() == "ad-hoc" && r.Quarter === selectedQuarter))}
        onRowClick={(row) => console.log("Clicked:", row)}
      />
    </div>}
           </div>
     
    </>
  )}
