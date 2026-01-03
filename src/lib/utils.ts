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

export function generateColumnsFromData(data: any[]) {

  if (!data || !data.length) return []

  const keys = Object.keys(data[0])

  return [
    { key: "id", label: "SL.NO" },
    ...keys.map((key) => {
      const normalizedKey = key.toLowerCase()

      const isMoneyColumn = MONEY_KEYS.some((k) =>
        normalizedKey.includes(k)
      )

      return {
        key,
        label: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),

        // ✅ format only if money column
        render: (value: any) => {
          if (isMoneyColumn && typeof value === "number") {
            return formatINRShort(value)
          }
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