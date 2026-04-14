import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatPercent } from "../../utils/formatters";

export default function BalanceCard({ account }) {
  if (!account) {
    return (
      <div className="bg-[#1A1D27] rounded-xl p-5 border border-white/5 col-span-2">
        <p className="text-gray-400 text-sm">Akun belum disetup. Pergi ke Settings untuk mengatur start balance.</p>
      </div>
    );
  }

  const pnl = account.current_balance - account.start_balance;
  const pct = account.start_balance > 0 ? (pnl / account.start_balance) * 100 : 0;
  const isProfit = pnl >= 0;

  return (
    <div className="bg-[#1A1D27] rounded-xl p-5 border border-white/5 col-span-2">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">Account Overview</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-gray-500 text-xs mb-1">Current Balance</p>
          <p className="text-white text-3xl font-bold">{formatCurrency(account.current_balance)}</p>
          <p className="text-gray-500 text-xs mt-1">
            Start: <span className="text-gray-300">{formatCurrency(account.start_balance)}</span>
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isProfit ? "bg-green-500/15" : "bg-red-500/15"}`}>
          {isProfit
            ? <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            : <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />}
          <div className="text-right">
            <p className={`text-lg font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
              {isProfit ? "+" : ""}{formatCurrency(pnl)}
            </p>
            <p className={`text-xs ${isProfit ? "text-green-500" : "text-red-500"}`}>
              {isProfit ? "+" : ""}{formatPercent(pct)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}