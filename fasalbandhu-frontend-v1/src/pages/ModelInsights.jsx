
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getFeatureImportance } from "../services/api";
import { BarChart3, Brain, Database, TrendingUp } from "lucide-react";

const descriptions = {
  rainfall: "Amount of rainfall received by the region.",
  humidity: "Atmospheric moisture level.",
  K: "Potassium content in the soil.",
  P: "Phosphorus content in the soil.",
  N: "Nitrogen content in the soil.",
  temperature: "Environmental temperature.",
  ph: "Acidity or alkalinity of the soil.",
};

const formatName = (name) => {
  const names = {
    N: "Nitrogen",
    P: "Phosphorus",
    K: "Potassium",
    ph: "Soil pH",
    rainfall: "Rainfall",
    humidity: "Humidity",
    temperature: "Temperature",
  };

  return names[name] || name;
};

export default function ModelInsights() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await getFeatureImportance();

        // Supports either a direct array or an object containing
        // a feature_importance array.
        const data = Array.isArray(response)
          ? response
          : response.feature_importance;

        if (!Array.isArray(data)) {
          throw new Error("Unexpected feature importance API response.");
        }

        setFeatures(
          data
            .map((item) => ({
              ...item,
              feature: item.feature || item.name,
              importance: Number(
                item.importance ?? item.importance_score ?? item.value
              ),
            }))
            .sort((a, b) => b.importance - a.importance)
        );
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          err.message ||
          "Unable to load model insights."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const chartData = features.map((item) => ({
    feature: formatName(item.feature),
    importance: Number((item.importance * 100).toFixed(2)),
  }));

  const topFeature = chartData[0];

  const totalImportance = features.reduce(
    (sum, item) => sum + item.importance,
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-gray-500">
        Loading model insights...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Model Insights
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore how soil and environmental features contribute
          to the Random Forest model's crop predictions.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Brain size={22} />}
          title="Algorithm"
          value="Random Forest"
          subtitle="Classification model"
        />

        <StatCard
          icon={<Database size={22} />}
          title="Input Features"
          value={features.length}
          subtitle="Soil and environmental parameters"
        />

        <StatCard
          icon={<TrendingUp size={22} />}
          title="Top Feature"
          value={topFeature?.feature || "N/A"}
          subtitle={
            topFeature
              ? `${topFeature.importance}% importance`
              : "No data available"
          }
        />
      </div>

      {/* Feature Importance Chart */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-green-700" size={23} />
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Global Feature Importance
            </h2>
            <p className="text-sm text-gray-500">
              Relative contribution of each feature to the trained model.
            </p>
          </div>
        </div>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 25, left: 15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, "auto"]}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="feature"
                width={105}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Importance"]}
              />
              <Bar
                dataKey="importance"
                fill="#15803d"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Feature Details */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Feature Importance Breakdown
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Features ranked by their importance in the Random Forest model.
        </p>

        <div className="mt-5 space-y-5">
          {features.map((item, index) => {
            const percentage = item.importance * 100;

            return (
              <div key={item.feature}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {index + 1}. {formatName(item.feature)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {descriptions[item.feature] || "Model input feature"}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-green-700">
                    {percentage.toFixed(2)}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-xs leading-6 text-amber-900">
          Research note: These values represent impurity-based feature
          importance from the Random Forest model. They indicate how
          much each feature contributes to the model's split decisions.
          They do not establish causal relationships or prove that a
          feature is agronomically more important.
        </p>

        <p className="mt-3 text-xs text-gray-400">
          Total importance: {(totalImportance * 100).toFixed(2)}%
        </p>
      </section>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-green-50 p-3 text-green-700">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 text-xl font-bold text-gray-800">{value}</h3>
      <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
