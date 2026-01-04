// @ts-nocheck

import { DashboardCards } from "@/components/ui/DashboardCards";
import { SpendBarChart } from "@/components/charts/SpendBarChart";
import { SpendPieChart } from "@/components/charts/SpendPieChart";
import { CommitteeSnapshots } from "@/components/CommitteeSnapshots";
import { useMemo } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { formatINRShort } from "@/lib/utils";

// --- Types ---
type NatureType = "Operating" | "Capex" | "Ad-Hoc";

interface ExpenseRow {
  "Total Expense Paid": number;
  Nature: NatureType;
  Quarter: "Q1" | "Q2" | "Q3" | "Q4";
  Classification?: string;
}

interface BarItem {
  name: string;
  opex: number;
  capex: number;
  adhoc: number;
}



// --- Helper Functions ---
function formatToCrL(value: number): string {

  return value ;
}

function percent(part: number, total: number): string {
  if (!total) return "0%";
  return `${((part / total) * 100).toFixed(0)}%`;
}

export default function Overview() {
  const excelData = useExpenseStore((s) => s.excelData);
  const selectedQuarter = useExpenseStore((s) => s.selectedQuarter);

  // 1. Filtered Data
  const filteredRows = useMemo(() => {
    if (!excelData?.sheet0?.rows) return [];
    return excelData['sheet0'].rows.filter(row => row.Quarter === selectedQuarter);
  }, [excelData, selectedQuarter]);

  // 2. Derive Dashboard Cards
  const cards = useMemo(() => {
    let operating = 0;
    let capex = 0;
    let adhoc = 0;

    filteredRows.forEach((r) => {
      const amt = Number(r["Total Expense Paid"]) || 0;
      if (r.Nature === "Operating") operating += amt;
      else if (r.Nature === "Capex") capex += amt;
      else if (r.Nature?.toLowerCase() === "ad-hoc") adhoc += amt;
    });

    const total = operating + capex + adhoc;
    const qLabel = filteredRows[0]?.Quarter ? `(${filteredRows[0].Quarter})` : "";

    return [
      { title: `Total Spend ${qLabel}`, rawAmount: total, amount: formatToCrL(total), percentValue: "100%", isPositive: true, colorKey: total },
      { title: "OPEX Actuals", rawAmount: operating, amount: formatToCrL(operating), percentValue: `${percent(operating, total)} of total`, isPositive: true, colorKey: "opex" },
      { title: "CAPEX Actuals", rawAmount: capex, amount: formatToCrL(capex), percentText: `${percent(capex, total)} of total`, amountColor: "text-green-700", colorKey: "capex" },
      { title: "Ad-Hoc Spend", rawAmount: adhoc, amount: formatToCrL(adhoc), percentText: `${percent(adhoc, total)} of total`, amountColor: "text-orange-600", colorKey: "adhoc" },
    ];
  }, [filteredRows]);

  // 3. Derive Bar & Snapshot Data
  const barData = useMemo(() => {
    const map: Record<string, BarItem> = {};

    filteredRows.forEach((row) => {
      const classification = row.Classification?.trim();
      if (!classification) return;

      const amount = Number(row["Total Expense Paid"]) || 0;

      if (!map[classification]) {
        map[classification] = { name: classification, opex: 0, capex: 0, adhoc: 0 };
      }

      if (row.Nature === "Operating") map[classification].opex += amount;
      else if (row.Nature === "Capex") map[classification].capex += amount;
      else if (row.Nature === "Ad-Hoc") map[classification].adhoc += amount;
    });

    return Object.values(map);
  }, [filteredRows]);

  // 4. Derive Pie Data
  const pieData = useMemo(() => [
    { name: "OPEX", value: cards[1].rawAmount },
    { name: "CAPEX", value: cards[2].rawAmount },
    { name: "AD-HOC", value: cards[3].rawAmount },
  ], [cards]);

  return (
    <>
      <div>
        <DashboardCards data={cards} />
      </div>

   <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3">
    <SpendBarChart data={barData} />
  </div>

  <div className="lg:col-span-1">
    <SpendPieChart
      title="Overall Composition"
      data={pieData}
      centerValue={cards[0].amount}
      showlegend={false}
    />
  </div>
</div>

      <CommitteeSnapshots data={barData} />
    </>
  );
}