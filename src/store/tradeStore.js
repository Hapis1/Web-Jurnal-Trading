import { create } from "zustand";
import { tradesApi, accountApi, analyticsApi } from "../services/api";
import toast from "react-hot-toast";

const useTradeStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  trades: [],
  account: null,
  summary: null,
  balanceHistory: [],
  isLoading: false,
  error: null,

  // ── Trades ───────────────────────────────────────────────────────────────
  fetchTrades: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await tradesApi.getAll(params);
      // Pastikan selalu Array
      set({ trades: Array.isArray(res.data) ? res.data : [] });
    } catch (e) {
      set({ error: e.message, trades: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createTrade: async (data) => {
    try {
      const res = await tradesApi.create(data);
      set((s) => ({ trades: [res.data, ...s.trades] }));
      await get().fetchAccount();
      await get().fetchSummary();
      await get().fetchBalanceHistory(); // Tambahkan ini agar chart update
      toast.success("Trade berhasil ditambahkan!");
      return res.data;
    } catch (e) {
      toast.error("Gagal menambahkan trade");
      throw e;
    }
  },

  updateTrade: async (id, data) => {
    try {
      const res = await tradesApi.update(id, data);
      set((s) => ({
        trades: s.trades.map((t) => (t.id === id ? res.data : t)),
      }));
      await get().fetchAccount();
      await get().fetchSummary();
      await get().fetchBalanceHistory();
      toast.success("Trade berhasil diperbarui!");
      return res.data;
    } catch (e) {
      toast.error("Gagal memperbarui trade");
      throw e;
    }
  },

  deleteTrade: async (id) => {
    try {
      await tradesApi.delete(id);
      set((s) => ({ trades: s.trades.filter((t) => t.id !== id) }));
      await get().fetchAccount();
      await get().fetchSummary();
      await get().fetchBalanceHistory();
      toast.success("Trade dihapus");
    } catch (e) {
      toast.error("Gagal menghapus trade");
      throw e;
    }
  },

  // ── Account ──────────────────────────────────────────────────────────────
  fetchAccount: async () => {
    try {
      const res = await accountApi.get();
      set({ account: res.data });
    } catch {
      set({ account: null });
    }
  },

  setupAccount: async (startBalance) => {
    try {
      const res = await accountApi.setup(startBalance);
      set({ account: res.data });
      await get().fetchBalanceHistory();
      toast.success("Balance berhasil diset!");
      return res.data;
    } catch (e) {
      toast.error("Gagal setup akun");
      throw e;
    }
  },

  fetchBalanceHistory: async () => {
    try {
      const res = await accountApi.balanceHistory();
      // Proteksi agar selalu array
      set({ balanceHistory: Array.isArray(res.data) ? res.data : [] });
    } catch {
      set({ balanceHistory: [] });
    }
  },

  resetAllData: async () => {
    try {
      await accountApi.reset();
      set({ trades: [], summary: null, balanceHistory: [] });
      await get().fetchAccount();
      toast.success("Data berhasil direset");
    } catch (e) {
      toast.error("Gagal reset data");
      throw e;
    }
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  fetchSummary: async () => {
    try {
      const res = await analyticsApi.summary();
      set({ summary: res.data });
    } catch {
      set({ summary: null });
    }
  },
}));

export default useTradeStore;