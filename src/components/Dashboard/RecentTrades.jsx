import { formatDate, formatCurrency, emotionLabel, pnlColor } from "../../utils/formatters";
import { Link } from "react-router-dom";

export default function RecentTrades({ trades = [] }) {
  // PERBAIKAN 1: Pastikan 'trades' adalah array sebelum melakukan .slice()
  // Jika trades null/undefined, kita gunakan array kosong []
  const safeTrades = Array.isArray(trades) ? trades : [];
  const recent = safeTrades.slice(0, 5);

  return (
    <div className="bg-[#1A1D27] rounded-xl border border-white/5">
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Trade Terbaru</p>
        <Link to="/journal" className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">
          Lihat Semua →
        </Link>
      </div>

      {/* PERBAIKAN 2: Cek panjang array safeTrades */}
      {recent.length === 0 ? (
        <div className="p-5 text-center text-gray-500 text-sm">Belum ada trade</div>
      ) : (
        <div className="divide-y divide-white/5">
          {recent.map((t) => (
            // PERBAIKAN 3: Tambahkan optional chaining (?.) pada setiap properti 
            // untuk mencegah crash jika ada satu data yang tidak lengkap
            <div key={t?.id || Math.random()} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    t?.trade_type === "BUY"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {t?.trade_type || "N/A"}
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{t?.pair || "Unknown"}</p>
                  <p className="text-gray-500 text-xs">{t?.date ? formatDate(t.date) : "-"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${pnlColor(t?.profit_loss || 0)}`}>
                  {(t?.profit_loss || 0) >= 0 ? "+" : ""}
                  {formatCurrency(t?.profit_loss || 0)}
                </p>
                {t?.emotion_entry && (
                  <p className="text-gray-500 text-xs">{emotionLabel(t.emotion_entry)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}