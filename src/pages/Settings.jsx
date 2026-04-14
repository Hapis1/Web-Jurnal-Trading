import { useState } from "react";
import Layout from "../components/Layout/Layout";
import useTradeStore from "../store/tradeStore";
import { formatCurrency } from "../utils/formatters";
import toast from "react-hot-toast";
import { tradesApi } from "../services/Api";

export default function Settings() {
  const { account, setupAccount, resetAllData, fetchAccount } = useTradeStore();
  const [balance, setBalance] = useState(account?.start_balance ?? "");
  const [saving, setSaving] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetConfirm2, setResetConfirm2] = useState(false);

  const handleSetBalance = async (e) => {
    e.preventDefault();
    if (!balance || isNaN(balance) || parseFloat(balance) <= 0) {
      return toast.error("Masukkan balance yang valid");
    }
    setSaving(true);
    try {
      await setupAccount(parseFloat(balance));
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await tradesApi.getAll({ limit: 10000 });
      const trades = res.data;
      if (!trades.length) return toast("Tidak ada data untuk diekspor");

      const headers = ["ID", "Date", "Pair", "Type", "Entry", "Exit", "Lot", "P/L", "RR", "Emotion Entry", "Emotion Exit", "Notes"];
      const rows = trades.map((t) => [
        t.id, t.date, t.pair, t.trade_type, t.entry_price, t.exit_price,
        t.lot_size, t.profit_loss, t.risk_reward ?? "",
        t.emotion_entry ?? "", t.emotion_exit ?? "", `"${(t.notes ?? "").replace(/"/g, "'")}"`,
      ]);

      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trading-journal-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data berhasil diekspor!");
    } catch {
      toast.error("Gagal mengekspor data");
    }
  };

  const handleReset = async () => {
    if (!resetConfirm2) {
      setResetConfirm2(true);
      return;
    }
    await resetAllData();
    setResetConfirm(false);
    setResetConfirm2(false);
  };

  return (
    <Layout title="Settings">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Balance setup */}
        <div className="bg-[#1A1D27] rounded-xl border border-white/5 p-5">
          <h3 className="text-white font-semibold mb-1">Start Balance</h3>
          <p className="text-gray-500 text-xs mb-4">
            Set modal awal akun trading kamu.{" "}
            {account && <span className="text-gray-300">Saat ini: {formatCurrency(account.start_balance)}</span>}
          </p>
          <form onSubmit={handleSetBalance} className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="10000.00"
                className="w-full bg-[#0F1117] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>

        {/* Export */}
        <div className="bg-[#1A1D27] rounded-xl border border-white/5 p-5">
          <h3 className="text-white font-semibold mb-1">Export Data</h3>
          <p className="text-gray-500 text-xs mb-4">Download semua data trade dalam format CSV.</p>
          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1A1D27] rounded-xl border border-red-500/20 p-5">
          <h3 className="text-red-400 font-semibold mb-1">Danger Zone</h3>
          <p className="text-gray-500 text-xs mb-4">
            Reset semua data trade. Aksi ini tidak bisa dibatalkan!
          </p>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold border border-red-500/20 transition-colors"
            >
              🗑️ Reset Semua Data
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-400 text-sm font-medium">
                {resetConfirm2
                  ? "⚠️ Klik sekali lagi untuk konfirmasi FINAL — data tidak bisa dikembalikan!"
                  : "Apakah kamu yakin? Klik lagi untuk konfirmasi."}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
                >
                  {resetConfirm2 ? "YA, HAPUS SEMUA" : "Lanjutkan Reset"}
                </button>
                <button
                  onClick={() => { setResetConfirm(false); setResetConfirm2(false); }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}