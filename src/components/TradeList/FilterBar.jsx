import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { COMMON_PAIRS, EMOTION_MAP } from "../../utils/formatters";

export default function FilterBar({ filters, onChange, onReset }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="bg-[#1A1D27] rounded-xl border border-white/5 p-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search pair */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-gray-500 mb-1">Pair</label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Cari pair..."
              value={filters.pair || ""}
              onChange={(e) => set("pair", e.target.value)}
              className="w-full bg-[#0F1117] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tipe</label>
          <select
            value={filters.trade_type || ""}
            onChange={(e) => set("trade_type", e.target.value)}
            className="bg-[#0F1117] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Semua</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>

        {/* Result */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasil</label>
          <select
            value={filters.result || ""}
            onChange={(e) => set("result", e.target.value)}
            className="bg-[#0F1117] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Semua</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
          </select>
        </div>

        {/* Emotion */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Emosi</label>
          <select
            value={filters.emotion || ""}
            onChange={(e) => set("emotion", e.target.value)}
            className="bg-[#0F1117] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Semua</option>
            {Object.entries(EMOTION_MAP).map(([k, v]) => (
              <option key={k} value={k}>{v} {k}</option>
            ))}
          </select>
        </div>

        {/* Date range */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Dari</label>
          <input
            type="date"
            value={filters.start_date || ""}
            onChange={(e) => set("start_date", e.target.value)}
            className="bg-[#0F1117] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sampai</label>
          <input
            type="date"
            value={filters.end_date || ""}
            onChange={(e) => set("end_date", e.target.value)}
            className="bg-[#0F1117] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 text-xs hover:text-white hover:border-white/30 transition-colors"
        >
          <FunnelIcon className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}