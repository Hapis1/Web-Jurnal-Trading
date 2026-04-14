import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload.value;
  // Gunakan optional chaining untuk payload
  const pnlVal = payload?.value;

  return (
    <div className="bg-[#1A1D27] border border-white/10 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-white font-bold">{formatCurrency(val)}</p>
      {pnlVal !== undefined && (
        <p className={pnlVal >= 0 ? "text-green-400" : "text-red-400"}>
          PNL: {formatCurrency(pnlVal)}
        </p>
      )}
    </div>
  );
};

export default function EquityCurveChart({ data }) {
  // PROTEKSI UTAMA: Cek apakah data adalah array dan memiliki isi
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length < 2) {
    return (
      <div className="bg-[#1A1D27] rounded-xl p-5 border border-white/5 flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Belum cukup data untuk menampilkan equity curve</p>
          <p className="text-gray-600 text-[10px] mt-1">(Dibutuhkan minimal 2 titik data)</p>
        </div>
      </div>
    );
  }

  const startBalance = safeData?.balance ?? 0;
  
  // Kalkulasi data chart dengan aman
  const chartData = safeData.map((d) => ({
    ...d,
    pnl: (d.balance || 0) - startBalance,
  }));

  // Hitung min/max untuk domain YAxis agar chart tidak terlihat flat
  const balances = chartData.map((d) => d.balance || 0);
  const minVal = Math.min(...balances);
  const maxVal = Math.max(...balances);
  const padding = (maxVal - minVal) * 0.1 || 100;

  return (
    <div className="bg-[#1A1D27] rounded-xl p-5 border border-white/5">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">Equity Curve</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6B7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minVal - padding, maxVal + padding]}
            tick={{ fill: "#6B7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#06B6D4"
            strokeWidth={2}
            fill="url(#balanceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#06B6D4", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}