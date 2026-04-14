import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { to: "/", icon: HomeIcon, label: "Dashboard" },
  { to: "/journal", icon: BookOpenIcon, label: "Trade Journal" },
  { to: "/calendar", icon: CalendarDaysIcon, label: "PNL Calendar" },
  { to: "/analytics", icon: ChartBarIcon, label: "Analytics" },
  { to: "/settings", icon: Cog6ToothIcon, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-[#1A1D27] border-r border-white/5 flex flex-col py-6 px-3 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <span className="text-2xl">📈</span>
        <span className="text-white font-bold text-lg tracking-tight">TradeJournal</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}