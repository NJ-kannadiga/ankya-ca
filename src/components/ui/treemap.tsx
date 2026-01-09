import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4E1C5A", "#82ca9d", "#8884d8", "#ffc658", "#ff8042", "#0088FE"];

export function TreemapChart({ data, title }: { data: any[]; title: string }) {
  
  const CustomizedContent = (props: any) => {
    const { x, y, width, height, index, name } = props;

    // 1. Calculate a dynamic font size based on the box width
    const fontSize = Math.max(10, Math.min(width / 10, 14));
    
    // 2. Estimate how many characters can fit (approximate)
    const maxChars = Math.floor(width / (fontSize * 0.6));
    const displayName = name.length > maxChars 
      ? `${name.substring(0, Math.max(0, maxChars - 3))}...` 
      : name;

    // 3. Only show text if the box is large enough to be readable
    const isVisible = width > 40 && height > 30;

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
        {isVisible && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="central" // Better vertical centering than manual offset
            fill="#fff"
            style={{
              fontSize: `${fontSize}px`,
              pointerEvents: "none", // Ensures tooltip works when hovering text
              fontWeight: 500
            }}
          >
            {displayName}
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