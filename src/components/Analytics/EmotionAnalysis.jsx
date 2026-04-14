import { emotionLabel } from "../../utils/formatters";

export default function EmotionAnalysis({ emotions = [] }) {
  // PROTEKSI 1: Pastikan 'emotions' selalu berupa array
  const safeEmotions = Array.isArray(emotions) ? emotions : [];

  return (
    <div className="bg-[#1A1D27] rounded-xl border border-white/5 overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Analisis Emosi</p>
      </div>

      <div className="p-5">
        {/* PROTEKSI 2: Cek jika data kosong */}
        {safeEmotions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">Belum ada data emosi tercatat</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Baris 27 yang tadinya error sudah aman sekarang */}
            {safeEmotions.map((item, idx) => {
              // Hitung persentase untuk progress bar (asumsi ada properti count dan total)
              // Jika API hanya mengirim count, sesuaikan logikanya
              const winRate = item?.win_rate ?? 0;
              
              return (
                <div key={item?.emotion || idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {emotionLabel(item?.emotion)}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {item?.total_trades ?? 0} Trades
                      </p>
                    </div>
                    <p className={`text-sm font-bold ${winRate >= 50 ? "text-green-400" : "text-red-400"}`}>
                      {winRate}% WR
                    </p>
                  </div>
                  
                  {/* Progress Bar Visual */}
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        winRate >= 50 ? "bg-green-500/50" : "bg-red-500/50"
                      }`}
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}