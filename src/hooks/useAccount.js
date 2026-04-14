import { useEffect } from "react";
import useTradeStore from "../store/tradeStore";

export default function useAccount() {
  const { account, balanceHistory, fetchAccount, setupAccount, fetchBalanceHistory, resetAllData } =
    useTradeStore();

  useEffect(() => {
    fetchAccount();
    fetchBalanceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { account, balanceHistory, fetchAccount, setupAccount, fetchBalanceHistory, resetAllData };
}