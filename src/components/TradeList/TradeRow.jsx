import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDate, formatCurrency, emotionLabel, pnlColor } from "../../utils/formatters";

export default function TradeRow({ trade, onEdit, onDelete }) {
  const t = trade;
  return (
    <tr className="border-b border-white/5 hover:bg-white/2 transition-colors group">
      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(t.date, "dd/MM/yy HH:mm")}</td>
      <td className="px-4 py-3">
        <span className="text-white text-sm font-medium">{t.pair}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          t.trade_type === "BUY" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
        }`}>{t.trade_type}</span>
      </td>
      <td className="px-4 py-3 text-gray-300 text-xs">{t.entry_price}</td>
      <td className="px-4 py-3 text-gray-300 text-xs">{t.exit_price}</td>
      <td className="px-4 py-3 text-gray-300 text-xs">{t.lot_size}</td>
      <td className={`px-4 py-3 text-sm font-bold ${pnlColor(t.profit_loss)}`}>
        {t.profit_loss >= 0 ? "+" : ""}{formatCurrency(t.profit_loss)}
      </td>
      <td className="px-4 py-3 text-gray-400 text-xs">
        {t.risk_reward ? `${t.risk_reward}R` : "—"}
      </td>
      <td className="px-4 py-3 text-gray-400 text-xs">
        {emotionLabel(t.emotion_entry)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(t)}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(t.id)}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}