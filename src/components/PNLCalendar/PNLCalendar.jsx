import { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns";
import { id } from "date-fns/locale";
import CalendarDay from "./CalendarDay";
import DayDetailModal from "./DayDetailModal";
import { formatCurrency } from "../../utils/formatters";
import { analyticsApi } from "../../services/api";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function PNLCalendar() {
  const [current, setCurrent] = useState(new Date());
  const [calData, setCalData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [loading, setLoading] = useState(false);

  const year = current.getFullYear();
  const month = current.getMonth() + 1;
  const today = new Date();

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.calendar(year, month);
      const map = {};
      res.data.forEach((d) => { map[d.date] = d; });
      setCalData(map);
    } catch {}
    setLoading(false);
  }, [year, month]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const daysInMonth = getDaysInMonth(current);
  // Monday = 0 offset
  let startOffset = getDay(startOfMonth(current)) - 1;
  if (startOffset < 0) startOffset = 6;

  const prevMonth = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleDayClick = (day, data) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDay(dateStr);
    setSelectedDayData(data);
  };

  // Monthly summary
  const allDays = Object.values(calData);
  const monthPnl = allDays.reduce((s, d) => s + d.total_pnl, 0);
  const winDays = allDays.filter((d) => d.total_pnl > 0).length;
  const lossDays = allDays.filter((d) => d.total_pnl < 0).length;
  const totalTrades = allDays.reduce((s, d) => s + d.trade_count, 0);

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="bg-[#1A1D27] rounded-xl border border-white/5 p-5">
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-white font-bold text-lg">
            {format(current, "MMMM yyyy", { locale: id })}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm">Memuat...</div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() + 1 &&
                year === today.getFullYear();

              return (
                <CalendarDay
                  key={day}
                  day={day}
                  pnlData={calData[dateStr]}
                  isToday={isToday}
                  onClick={handleDayClick}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Bulan Ini",
            value: formatCurrency(monthPnl),
            color: monthPnl >= 0 ? "text-green-400" : "text-red-400",
          },
          { label: "Total Trade", value: totalTrades, color: "text-white" },
          { label: "Hari Profit", value: winDays, color: "text-green-400" },
          { label: "Hari Loss", value: lossDays, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#1A1D27] rounded-xl border border-white/5 p-4 text-center">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Day detail modal */}
      {selectedDay && (
        <DayDetailModal
          date={selectedDay}
          dayData={selectedDayData}
          onClose={() => { setSelectedDay(null); setSelectedDayData(null); }}
          onRefresh={fetchCalendar}
        />
      )}
    </div>
  );
}