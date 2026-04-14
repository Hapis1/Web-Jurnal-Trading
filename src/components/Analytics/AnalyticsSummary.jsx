import { formatCurrency, formatPercent } from "../../utils/formatters";

const CARDS = [
  { key: "total_pnl",       label: "Total P&L",       fmt: (v) => formatCurrency(v), color: (v) => v >= 0 ? "text-green-400" : "text-red-400" },
  { key: "win_rate",        label: "Win Rate",         fmt: (v) => formatPercent(v), color: () => "text-cyan-400" },
  { key: "profit_factor",   label: "Profit Factor",    fmt: (v) => v?.toFixed(2) ?? "—", color: (v) => v >= 1 ? "text-green-400" : "text-red-400" },
  { key: "total_trades",    label: "Total Trade",      fmt: (v) => v, color: () => "text-white" },
  { key: "avg_win",         label: "Avg Win",          fmt: (v) => formatCurrency(v), color: () => "text-green-400" },
  { key: "avg_loss",        label: "Avg Loss",         fmt: (v) => formatCurrency(v), color: () => "text-red-400" },
  { key: "best_trade",      label: "Best Trade",       fmt: (v) => formatCurrency(v), color: () => "text-green-400" },
  { key: "worst_trade",     label: "Worst Trade",      fmt: (v) => formatCurrency(v), color: () => "text-red-400" },
  { key: "max_drawdown",    label: "Max Drawdown",     fmt: (v) => formatCurrency(v), color: () => "text-red-400" },
  { key: "avg_rr",          label: "Avg Risk/Reward",  fmt: (v) => v > 0 ? `${v?.toFixed(2)}R` : "—", color: () => "text-purple-400" },
];

export default function AnalyticsSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {CARDS.map(({ key, label, fmt, color }) => (
        <div key={key} className="bg-[#1A1D27] rounded-xl border border-white/5 p-4">
          <p className="text-gray-500 text-xs mb-2">{label}</p>
          <p className={`text-lg font-bold ${color(summary[key])}`}>
            {fmt(summary[key])}
          </p>
        </div>
      ))}
    </div>
  );
}