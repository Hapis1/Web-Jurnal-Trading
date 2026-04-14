import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import EmotionPicker from "./EmotionPicker";
import { COMMON_PAIRS, formatCurrency } from "../../utils/formatters";
import { format } from "date-fns";

const DEFAULT_FORM = {
  date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  pair: "",
  customPair: "",
  trade_type: "BUY",
  entry_price: "",
  exit_price: "",
  lot_size: "",
  stop_loss: "",
  emotion_entry: null,
  emotion_exit: null,
  notes: "",
  screenshot_url: "",
};

function calcPL(type, entry, exit, lot) {
  const e = parseFloat(entry);
  const x = parseFloat(exit);
  const l = parseFloat(lot);
  if (isNaN(e) || isNaN(x) || isNaN(l)) return null;
  return type === "BUY" ? (x - e) * l : (e - x) * l;
}

export default function TradeForm({ onSubmit, onClose, initialData = null }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [useCustomPair, setUseCustomPair] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        date: format(new Date(initialData.date), "yyyy-MM-dd'T'HH:mm"),
        pair: COMMON_PAIRS.includes(initialData.pair) ? initialData.pair : "custom",
        customPair: COMMON_PAIRS.includes(initialData.pair) ? "" : initialData.pair,
        trade_type: initialData.trade_type || "BUY",
        entry_price: initialData.entry_price ?? "",
        exit_price: initialData.exit_price ?? "",
        lot_size: initialData.lot_size ?? "",
        stop_loss: initialData.stop_loss ?? "",
        emotion_entry: initialData.emotion_entry || null,
        emotion_exit: initialData.emotion_exit || null,
        notes: initialData.notes || "",
        screenshot_url: initialData.screenshot_url || "",
      });
      if (!COMMON_PAIRS.includes(initialData.pair)) setUseCustomPair(true);
    }
  }, [initialData]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const pl = calcPL(form.trade_type, form.entry_price, form.exit_price, form.lot_size);
  const isProfit = pl !== null && pl >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actualPair = form.pair === "custom" || useCustomPair ? form.customPair : form.pair;
    if (!actualPair) return alert("Pilih atau masukkan pair/asset");

    setIsSubmitting(true);
    try {
      const payload = {
        date: new Date(form.date).toISOString(),
        pair: actualPair,
        trade_type: form.trade_type,
        entry_price: parseFloat(form.entry_price),
        exit_price: parseFloat(form.exit_price),
        lot_size: parseFloat(form.lot_size),
        stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
        emotion_entry: form.emotion_entry || null,
        emotion_exit: form.emotion_exit || null,
        notes: form.notes || null,
        screenshot_url: form.screenshot_url || null,
      };
      await onSubmit(payload);
      onClose();
    } catch {
      // error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1D27] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#1A1D27] z-10">
          <h2 className="text-white font-semibold text-lg">
            {initialData ? "Edit Trade" : "Tambah Trade Baru"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Row 1: Date & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Tanggal & Waktu</label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
                className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Tipe Trade</label>
              <div className="flex gap-2">
                {["BUY", "SELL"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("trade_type", t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      form.trade_type === t
                        ? t === "BUY"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Pair */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Pair / Asset</label>
            <div className="flex gap-2">
              <select
                value={useCustomPair ? "custom" : form.pair}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setUseCustomPair(true);
                    set("pair", "custom");
                  } else {
                    setUseCustomPair(false);
                    set("pair", e.target.value);
                  }
                }}
                className="flex-1 bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="">-- Pilih Pair --</option>
                {COMMON_PAIRS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="custom">Custom / Lainnya...</option>
              </select>
              {useCustomPair && (
                <input
                  type="text"
                  placeholder="Masukkan pair/asset"
                  value={form.customPair}
                  onChange={(e) => set("customPair", e.target.value)}
                  className="flex-1 bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              )}
            </div>
          </div>

          {/* Row 3: Entry, Exit, Lot */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "entry_price", label: "Entry Price" },
              { key: "exit_price", label: "Exit Price" },
              { key: "lot_size", label: "Lot Size / Qty" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                <input
                  type="number"
                  step="any"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  required
                  placeholder="0.00"
                  className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Row 4: Stop Loss & Auto P&L */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Stop Loss (opsional)</label>
              <input
                type="number"
                step="any"
                value={form.stop_loss}
                onChange={(e) => set("stop_loss", e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Profit / Loss (auto)</label>
              <div
                className={`w-full border rounded-lg px-3 py-2 text-sm font-bold ${
                  pl === null
                    ? "border-white/10 bg-[#0F1117] text-gray-500"
                    : isProfit
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}
              >
                {pl === null ? "—" : `${isProfit ? "+" : ""}${formatCurrency(pl)}`}
              </div>
            </div>
          </div>

          {/* Emotions */}
          <div className="grid grid-cols-2 gap-4">
            <EmotionPicker
              label="Emosi saat Entry"
              value={form.emotion_entry}
              onChange={(v) => set("emotion_entry", v)}
            />
            <EmotionPicker
              label="Emosi saat Exit"
              value={form.emotion_exit}
              onChange={(v) => set("emotion_exit", v)}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Catatan</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              placeholder="Tulis analisis, alasan entry, apa yang dipelajari..."
              className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* Screenshot URL */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Screenshot URL (opsional)</label>
            <input
              type="url"
              value={form.screenshot_url}
              onChange={(e) => set("screenshot_url", e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}