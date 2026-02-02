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

export function TopNav() {









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
