
import {
  LayoutDashboard,
  Sprout,
  BrainCircuit,
  ChartNoAxesCombined,
  Leaf,
  Menu,
  X,
  BarChart3
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";

const navigation = [
  {
    name: "Overview",
    path: "/",
    icon: LayoutDashboard
  },
  {
    name: "Crop Recommendation",
    path: "/crop-recommendation",
    icon: Sprout
  },
  {
  name: "Model Performance",
  path: "/model-performance",
  icon: BarChart3,
},
  {
    name: "Model Insights",
    path: "/model-insights",
    icon: ChartNoAxesCombined
  }
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow"
      >
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40
        w-64 bg-[#153D2B] text-white
        flex flex-col
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>

        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#B6DB8A] flex items-center justify-center">
              <Leaf className="text-[#153D2B]" size={27} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                FasalBandhu
              </h1>
              <p className="text-xs text-green-200">
                AI Farmer Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6 flex-1">
          <p className="text-xs uppercase tracking-widest text-green-300 mb-4 px-3">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-[#B6DB8A] text-[#153D2B]"
                        : "text-green-100 hover:bg-white/10"
                    }
                  `}
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-5 border-t border-white/10">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm font-semibold">
              Precision Agriculture
            </p>
            <p className="text-xs text-green-200 mt-1">
              Intelligent decisions for better farming.
            </p>
          </div>

          <p className="text-center text-xs text-green-300 mt-5">
            FasalBandhu © 2026
          </p>
        </div>

      </aside>
    </>
  );
}
