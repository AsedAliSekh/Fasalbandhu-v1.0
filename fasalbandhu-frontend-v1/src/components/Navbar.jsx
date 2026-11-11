
import { Bell, Sprout } from "lucide-react";

import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard Overview",
  "/crop-recommendation": "Crop Recommendation",
  "/model-insights": "Model Insights"
};

export default function Navbar() {

  const location = useLocation();

  const title =
    pageTitles[location.pathname] || "FasalBandhu";

  return (
    <header className="h-20 bg-white border-b border-gray-100
      flex items-center justify-between px-6 lg:px-9">

      <div className="pl-10 lg:pl-0">
        <h2 className="text-lg font-bold text-gray-800">
          {title}
        </h2>

        <p className="text-xs text-gray-400 mt-1">
          Welcome to FasalBandhu AI Platform
        </p>
      </div>

      <div className="flex items-center gap-4">

       

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-100
            flex items-center justify-center">
            <Sprout className="text-green-700" size={21} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              FasalBandhu
            </p>
            <p className="text-xs text-gray-400">
              Admin
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
