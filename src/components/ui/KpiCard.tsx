import React from "react"

type KpiCardProps = {
  title: string
  amount: any
  percentText?: string
  percentValue?: string
  amountColor?: string
  percentColor?: string
  isPositive?: boolean
  data?:[]
}

export function KpiCard({
  title,
  amount,
  percentText,
  percentValue,
  amountColor = "text-slate-900",
  isPositive = false,
  percentColor= "text-orange-600",
  data
}: KpiCardProps) {
  return (
    <div  className="
    bg-white rounded-xl shadow-sm hover:shadow-md transition
    p-5 min-h-[120px]
    flex flex-col justify-between

    w-fit              /* 👈 key */
    min-w-[350px]      /* 👈 safe minimum */
    max-w-[320px]      /* 👈 prevent wide card */
  "
>
      
      {/* TOP SECTION */}
      <div>
        {/* TITLE */}
        <p className="text-xs tracking-wide text-slate-400 font-medium uppercase mb-2">
          {title}
        </p>

        {/* AMOUNT */}
    {  title.toLowerCase() !== 'community alert' && <div className={`text-2xl font-bold ${amountColor}`}>
          ₹ {amount}
        </div>}
         {  title.toLowerCase() == 'community alert' && <div className={`text-2xl font-bold ${amountColor}`}>
        {amount}
        </div>}
      </div>

      {/* BOTTOM SECTION (ALWAYS VISIBLE) */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        {percentValue && (
          <span className={`px-2 py-0.5 rounded-full ${percentColor} text-xs font-medium`}>
             {percentValue}
          </span>
        )}

        {percentText && (
          <span className="text-slate-500">
            {percentText}
          </span>
        )}
      </div>
    </div>
  )
}
