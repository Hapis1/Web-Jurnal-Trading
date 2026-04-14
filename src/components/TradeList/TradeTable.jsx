import { useState } from "react";
import TradeRow from "./TradeRow";

const HEADERS = [
  { key: "date", label: "Tanggal" },
  { key: "pair", label: "Pair" },
  { key: "trade_type", label: "Tipe" },
  { key: "entry_price", label: "Entry" },
  { key: "exit_price", label: "Exit" },
  { key: "lot_size", label: "Lot" },
  { key: "profit_loss", label: "P&L" },
  { key: "risk_reward", label: "RR" },
  { key: "emotion_entry", label: "Emosi" },
  { key: "actions", label: "" },
];

export default function TradeTable({ trades, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...trades].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-[#1A1D27] rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {HEADERS.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => key !== "actions" && handleSort(key)}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap
                    ${key !== "actions" ? "cursor-pointer hover:text-gray-300 select-none" : ""}
                  `}
                >
                  {label}
                  {sortKey === key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-500 text-sm">
                  Tidak ada trade ditemukan
                </td>
              </tr>
            ) : (
              sorted.map((t) => (
                <TradeRow key={t.id} trade={t} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-white/5 text-xs text-gray-500">
        {sorted.length} trade
      </div>
    </div>
  );
}