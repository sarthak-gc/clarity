import { Tooltip, Cell, PieChart, Pie } from "recharts";

export const TransactionPieChart = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const COLORS = [
    "#22c55e",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#10b981",
    "#f97316",
    "#6366f1",
  ];

  return (
    <PieChart width={400} height={400}>
      <Pie data={data} dataKey="value" outerRadius={150}>
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};
