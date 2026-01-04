import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CommitteeSummaryCard } from "@/components/ui/CommitteeSummaryCard"
import { CommitteeDetailModal } from "./CommitteeDetailModal"

type Committee=any
type Props = {
  data: Committee[]
  sheetData: any
}

export function CommitteeSummarySlider({ data , sheetData }: Props) {
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null)
  const [showCommittee, setShowCommittee] = useState(false)

  const ITEMS_PER_VIEW = 6
  const [index, setIndex] = useState(0)

  const maxIndex = Math.max(0, Math.ceil(data.length / ITEMS_PER_VIEW) - 1)

  const slides: Committee[][] = []
  for (let i = 0; i < data.length; i += ITEMS_PER_VIEW) {
    slides.push(data.slice(i, i + ITEMS_PER_VIEW))
  }

  const cardOnClick = (item: Committee) => {
    setSelectedCommittee(item)
    setShowCommittee(true)
  }

  return (
    <>
      <div className="relative">
        {index > 0 && (
          <button onClick={() => setIndex(i => i - 1)}>
            <ChevronLeft />
          </button>
        )}

        {index < maxIndex && (
          <button onClick={() => setIndex(i => i + 1)}>
            <ChevronRight />
          </button>
        )}

        <div className="overflow-hidden">
          <div
            className="flex transition-transform"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="min-w-full">
                <div className="grid grid-cols-3 grid-rows-2 gap-6">
                  {slide.map(item => (
                    <div key={item.id} onClick={() => cardOnClick(item)}>
                      <CommitteeSummaryCard {...item} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ MODAL */}
      <CommitteeDetailModal
        open={showCommittee}
        committee={selectedCommittee}
        sheetData={sheetData.filter((row: any) => row.Classification.toLowerCase() === selectedCommittee?.title.toLowerCase())}
        onClose={() => setShowCommittee(false)}
      />
    </>
  )
}
