import { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import BalanceCard from "../components/Dashboard/BalanceCard";
import StatCard from "../components/Dashboard/StatCard";
import EquityCurveChart from "../components/Dashboard/EquityCurveChart";
import WinLossDonut from "../components/Dashboard/WinLossDonut";
import RecentTrades from "../components/Dashboard/RecentTrades";
import useTradeStore from "../store/tradeStore";
import {
  TrophyIcon, CalculatorIcon,
  ArrowTrendingDownIcon, ListBulletIcon,
} from "@heroicons/react/24/outline";
import { formatPercent } from "../utils/formatters";

export default function Dashboard() {
  const { account, trades, summary, balanceHistory, fetchAccount, fetchTrades, fetchSummary, fetchBalanceHistory } =
    useTradeStore();

  useEffect(() => {
    fetchAccount();
    fetchTrades();
    fetchSummary();
    fetchBalanceHistory();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Row 1: Balance + Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <BalanceCard account={account} />
          <StatCard
            label="Win Rate"
            value={formatPercent(summary?.win_rate ?? 0)}
            sub={`${summary?.win_count ?? 0}W / ${summary?.loss_count ?? 0}L`}
            icon={TrophyIcon}
            color="green"
          />
          <StatCard
            label="Total Trade"
            value={summary?.total_trades ?? 0}
            sub="Semua trade tercatat"
            icon={ListBulletIcon}
            color="cyan"
          />
          <StatCard
            label="Profit Factor"
            value={summary?.profit_factor ? Number(summary.profit_factor).toFixed(2) : "—"}
            sub="Gross profit / gross loss"
            icon={CalculatorIcon}
            color={summary?.profit_factor >= 1 ? "green" : "red"}
          />
          <StatCard
            label="Max Drawdown"
            value={summary?.max_drawdown != null ? `$${Math.abs(summary.max_drawdown).toFixed(0)}` : "—"}
            sub="Peak-to-trough decline"
            icon={ArrowTrendingDownIcon}
            color="red"
          />
        </div>

        {/* Row 2: Equity Curve + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <EquityCurveChart data={balanceHistory} />
          </div>
          <WinLossDonut summary={summary} />
        </div>

        {/* Row 3: Recent trades */}
        <RecentTrades trades={trades || []} />
      </div>
    </Layout>
  );
}