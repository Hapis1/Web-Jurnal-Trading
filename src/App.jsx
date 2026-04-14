import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import TradeJournal from "./pages/TradeJournal";
import PNLCalendarPage from "./pages/PNLCalendar";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1D27",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#22C55E", secondary: "#1A1D27" } },
          error:   { iconTheme: { primary: "#EF4444", secondary: "#1A1D27" } },
        }}
      />
      <Routes>
        <Route path="/"          element={<Dashboard />} />
        <Route path="/journal"   element={<TradeJournal />} />
        <Route path="/calendar"  element={<PNLCalendarPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}