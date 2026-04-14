import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatPercent } from "../../utils/formatters";

const COLORS = ["#22C55E", "#EF4444", "#6B7280"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1D27] border border-white/10 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-white font-bold">{payload[0].name}: {payload[0].value}</p>
    </div>
  );
};

export default function WinLossDonut({ summary }) {
  const wins = summary?.win_count ?? 0;
  const losses = summary?.loss_count ?? 0;
  const be = (summary?.total_trades ?? 0) - wins - losses;

  const data = [
    { name: "Win", value: wins },
    { name: "Loss", value: losses },
    ...(be > 0 ? [{ name: "BE", value: be }] : []),
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-[#1A1D27] rounded-xl p-5 border border-white/5">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Win / Loss Ratio</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 text-sm">Belum ada data trade</p>
        </div>
      ) : (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <p className="text-white text-xl font-bold">
                {formatPercent(summary?.win_rate ?? 0)}
              </p>
              <p className="text-gray-500 text-xs">Win Rate</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-1">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-gray-400">{d.name}</span>
                <span className="text-white font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}