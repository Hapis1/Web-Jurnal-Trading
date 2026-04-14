import Layout from "../components/Layout/Layout";
import PNLCalendar from "../components/PNLCalendar/PNLCalendar";

export default function PNLCalendarPage() {
  return (
    <Layout title="PNL Calendar">
      <div className="max-w-4xl mx-auto">
        <PNLCalendar />
      </div>
    </Layout>
  );
}