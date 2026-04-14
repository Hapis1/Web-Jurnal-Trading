import { useEffect } from "react";
import useTradeStore from "../store/tradeStore";

export default function useTrades(params = {}) {
  const { trades, isLoading, error, fetchTrades, createTrade, updateTrade, deleteTrade } =
    useTradeStore();

  useEffect(() => {
    fetchTrades(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trades, isLoading, error, fetchTrades, createTrade, updateTrade, deleteTrade };
}