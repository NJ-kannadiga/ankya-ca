// @ts-nocheck

import { useRef, useState,useEffect } from "react"
import * as XLSX from "xlsx";
import { useExpenseStore } from "@/store/useExpenseStore";
import logo from "@/assets/logo.jpeg"
import excel from "@/assets/BLF-Q3v1.xlsx"



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
  const [quarter, setQuarter] = useState("Q3")
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
const getCurrentQuarter = () => {
    const month = new Date().getMonth(); // 0 to 11
    const quarterNum = Math.floor(month / 3) + 1;
  setSelectedQuarter(`Q3`);
  };
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
function parsePaymentDate(dateValue?: string | number): Date | null {
  if (dateValue === null || dateValue === undefined) return null

  /* ===============================
     CASE 1: Excel serial number
     =============================== */
  if (typeof dateValue === "number" && isFinite(dateValue)) {
    const excelEpoch = new Date(1899, 11, 30)
    return new Date(excelEpoch.getTime() + dateValue * 86400000)
  }

  if (typeof dateValue !== "string") return null

  const trimmed = dateValue.trim()
  if (!trimmed) return null

  /* ===============================
     CASE 2: DD-MMM-YY (case-insensitive)
     e.g. 01-jan-25, 01-JAN-25
     =============================== */
  if (/[a-zA-Z]/.test(trimmed) && trimmed.includes("-")) {
    const [dayStr, monStr, yearStr] = trimmed.split("-")

    const monthMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    }

    const month = monthMap[monStr.toLowerCase()]
    const day = Number(dayStr)
    const year = yearStr.length === 2 ? 2000 + Number(yearStr) : Number(yearStr)

    if (!isFinite(day) || month === undefined || !isFinite(year)) return null
    return new Date(year, month, day)
  }

  /* ===============================
     CASE 3: DD-MM-YYYY or DD/MM/YYYY
     =============================== */
  if (trimmed.includes("-") || trimmed.includes("/")) {
    const parts = trimmed.split(/[-/]/)
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts

      const day = Number(dayStr)
      const month = Number(monthStr) - 1
      const year = Number(yearStr)

      if (!isFinite(day) || !isFinite(month) || !isFinite(year)) return null
      return new Date(year, month, day)
    }
  }

  return null
}

function formatDate(date: Date | null) {
  return date
    ? date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : ""
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
      // const paymentDate = parsePaymentDate(obj["Payment Date"]);
      // const quarter = getQuarterFromDate(paymentDate);
      // if (quarter) obj.Quarter = quarter;

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



  const loadExcelFromAssets = async () => {
    try {
      const response = await fetch(excel);
      if (!response.ok) throw new Error("Excel file not found");

      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })

const sheetA = workbook.Sheets[workbook.SheetNames[0]];
const sheetB = workbook.Sheets[workbook.SheetNames[1]];
const sheetC = workbook.Sheets[workbook.SheetNames[2]];

const sheet1 = workbook.Sheets[workbook.SheetNames[3]];
const sheet2 = workbook.Sheets[workbook.SheetNames[4]];

// Parse first 3 sheets and merge
const parsedSheet0 = [
  ...(sheetA ? await parseSheet(sheetA, "Sheet 0A") : []),
  ...(sheetB ? await parseSheet(sheetB, "Sheet 0B") : []),
  ...(sheetC ? await parseSheet(sheetC, "Sheet 0C") : []),
];

// Parse remaining sheets normally
const result = {
  sheet0: parsedSheet0.length ? parsedSheet0 : null,
  sheet1: sheet1 ? await parseSheet(sheet1, "Sheet 1") : null,
  sheet2: sheet2 ? await parseSheet(sheet2, "Sheet 2") : null,
};

      console.log("Parsed Sheets Separately:", result)

      setExcelData(result)
      onExcelParsed?.(result)
    } catch (error) {
      console.error("Excel loading failed:", error)
    }
  }

  // ===============================
  // AUTO LOAD ON APP START
  // ===============================
  useEffect(() => {
    loadExcelFromAssets()
    getCurrentQuarter()
  }, [])


  return (
    <header className="h-14 w-full flex items-center px-6 bg-white border-b">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-8 flex-1">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
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

          <DropdownMenuContent align="start" className="bg-black text-white shadow-lg">
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
        {/* <button className="flex items-center gap-2 text-sm px-3 py-1.5 border border-black rounded hover:bg-slate-100 transition">
          <Download size={16} />
          Export
        </button> */}

        {/* PROFILE */}
        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
          <User size={18} className="text-green-700" />
        </div>

        <div className="leading-tight text-left">
          <p className="text-sm font-medium text-slate-800">
 Admin           </p>
          <p className="text-xs text-slate-500">
            Chartered Accountant
          </p>
        </div>
      </div>
    </header>
  )
}
