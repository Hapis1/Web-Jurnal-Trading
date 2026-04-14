import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children, title = "Trading Journal" }) {
  return (
    <div className="flex h-screen bg-[#0F1117] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}