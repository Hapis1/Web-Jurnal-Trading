import { XMarkIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatDateTime, emotionLabel, pnlColor } from "../../utils/formatters";
import { useState, useEffect } from "react";
import useTradeStore from "../../store/tradeStore";
import TradeForm from "../TradeForm/TradeForm";
import { tradesApi } from "../../services/Api";

export default function DayDetailModal({ date, dayData, onClose, onRefresh }) {
  const [trades, setTrades] = useState([]);
  const [editTrade, setEditTrade] = useState(null);
  const { updateTrade, deleteTrade } = useTradeStore();

  useEffect(() => {
    if (!date) return;
    const [year, month, day] = date.split("-").map(Number);
    const start = new Date(year, month - 1, day, 0, 0, 0).toISOString();
    const end = new Date(year, month - 1, day, 23, 59, 59).toISOString();
    tradesApi
      .getAll({ start_date: start, end_date: end, limit: 50 })
      .then((r) => setTrades(r.data))
      .catch(() => {});
  }, [date]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus trade ini?")) return;
    await deleteTrade(id);
    setTrades((t) => t.filter((x) => x.id !== id));
    onRefresh();
  };

  const handleUpdateSubmit = async (payload) => {
    await updateTrade(editTrade.id, payload);
    setEditTrade(null);
    // refresh list
    const [year, month, day] = date.split("-").map(Number);
    const start = new Date(year, month - 1, day, 0, 0, 0).toISOString();
    const end = new Date(year, month - 1, day, 23, 59, 59).toISOString();
    const r = await tradesApi.getAll({ start_date: start, end_date: end, limit: 50 });
    setTrades(r.data);
    onRefresh();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-[#1A1D27] rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div>
              <h2 className="text-white font-semibold">{date}</h2>
              <p className="text-gray-500 text-xs">
                {dayData?.trade_count} trade · {dayData?.win_count}W / {dayData?.loss_count}L ·
                <span className={pnlColor(dayData?.total_pnl)}>
                  {" "}{dayData?.total_pnl >= 0 ? "+" : ""}{formatCurrency(dayData?.total_pnl)}
                </span>
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {trades.map((t) => (
              <div key={t.id} className="p-4 hover:bg-white/2 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      t.trade_type === "BUY" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                    }`}>{t.trade_type}</span>
                    <span className="text-white text-sm font-medium">{t.pair}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditTrade(t)}
                      className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <span>Entry: <span className="text-gray-300">{t.entry_price}</span></span>
                  <span>Exit: <span className="text-gray-300">{t.exit_price}</span></span>
                  <span>Lot: <span className="text-gray-300">{t.lot_size}</span></span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-xs text-gray-500">{formatDateTime(t.date)}</p>
                  <p className={`text-sm font-bold ${pnlColor(t.profit_loss)}`}>
                    {t.profit_loss >= 0 ? "+" : ""}{formatCurrency(t.profit_loss)}
                  </p>
                </div>
                {(t.emotion_entry || t.emotion_exit) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t.emotion_entry && `Entry: ${emotionLabel(t.emotion_entry)}`}
                    {t.emotion_entry && t.emotion_exit && " · "}
                    {t.emotion_exit && `Exit: ${emotionLabel(t.emotion_exit)}`}
                  </p>
                )}
                {t.notes && <p className="text-xs text-gray-500 mt-1 italic">"{t.notes}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {editTrade && (
        <TradeForm
          initialData={editTrade}
          onSubmit={handleUpdateSubmit}
          onClose={() => setEditTrade(null)}
        />
      )}
    </>
  );
}