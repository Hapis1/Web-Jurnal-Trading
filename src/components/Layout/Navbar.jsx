import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import useTradeStore from "../../store/tradeStore";
import { formatCurrency, formatPercent } from "../../utils/formatters";

export default function Navbar({ title }) {
  const account = useTradeStore((s) => s.account);

  const pnl = account ? account.current_balance - account.start_balance : 0;
  const pct =
    account && account.start_balance > 0 ? (pnl / account.start_balance) * 100 : 0;
  const isProfit = pnl >= 0;

  return (
    <header className="h-14 bg-[#1A1D27] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-white font-semibold text-base">{title}</h1>

      {account && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Balance</p>
            <p className="text-white font-bold text-sm">
              {formatCurrency(account.current_balance)}
            </p>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${
              isProfit ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
            }`}
          >
            {isProfit ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            {isProfit ? "+" : ""}
            {formatPercent(pct)}
          </div>
        </div>
      )}
    </header>
  );
}