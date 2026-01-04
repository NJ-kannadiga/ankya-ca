// @ts-nocheck

import { useRef, useState } from "react"
import * as XLSX from "xlsx";
import { useExpenseStore } from "@/store/useExpenseStore";

import { Upload, Download, ChevronDown, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNav({ onExcelParsed }) {
  const selectedQuarter = useExpenseStore((s) => s.selectedQuarter);
  const setSelectedQuarter = useExpenseStore((s) => s.setSelectedQuarter);
  const setExcelData = useExpenseStore((s) => s.setExcelData);
  /* ---------------- STATE ---------------- */
  const [quarter, setQuarter] = useState("Q1")
  const fileRef = useRef(null)

  /* ---------------- HANDLERS ---------------- */
  const handleQuarterChange = (q) => {
    setQuarter(q)
    setSelectedQuarter(q);
    console.log("Selected Quarter:", q)
    // 👉 trigger API / dashboard refresh here
  }

  const handleUploadClick = () => {
    fileRef.current.click()
  }

  type NatureType = "Operating" | "Capex" | "Ad-Hoc";

 interface ExpenseRow {
  "Bank Account"?: string;
  "Payment Date"?: string;
  "Vendor Name"?: string;
  "Total Expense Paid": number | string;
  "Nature": NatureType;
  "Classification"?: string;
  "Classification-1"?: string;
  "Budgeted"?: "Yes" | "No";
}

 interface SummaryItem {
   name: string;
   value: number;
}
interface SummaryItem {
  name: string;
  value: number;
}
  const calculateExpenseSummary = (
    rows: ExpenseRow[]
  ): SummaryItem[] => {
    const totals = {
      Operating: 0,
      Capex: 0,
    "Ad-Hoc": 0,
    Total: 0,
  };

  rows.forEach((row) => {
    const amount = Number(row["Total Expense Paid"]) || 0;
    const nature = row.Nature;

    totals.Total += amount;

    if (nature === "Operating") {
      totals.Operating += amount;
    } else if (nature === "Capex") {
      totals.Capex += amount;
    } else if (nature === "Ad-Hoc") {
      totals["Ad-Hoc"] += amount;
    }
  });

  return [
    { name: "Total", value: totals.Total },
    { name: "Operating", value: totals.Operating },
    { name: "Capex", value: totals.Capex },
    { name: "Ad-Hoc", value: totals["Ad-Hoc"] },
  ];
}
 function parsePaymentDate(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null

  const trimmed = dateStr.trim()

  // ===============================
  // Format 1: DD-MMM-YY  (03-Dec-25)
  // ===============================
  if (trimmed.includes("-")) {
    const parts = trimmed.split("-")
    if (parts.length === 3) {
      const [dayStr, monStr, yearStr] = parts

      const monthMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2,
        Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8,
        Oct: 9, Nov: 10, Dec: 11,
      }

      const month = monthMap[monStr]
      if (month === undefined) return null

      const day = Number(dayStr)
      const year =
        yearStr.length === 2 ? Number(`20${yearStr}`) : Number(yearStr)

      if (!isFinite(day) || !isFinite(year)) return null

      return new Date(year, month, day)
    }
  }

  // ===============================
  // Format 2: DD/MM/YYYY  (15/12/2025)
  // ===============================
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/")
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts

      const day = Number(dayStr)
      const month = Number(monthStr) - 1
      const year = Number(yearStr)

      if (
        !isFinite(day) ||
        !isFinite(month) ||
        !isFinite(year)
      ) {
        return null
      }

      return new Date(year, month, day)
    }
  }

  return null
}


function getQuarterFromDate(date) {
  if (!date || isNaN(date)) return null;

  const month = date.getMonth(); // 0 = Jan

  if (month >= 3 && month <= 5) return "Q1"; // Apr–Jun
  if (month >= 6 && month <= 8) return "Q2"; // Jul–Sep
  if (month >= 9 && month <= 11) return "Q3"; // Oct–Dec
  return "Q4"; // Jan–Mar
}

