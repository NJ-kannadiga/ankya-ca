import { useState } from "react"
import { CommitteeSummaryCard } from "@/components/ui/CommitteeSummaryCard"
import { CommitteeDetailModal } from "./CommitteeDetailModal"

type Committee = any
type Props = {
  data: Committee[]
  sheetData: any
}

export function CommitteeSummarySlider({ data, sheetData }: Props) {
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null)
  const [showCommittee, setShowCommittee] = useState(false)

  const cardOnClick = (item: Committee) => {
    setSelectedCommittee(item)
    setShowCommittee(true)
  }

  return (
    <>
      {/* Standard CSS Grid: 
         grid-cols-1 (Mobile)
         md:grid-cols-2 (Tablet)
         lg:grid-cols-3 (Desktop)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div 
            key={item.id} 
            onClick={() => cardOnClick(item)}
            className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          >
            <CommitteeSummaryCard {...item} />
          </div>
        ))}
      </div>

      {/* ✅ MODAL */}
      <CommitteeDetailModal
        open={showCommittee}
        committee={selectedCommittee}
        sheetData={sheetData.filter(
          (row: any) => 
            row.Classification?.toLowerCase() === selectedCommittee?.title?.toLowerCase()
        )}
        onClose={() => setShowCommittee(false)}
      />
    </>
  )
}