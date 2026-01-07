import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINRShort(value: number): string {
  if (value === null || value === undefined || !isFinite(value)) return "0"

  // 🔥 remove floating point garbage (Excel / JS noise)
  console.log("Formatting value as Units:",value );
  const cleaned = Math.abs(value) < 0.005 ? 0 : value

  const sign = cleaned < 0 ? "-" : ""
  const abs = Math.abs(cleaned)

  // 🔑 limit to 2 decimals, remove trailing zeros
  const fmt = (n: number) =>
    n
      .toFixed(2)                 // max 2 decimals
      .replace(/\.00$/, "")       // remove .00
      .replace(/(\.\d)0$/, "$1") // remove trailing 0

  if (abs >= 1_00_00_000) {
    return `${sign}${fmt(abs / 1_00_00_000)} Cr`
  }

  if (abs >= 1_00_000) {
    return `${sign}${fmt(abs / 1_00_000)} L`
  }

  if (abs >= 1_000) {
    return `${sign}${fmt(abs / 1_000)} K`
  }

  return `${sign}${fmt(abs)}`
}



  const MONEY_KEYS = [
  "overutilized budget",
  "remain total expense paid",
  "total expense paid",
  "amount",
  "budget",
  "remain",
  "overUtilized",
  "overutilized"

]
const excelDateToJSDate = (value: any) => {
  const serial = typeof value === "string" ? parseFloat(value) : value;
  
  // Basic validation: Excel dates for the 21st century fall roughly between 30,000 and 60,000
  if (isNaN(serial) || serial < 1) return value; 

  const date = new Date((serial - 25569) * 86400 * 1000);
  
  // Check if the resulting date is actually valid
  return isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN");
};

export function generateColumnsFromData(data: any[]) {
  if (!data || !data.length) return []

  const keys = Object.keys(data[0])

  return [
    { key: "id", label: "SL.NO" },
    ...keys.map((key) => {
      const normalizedKey = key.toLowerCase()

      // Detect the exact Payment Date column
      const isPaymentDateColumn =
        normalizedKey === "payment date" || normalizedKey === "Payment Date" ||
        normalizedKey === "payment_date"

      const isMoneyColumn = MONEY_KEYS.some((k) =>
        normalizedKey.includes(k)
      )

      return {
        key,
        label: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),

        render: (value: any) => {
          // ---------- PAYMENT DATE ----------
          if (isPaymentDateColumn && value !== null && value !== undefined && value !== "") {
            // If numeric Excel serial
            if (typeof value === "number" && !isNaN(value)) {
              const parsed = parsePaymentDate(value)
              if (parsed) return formatDate(parsed)
            }

            // If string date format
            if (typeof value === "string") {
              const parsed = parsePaymentDate(value)
              if (parsed) return formatDate(parsed)
            }

            // Fallback: return raw
            return value
          }

          // ---------- MONEY FORMATTING ----------
          if (isMoneyColumn && typeof value === "number") {
            return formatINRShort(value)
          }

          // ---------- DEFAULT ----------
          return value
        },
      }
    }),
  ]
}



export function generateRowsFromData(data: any[]) {
  if (!data || !data.length) return []

  return data.map((item, index) => ({
    id: index + 1,
    ...item,
  }))
}



export function parsePaymentDate(dateStr?: string | number): Date | null {
  if (dateStr === null || dateStr === undefined || dateStr === "") return null;

  // 1. Handle Excel Serial Numbers (Numeric)
  const numericValue = typeof dateStr === "number" ? dateStr : Number(String(dateStr).trim());
  
  // Check if it's a pure number (Excel serial or string-digit)
  if (!isNaN(numericValue) && typeof dateStr !== "object" && /^\d+(\.\d+)?$/.test(String(dateStr).trim())) {
    // Excel's epoch starts Jan 1, 1900. 
    // JS Date's epoch starts Jan 1, 1970.
    // The offset is roughly 25569 days.
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Most reliable base for Excel
    const jsDate = new Date(excelEpoch.getTime() + numericValue * 86400000);
    return jsDate;
  }

  const trimmed = String(dateStr).trim();

  // 2. Handle DD-MMM-YY (e.g., 03-Dec-25)
  if (trimmed.includes("-")) {
    const parts = trimmed.split("-");
    if (parts.length === 3) {
      const [dayStr, monStr, yearStr] = parts;
      const monthMap: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      };

      const month = monthMap[monStr.toLowerCase()];
      const day = Number(dayStr);
      let year = Number(yearStr);

      if (month === undefined || isNaN(day) || isNaN(year)) return null;
      if (yearStr.length === 2) year += 2000;

      return new Date(year, month, day);
    }
  }

  // 3. Handle DD/MM/YYYY (e.g., 15/12/2025)
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts.map(Number);

      if ([d, m, y].some(isNaN)) return null;

      // Note: We return a Date object to match the signature
      return new Date(y, m - 1, d);
    }
  }

  return null;
}

export function formatDate(date: Date | null): string {
  if (!date || isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}