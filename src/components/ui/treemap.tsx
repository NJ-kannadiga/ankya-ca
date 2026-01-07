import { Treemap, ResponsiveContainer, Tooltip, Cell } from "recharts";

// Define a professional color palette
const COLORS = ["#4E1C5A", "#82ca9d", "#8884d8", "#ffc658", "#ff8042", "#0088FE"];

export function TreemapChart({ data, title }: { data: any[]; title: string }) {
  
  // Recharts Treemap expects an object for customized content to handle colors
  const CustomizedContent = (props: any) => {
    const { x, y, width, height, index, name } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: COLORS[index % COLORS.length],
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
        {width > 30 && height > 20 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-80">
      <h3 className="text-lg font-bold text-slate-700 mb-2">{title}</h3>

      <div style={{ width: "100%", height: "90%" }}>
        <ResponsiveContainer>
          <Treemap
            data={data.map((item) => ({
              name: item.name,
              value: item.utilized,
            }))}
            dataKey="value"
            stroke="#fff"
            content={<CustomizedContent />}
          >
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toLocaleString("en-IN"),
                name,
              ]}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}