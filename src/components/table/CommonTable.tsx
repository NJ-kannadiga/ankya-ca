// @ts-nocheck

import { useMemo, useState } from "react"
import { Download, Search } from "lucide-react"
import { TableColumn } from "./types"

type Props<T> = {
  title?: string
  columns: TableColumn<T>[]
  data: T[]
  onRowClick?: (row: T) => void

  enableSearch?: boolean
  enableExport?: boolean
}

export function CommonTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  onRowClick,
  enableSearch = false,
  enableExport = true,
}: Props<T>) {
  const [search, setSearch] = useState("")

  /* ===================== SEARCH ===================== */

  const filteredData = useMemo(() => {
    if (!search) return data

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    )
  }, [search, data])

  /* ===================== RENDER ===================== */

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm">
      {/* HEADER */}
      {(title || enableExport) && (
        <div className="flex items-center justify-between p-4 border-b">
          {title && (
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}

          {enableExport && (
            <button className="flex items-center gap-2 text-sm font-medium border border-slate-900 rounded-md px-3 py-1.5 hover:bg-slate-900 hover:text-white transition">
              <Download size={16} />
              Export
            </button>
          )}
        </div>
      )}

      {/* SEARCH */}
      {enableSearch && (
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search
              size={14}
              className="absolute left-2 top-2.5 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 border rounded-md text-sm w-full outline-none"
            />
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f7faf7] text-slate-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-2 text-${col.align ?? "left"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`border-t transition ${
                  onRowClick ? "cursor-pointer hover:bg-slate-50" : ""
                }`}
              >
                {columns.map((col) => {
                  const cellValue = row[col.key as keyof typeof row]

                  return (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-2 text-${col.align ?? "left"}`}
                    >
                      {col.render
                        ? col.render(cellValue, row)
                        : typeof cellValue === "object"
                        ? ""
                        : String(cellValue ?? "")}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
