// @ts-nocheck

import { KpiCard } from "@/components/ui/KpiCard"
import { Modal } from "@/components/ui/Modal"
import { useState } from "react"
import { SpendingByCommitteeBar } from "../charts/SpendingByCommitteeBar"
import { CommonTable } from "../table/CommonTable"
import React from "react"
import { data } from "react-router-dom"
import { formatINRShort } from "@/lib/utils"
import { generateColumnsFromData  } from "@/lib/utils"
import { generateRowsFromData  } from "@/lib/utils"

type DashboardCardsProps = {
  data: {
    title: string
    amount: string
    percentage?: string
    percentText?: string
    percentValue?: number
    isPositive?: boolean
    amountColor?: string
    data?: []
  }[]
}

export function DashboardCards({ data }: DashboardCardsProps) {
  const ALLOWED_POPUP_TITLES = [
  "Total Budget Approved",
  "Total Expenditure",
  "Unspent Balance",
  "Community Alert",
]




    const [selectedCard, setSelectedCard] = useState<any>(null)

  return (
    <>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
      {data.map((item, index) => (
<div
  key={index}
  className={`cursor-pointer ${
    ALLOWED_POPUP_TITLES.includes(item.title) ? "" : "pointer-events-none"
  }`}
  onClick={() => {
    if (!ALLOWED_POPUP_TITLES.includes(item.title)) return
    setSelectedCard(item)
  }}
>
          <KpiCard
            title={item.title}
            amount={item.title.toLowerCase() === 'community alert' ? item.amount : formatINRShort(item.amount)}
            percentText={item.percentText ?? item.percentage}
            percentValue={item.percentValue}
            isPositive={item.isPositive}
            amountColor={item.amountColor}
          />
        </div>
      ))}
    </div>


{/* POPUP */}
      <Modal
        open={!!selectedCard}
        title={selectedCard?.title}
        onClose={() => setSelectedCard(null)}
      >
        {/* BAR GRAPH */}
  {selectedCard?.title !== "Community Alert" ? (
  <SpendingByCommitteeBar
    title={`${selectedCard?.title} – Breakdown`}
    data={selectedCard?.data}
  />
) : null}

        {/* TABLE */}
     <div className="mt-8">
  <CommonTable
    title={`${selectedCard?.title} Details`}
    columns={generateColumnsFromData(selectedCard?.data || [])}
    data={generateRowsFromData(selectedCard?.data || [])}
  />
</div>
      </Modal></>
  )
}
