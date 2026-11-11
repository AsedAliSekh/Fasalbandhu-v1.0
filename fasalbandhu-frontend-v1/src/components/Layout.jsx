
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {

  return (
    <div className="min-h-screen bg-[#F7F9F6]">

      <Sidebar />

      <div className="lg:ml-64 min-h-screen flex flex-col">

        <Navbar />

        <main className="flex-1 p-5 md:p-8 lg:p-9">
          {children}
        </main>

      </div>

    </div>
  );
}
