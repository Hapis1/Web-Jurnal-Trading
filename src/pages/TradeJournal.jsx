import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import TradeTable from "../components/TradeList/TradeTable";
import FilterBar from "../components/TradeList/FilterBar";
import TradeForm from "../components/TradeForm/TradeForm";
import useTradeStore from "../store/tradeStore";
import { PlusIcon } from "@heroicons/react/24/outline";

const EMPTY_FILTERS = {
  pair: "", trade_type: "", result: "", emotion: "", start_date: "", end_date: "",
};

export default function TradeJournal() {
  const { trades, fetchTrades, createTrade, updateTrade, deleteTrade } = useTradeStore();
  const [showForm, setShowForm] = useState(false);
  const [editTrade, setEditTrade] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    const params = {};
    if (filters.pair) params.pair = filters.pair;
    if (filters.trade_type) params.trade_type = filters.trade_type;
    if (filters.result) params.result = filters.result;
    if (filters.emotion) params.emotion = filters.emotion;
    if (filters.start_date) params.start_date = new Date(filters.start_date).toISOString();
    if (filters.end_date) params.end_date = new Date(filters.end_date + "T23:59:59").toISOString();
    fetchTrades(params);
    // eslint-disable-next-line
  }, [filters]);

  const handleEdit = (trade) => {
    setEditTrade(trade);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus trade ini?")) return;
    await deleteTrade(id);
  };

  const handleSubmit = async (payload) => {
    if (editTrade) {
      await updateTrade(editTrade.id, payload);
    } else {
      await createTrade(payload);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTrade(null);
  };

  return (
    <Layout title="Trade Journal">
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Semua Trade</h2>
            <p className="text-gray-500 text-xs mt-0.5">{trades.length} trade tercatat</p>
          </div>
          <button
            onClick={() => { setEditTrade(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Tambah Trade
          </button>
        </div>

        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />

        <TradeTable trades={trades} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {showForm && (
        <TradeForm
          initialData={editTrade}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />
      )}
    </Layout>
  );
}