import { EMOTION_MAP } from "../../utils/formatters";

export default function EmotionPicker({ value, onChange, label = "Emosi" }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-2">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(EMOTION_MAP).map(([key, emoji]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(value === key ? null : key)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
              value === key
                ? "border-cyan-500 bg-cyan-500/15 text-cyan-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
            }`}
          >
            <span className="text-xl">{emoji}</span>
            <span className="truncate w-full text-center">{key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}