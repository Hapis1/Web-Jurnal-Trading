import { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import AnalyticsSummary from "../components/Analytics/AnalyticsSummary";
import EmotionAnalysis from "../components/Analytics/EmotionAnalysis";
import MonthlyBreakdown from "../components/Analytics/MonthlyBreakdown";
import useAnalytics from "../hooks/useAnalytics";
import { formatCurrency, formatPercent } from "../utils/formatters";

export default function Analytics() {
  const { summary, emotions, monthly, pairs, isLoading, fetchAll } = useAnalytics();

  useEffect(() => {
    fetchAll();
  }, []);

  // PROTEKSI: Pastikan pairs selalu diperlakukan sebagai array
  const safePairs = Array.isArray(pairs) ? pairs : [];

  return (
    <Layout title="Analytics">
      <div className="space-y-4 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-gray-500 text-sm text-center py-20">Memuat data analitik...</div>
        ) : (
          <>
            <AnalyticsSummary summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MonthlyBreakdown monthly={monthly} />
              <EmotionAnalysis emotions={emotions} />
            </div>

            {/* Pair stats table - Gunakan safePairs */}
            {safePairs.length > 0 ? (
              <div className="bg-[#1A1D27] rounded-xl border border-white/5 overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Statistik per Pair</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Pair", "Total Trade", "Win", "Loss", "Win Rate", "Total PNL", "Avg PNL"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {safePairs.map((p) => (
                        <tr key={p?.pair || Math.random()} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 text-white font-medium text-sm">{p?.pair || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{p?.total_trades ?? 0}</td>
                          <td className="px-4 py-3 text-green-400 text-sm">{p?.win_count ?? 0}</td>
                          <td className="px-4 py-3 text-red-400 text-sm">{p?.loss_count ?? 0}</td>
                          <td className="px-4 py-3 text-cyan-400 text-sm">{formatPercent(p?.win_rate ?? 0)}</td>
                          <td className={`px-4 py-3 text-sm font-medium ${(p?.total_pnl || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {formatCurrency(p?.total_pnl || 0)}
                          </td>
                          <td className={`px-4 py-3 text-sm ${(p?.avg_pnl || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {formatCurrency(p?.avg_pnl || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Tampilkan pesan jika data kosong daripada menghilangkannya sama sekali
              <div className="bg-[#1A1D27] rounded-xl border border-white/5 p-10 text-center">
                <p className="text-gray-500 text-sm">Belum ada data statistik per pair</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}