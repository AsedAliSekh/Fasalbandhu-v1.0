
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import CropRecommendation from "./pages/CropRecommendation";
import ModelInsights from "./pages/ModelInsights";
import ModelPerformance from "./pages/ModelPerformance";

function App() {

  return (
    <Layout>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route
          path="/crop-recommendation"
          element={<CropRecommendation />}
        />

        <Route
          path="/model-insights"
          element={<ModelInsights />}
        />

        <Route
          path="/model-performance"
          element={<ModelPerformance />}
        />

        <Route
          path="*"
          element={<Dashboard />}
        />

      </Routes>

    </Layout>
  );
}

export default App;