async function parseSheet(sheet, sheetName) {
  const sheetData = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  if (!sheetData.length) return null;

  const rawHeaders = sheetData[0];
  const headers = rawHeaders
    .map((h) => String(h).trim())
    .filter(Boolean);

  const MAX_ROWS = 5000;
  const BATCH_SIZE = 100;

  const rows = [];
  const totalRows = Math.min(sheetData.length - 1, MAX_ROWS);

  for (let i = 1; i <= totalRows; i += BATCH_SIZE) {
    const batch = sheetData.slice(i, i + BATCH_SIZE);

    batch.forEach((row) => {
      const obj = {};
      let hasData = false;

      rawHeaders.forEach((header, colIndex) => {
        const key = String(header).trim();
        if (!key) return;

        const value = row[colIndex] ?? "";
        if (value !== "") hasData = true;

        obj[key] = value;
      });

      // ✅ QUARTER LOGIC
      const paymentDate = parsePaymentDate(obj["Payment Date"]);
      const quarter = getQuarterFromDate(paymentDate);
      if (quarter) obj.Quarter = quarter;

      if (hasData) rows.push(obj);
    });

    await new Promise((res) => setTimeout(res, 5));
  }

  return {
    sheetName,
    columns: [...headers, "Quarter"],
    rows,
  };
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });

      const sheet0 = workbook.Sheets[workbook.SheetNames[0]];
      const sheet1 = workbook.Sheets[workbook.SheetNames[1]];
      const sheet2 = workbook.Sheets[workbook.SheetNames[2]];

      const result = {
        sheet0: sheet0 ? await parseSheet(sheet0, "Sheet 0") : null,
        sheet1: sheet1 ? await parseSheet(sheet1, "Sheet 1") : null,
        sheet2: sheet2 ? await parseSheet(sheet2, "Sheet 2") : null,
      };

      console.log("Parsed Sheets Separately:", result);

      setExcelData(result);
      onExcelParsed?.(result);

    } catch (err) {
      console.error("Excel parsing error:", err);
    }
  };

  reader.readAsBinaryString(file);
};


// const handleFileChange = (e) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const reader = new FileReader();

//   reader.onload = async (event) => {
//     try {
//       const binaryData = event.target.result;
//       const workbook = XLSX.read(binaryData, { type: "binary" });

//       /* ============================
//          ✅ TAKE SHEETS 0, 1, 2
//       ============================ */
//       const targetSheetNames = workbook.SheetNames.slice(0, 3);

//       const MAX_ROWS = 5000;
//       const BATCH_SIZE = 100;

//       let allRows = [];
//       let finalHeaders = new Set();

//       for (const sheetName of targetSheetNames) {
//         const sheet = workbook.Sheets[sheetName];
//         if (!sheet) continue;

//         const sheetData = XLSX.utils.sheet_to_json(sheet, {
//           header: 1,
//           defval: "",
//         });

//         if (!sheetData.length) continue;

//         const rawHeaders = sheetData[0];
//         const headers = rawHeaders
//           .map((h) => String(h).trim())
//           .filter(Boolean);

//         headers.forEach((h) => finalHeaders.add(h));

//         const totalRows = Math.min(sheetData.length - 1, MAX_ROWS);
//         let processedRows = 0;

//         for (let i = 1; i <= totalRows; i += BATCH_SIZE) {
//           const batch = sheetData.slice(i, i + BATCH_SIZE);

//           batch.forEach((row) => {
//             const obj = {};
//             let hasData = false;

//             rawHeaders.forEach((header, colIndex) => {
//               const key = String(header).trim();
//               if (!key) return;

//               const value = row[colIndex] ?? "";
//               if (value !== "") hasData = true;

//               obj[key] = value;
//             });

//             /* ✅ QUARTER LOGIC */
//             const paymentDate = parsePaymentDate(obj["Payment Date"]);
//             const quarter = getQuarterFromDate(paymentDate);
//             if (quarter) obj.Quarter = quarter;

//             if (hasData) allRows.push(obj);
//           });

//           processedRows += batch.length;

//           const percent = Math.min(
//             90,
//             Math.round((processedRows / totalRows) * 100)
//           );
//           console.log(`Processing ${sheetName}: ${percent}%`);

//           await new Promise((res) => setTimeout(res, 5));
//         }
//       }

//       /* ============================
//          ✅ FINAL MERGED DATA
//       ============================ */
//       const finalData = {
//         columns: [...finalHeaders, "Quarter"],
//         rows: allRows,
//       };

//       console.log("Final Parsed Data (Sheets 0,1,2):", finalData);

//       setExcelData(finalData);
//       onExcelParsed?.(finalData);

//     } catch (err) {
//       console.error("Excel parsing error:", err);
//     }
//   };

//   reader.readAsBinaryString(file);
// };



  return (
    <header className="h-14 w-full flex items-center px-6 bg-white border-b">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-8 flex-1">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/logo.jpeg"
            alt="Sankya"
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-semibold text-[#4E1C5A]">
            ANKYA
          </span>
        </div>

        {/* QUARTER DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-slate-700 focus:outline-none">
             {quarter} <ChevronDown size={14} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
              <DropdownMenuItem
                key={q}
                onClick={() => handleQuarterChange(q)}
              >
                {q}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* UPLOAD */}
        <>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.csv,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-green-700 transition"
          >
            <Upload size={16} />
            Upload
          </button>
        </>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        {/* EXPORT */}
        <button className="flex items-center gap-2 text-sm px-3 py-1.5 border border-black rounded hover:bg-slate-100 transition">
          <Download size={16} />
          Export
        </button>

        {/* PROFILE */}
        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
          <User size={18} className="text-green-700" />
        </div>

        <div className="leading-tight text-left">
          <p className="text-sm font-medium text-slate-800">
            Sankya Admin
          </p>
          <p className="text-xs text-slate-500">
            Chartered Accountant
          </p>
        </div>
      </div>
    </header>
  )
}
