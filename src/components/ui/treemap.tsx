import { Treemap, ResponsiveContainer, Tooltip } from "recharts"

export function TreemapChart({ data, title }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-72">
      <h3 className="text-lg font-bold text-slate-700 mb-2">{title}</h3>

      <ResponsiveContainer width="100%" height="90%">
        <Treemap
          width="100%"
          height="100%"
          data={data.map(item => ({
  name: item.name,
  value: item.utilized,  // must be "value"
}))}
          dataKey="value"
          stroke="#fff"
          fill="#4E1C5A"
        >
          <Tooltip
            formatter={(value, name) => [
              value.toLocaleString("en-IN"),
              name,
            ]}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}
