import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export const formatCurrency = (value, symbol = "$") => {
  if (value === null || value === undefined) return `${symbol}0.00`;
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};

export const formatPnl = (value) => {
  if (value === null || value === undefined) return "$0.00";
  const abs = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value >= 0 ? `+$${abs}` : `-$${abs}`;
};

export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatDate = (dateStr, fmt = "dd MMM yyyy") => {
  if (!dateStr) return "-";
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    return format(d, fmt, { locale: id });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr) => formatDate(dateStr, "dd MMM yyyy HH:mm");

export const formatMonth = (monthStr) => {
  // monthStr format: "2024-01"
  try {
    const [year, month] = monthStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    return format(d, "MMM yyyy", { locale: id });
  } catch {
    return monthStr;
  }
};

export const pnlColor = (value) => {
  if (value > 0) return "text-green-400";
  if (value < 0) return "text-red-400";
  return "text-gray-400";
};

export const pnlBg = (value, intensity = 1) => {
  if (!value) return "bg-gray-800";
  if (value > 0) {
    if (Math.abs(value) > 500 * intensity) return "bg-green-700";
    if (Math.abs(value) > 200 * intensity) return "bg-green-600";
    if (Math.abs(value) > 50 * intensity) return "bg-green-500/40";
    return "bg-green-500/20";
  } else {
    if (Math.abs(value) > 500 * intensity) return "bg-red-700";
    if (Math.abs(value) > 200 * intensity) return "bg-red-600";
    if (Math.abs(value) > 50 * intensity) return "bg-red-500/40";
    return "bg-red-500/20";
  }
};

export const EMOTION_MAP = {
  Fear: "😰",
  Greedy: "😤",
  Confused: "😕",
  Confident: "😎",
  Frustrated: "😠",
  Calm: "🧘",
  Focused: "🎯",
  Surprised: "😲",
};

export const emotionLabel = (key) => {
  if (!key) return "-";
  return `${EMOTION_MAP[key] || ""} ${key}`;
};

export const COMMON_PAIRS = [
  "XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "USDCHF",
  "AUDUSD", "USDCAD", "NZDUSD", "GBPJPY", "EURJPY",
  "BTC/USDT", "ETH/USDT", "BNB/USDT",
  "NAS100", "US30", "SPX500",
];