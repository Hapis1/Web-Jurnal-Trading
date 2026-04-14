import { formatCurrency } from "../../utils/formatters";

function getPnlClass(pnl, tradeCount) {
  if (!tradeCount) return "bg-white/3 text-gray-600 border-white/5";
  if (pnl > 0) {
    if (pnl > 500) return "bg-green-500/40 text-green-300 border-green-500/30";
    if (pnl > 100) return "bg-green-500/25 text-green-400 border-green-500/20";
    return "bg-green-500/12 text-green-500 border-green-500/15";
  } else {
    if (pnl < -500) return "bg-red-500/40 text-red-300 border-red-500/30";
    if (pnl < -100) return "bg-red-500/25 text-red-400 border-red-500/20";
    return "bg-red-500/12 text-red-500 border-red-500/15";
  }
}

export default function CalendarDay({ day, pnlData, onClick, isToday }) {
  const data = pnlData;
  const colorClass = getPnlClass(data?.total_pnl, data?.trade_count);

  return (
    <button
      onClick={() => data?.trade_count && onClick(day, data)}
      className={`
        relative flex flex-col items-start justify-between
        p-2 rounded-lg border min-h-[72px] w-full text-left
        transition-all
        ${colorClass}
        ${data?.trade_count ? "cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-black/30" : "cursor-default"}
        ${isToday ? "ring-1 ring-cyan-500" : ""}
      `}
    >
      <span className={`text-xs font-medium ${isToday ? "text-cyan-400" : ""}`}>
        {day}
      </span>

      {data?.trade_count > 0 && (
        <div className="w-full">
          <p className="text-xs font-bold leading-tight">
            {data.total_pnl >= 0 ? "+" : ""}
            {formatCurrency(data.total_pnl)}
          </p>
          <p className="text-xs opacity-70">{data.trade_count} trade</p>
        </div>
      )}
    </button>
  );
}