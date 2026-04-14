export default function StatCard({ label, value, sub, icon: Icon, color = "cyan", trend }) {
  const colorMap = {
    cyan: "text-cyan-400 bg-cyan-500/10",
    green: "text-green-400 bg-green-500/10",
    red: "text-red-400 bg-red-500/10",
    yellow: "text-yellow-400 bg-yellow-500/10",
    purple: "text-purple-400 bg-purple-500/10",
  };

  return (
    <div className="bg-[#1A1D27] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        {Icon && (
          <span className={`p-2 rounded-lg ${colorMap[color]}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>
      <p className="text-white text-2xl font-bold mb-1">{value ?? "—"}</p>
      {sub && <p className="text-gray-500 text-xs">{sub}</p>}
      {trend !== undefined && (
        <p className={`text-xs mt-1 font-medium ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}% vs bulan lalu
        </p>
      )}
    </div>
  );
}