import { formatCurrency } from "../../utils/formatters";

export default function MonthlyBreakdown({ monthly = [] }) {
  // PROTEKSI 1: Pastikan 'monthly' selalu diperlakukan sebagai array
  const safeMonthly = Array.isArray(monthly) ? monthly : [];

  return (
    <div className="bg-[#1A1D27] rounded-xl border border-white/5 overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Performa Bulanan</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-white/5 bg-white/2">
              <th className="px-5 py-3 text-left font-medium uppercase text-[10px]">Bulan</th>
              <th className="px-5 py-3 text-left font-medium uppercase text-[10px]">Trade</th>
              <th className="px-5 py-3 text-left font-medium uppercase text-[10px]">Win Rate</th>
              <th className="px-5 py-3 text-left font-medium uppercase text-[10px]">Profit/Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* PROTEKSI 2: Cek apakah ada data, jika tidak tampilkan baris kosong */}
            {safeMonthly.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-gray-500">
                  Belum ada data bulanan tersedia.
                </td>
              </tr>
            ) : (
              // Baris 55 yang tadinya error diperbaiki di sini
              safeMonthly.map((m, idx) => {
                const isPositive = (m?.pnl || 0) >= 0;
                return (
                  <tr key={m?.month || idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{m?.month || "N/A"}</td>
                    <td className="px-5 py-3 text-gray-400">{m?.total_trades ?? 0}</td>
                    <td className="px-5 py-3 text-cyan-400">{m?.win_rate ?? 0}%</td>
                    <td className={`px-5 py-3 font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}{formatCurrency(m?.pnl || 0)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}