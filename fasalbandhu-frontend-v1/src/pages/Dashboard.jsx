
import { useEffect, useState } from "react";
import {
  Database,
  Brain,
  Sprout,
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  checkAPIHealth,
  getFeatureImportance,
} from "../services/api";

import { Link } from "react-router-dom";

const DATASET_SIZE = 2200;
const TRAINING_SIZE = 1760;
const TESTING_SIZE = 440;
const CROP_CLASSES = 22;

const modelConfig = [
  { label: "Algorithm", value: "Random Forest" },
  { label: "Number of estimators", value: "200" },
  { label: "Random state", value: "42" },
  { label: "Max features", value: "sqrt" },
  { label: "Scikit-learn version", value: "1.6.1" },
  { label: "Input features", value: "7" },
];

const cropNames = [
  "Apple", "Banana", "Blackgram", "Chickpea",
  "Coconut", "Coffee", "Cotton", "Grapes",
  "Jute", "Kidneybeans", "Lentil", "Maize",
  "Mango", "Mothbeans", "Mungbean", "Muskmelon",
  "Orange", "Papaya", "Pigeonpeas", "Pomegranate",
  "Rice", "Watermelon",
];


const inputFeatures = [
  {
    code: "N",
    name: "Nitrogen",
    unit: "kg/ha",
    category: "Soil Nutrient",
    description: "Measures nitrogen availability in the soil for plant growth and leaf development.",
  },
  {
    code: "P",
    name: "Phosphorus",
    unit: "kg/ha",
    category: "Soil Nutrient",
    description: "Represents phosphorus content, which supports root development and energy transfer.",
  },
  {
    code: "K",
    name: "Potassium",
    unit: "kg/ha",
    category: "Soil Nutrient",
    description: "Measures potassium availability, important for plant health and water regulation.",
  },
  {
    code: "TEMP",
    name: "Temperature",
    unit: "°C",
    category: "Environmental",
    description: "Represents the environmental temperature affecting crop growth.",
  },
  {
    code: "HUM",
    name: "Humidity",
    unit: "%",
    category: "Environmental",
    description: "Measures atmospheric moisture conditions.",
  },
  {
    code: "pH",
    name: "Soil pH",
    unit: "pH scale",
    category: "Soil Property",
    description: "Indicates soil acidity or alkalinity and influences nutrient availability.",
  },
  {
    code: "RAIN",
    name: "Rainfall",
    unit: "mm",
    category: "Environmental",
    description: "Represents rainfall received, helping assess water availability.",
  },
];
 

function StatCard({ icon, label, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex rounded-xl bg-green-50 p-3 text-green-700">
        {icon}
      </div>

      <p className="text-sm text-gray-500">{label}</p>

      <h3 className="mt-1 text-2xl font-bold text-gray-800">
        {value}
      </h3>

      <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [features, setFeatures] = useState([]);
  const [featureError, setFeatureError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await checkAPIHealth();
        setApiStatus("online");
      } catch {
        setApiStatus("offline");
      }

      try {
        const response = await getFeatureImportance();

        const data = Array.isArray(response)
          ? response
          : response.feature_importance;

        if (!Array.isArray(data)) {
          throw new Error("Unexpected feature importance response.");
        }

        const mapped = data
          .map((item) => ({
            name: item.feature || item.name,
            importance: Number(
              item.importance ??
              item.importance_score ??
              item.value
            ),
          }))
          .filter((item) => item.name && Number.isFinite(item.importance))
          .sort((a, b) => b.importance - a.importance)
          .map((item) => ({
            ...item,
            percentage: Number((item.importance * 100).toFixed(2)),
          }));

        setFeatures(mapped);
      } catch (error) {
        setFeatureError(
          error.message || "Unable to load feature importance."
        );
      }
    };

    loadDashboard();
  }, []);

  const featureNames = {
    N: "Nitrogen",
    P: "Phosphorus",
    K: "Potassium",
    ph: "Soil pH",
    rainfall: "Rainfall",
    humidity: "Humidity",
    temperature: "Temperature",
  };

  const topFeature = features[0];

  const quickLinks = [
    {
      title: "Crop Recommendation",
      description: "Generate crop predictions from soil and climate data.",
      path: "/crop-recommendation",
      icon: <Sprout size={22} />,
    },
    {
      title: "Model Insights",
      description: "Explore global feature importance and SHAP analysis.",
      path: "/model-insights",
      icon: <Brain size={22} />,
    },
    {
      title: "Model Performance",
      description: "Compare five algorithms and evaluation metrics.",
      path: "/model-performance",
      icon: <Activity size={22} />,
    },
  ];

  return (
    <div className="space-y-6">

      
      {/* Page heading */}
      <div className="flex flex-col md:flex-row
        justify-between md:items-center gap-4">

        <div>
          <p className="text-sm text-green-700 font-medium">
            Agriculture Intelligence Platform
          </p>

          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Dashboard Overview
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor your crop recommendation system.
          </p>
        </div>

        <Link
          to="/crop-recommendation"
          className="inline-flex items-center justify-center
            gap-2 bg-[#153D2B] text-white px-5 py-3
            rounded-xl hover:bg-green-800 transition"
        >
          <Sprout size={19} />
          Recommend a Crop
          <ArrowRight size={17} />
        </Link>

      </div>

      {/* API Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          {apiStatus === "online" ? (
            <CheckCircle2 className="text-green-600" size={22} />
          ) : (
            <AlertCircle
              className={
                apiStatus === "offline"
                  ? "text-red-500"
                  : "text-amber-500"
              }
              size={22}
            />
          )}

          <div>
            <p className="text-sm font-semibold text-gray-800">
              ML API Status
            </p>
            <p className="text-xs text-gray-500">
              {apiStatus === "online"
                ? "FastAPI backend is responding."
                : apiStatus === "offline"
                ? "Backend is unavailable."
                : "Checking backend connection..."}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            apiStatus === "online"
              ? "bg-green-100 text-green-700"
              : apiStatus === "offline"
              ? "bg-red-100 text-red-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {apiStatus.toUpperCase()}
        </span>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Database size={22} />}
          label="Dataset Records"
          value="2,200"
          subtitle="Total dataset samples"
        />

        <StatCard
          icon={<Sprout size={22} />}
          label="Crop Categories"
          value="22"
          subtitle="Supported crop classes"
        />

        <StatCard
          icon={<Brain size={22} />}
          label="Best Model Accuracy"
          value="99.55%"
          subtitle="Random Forest"
        />

        <StatCard
          icon={<Activity size={22} />}
          label="Input Features"
          value="7"
          subtitle="Soil and environmental parameters"
        />
      </div>

      {/* Dataset Distribution */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Dataset Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribution of records between training and testing datasets.
        </p>

        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-700">
              Training Dataset
            </span>
            <span className="font-bold text-green-700">
              1,760 (80%)
            </span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-[80%] rounded-full bg-green-600" />
          </div>

          <div className="mt-5 flex justify-between text-sm">
            <span className="font-semibold text-gray-700">
              Testing Dataset
            </span>
            <span className="font-bold text-blue-700">
              440 (20%)
            </span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-[20%] rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Total Records</p>
            <p className="mt-1 text-xl font-bold text-gray-800">2,200</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Training Records</p>
            <p className="mt-1 text-xl font-bold text-green-700">1,760</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Testing Records</p>
            <p className="mt-1 text-xl font-bold text-blue-700">440</p>
          </div>
        </div>
      </section>

      
    {/* Input Features Overview */}
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mt-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
            <h3 className="text-base font-bold text-gray-800">
                ML Input Features Overview
            </h3>
            <p className="mt-1 text-xs text-gray-500">
                Seven soil and environmental parameters used by the model.
            </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            7 Input Features
            </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inputFeatures.map((feature, index) => (
            <div
                key={feature.code}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 transition hover:border-green-300 hover:shadow-sm"
            >
                {/* Feature Header */}
                <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xs font-bold text-green-700">
                    {feature.code}
                    </span>

                    <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-gray-800">
                        {feature.name}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                        Feature {index + 1}
                    </p>
                    </div>
                </div>

                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">
                    {feature.category}
                </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs leading-5 text-gray-500">
                {feature.description}
                </p>

                {/* Measurement Unit */}
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
                <span className="text-[11px] text-gray-400">
                    Measurement Unit
                </span>

                <span className="text-xs font-semibold text-green-700">
                    {feature.unit}
                </span>
                </div>
            </div>
            ))}
        </div>
        </div>
    </section>

      {/* Feature Importance */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Important Model Features
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Global Random Forest feature importance.
            </p>
          </div>

          <Link
            to="/model-insights"
            className="flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800"
          >
            View Details <ArrowUpRight size={16} />
          </Link>
        </div>

        {featureError ? (
          <p className="mt-5 text-sm text-red-600">{featureError}</p>
        ) : features.length > 0 ? (
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={features.map((item) => ({
                  ...item,
                  name: featureNames[item.name] || item.name,
                }))}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" unit="%" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={105}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Importance"]}
                />
                <Bar
                  dataKey="percentage"
                  fill="#15803d"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-5 text-sm text-gray-500">
            Loading feature importance...
          </p>
        )}

        {topFeature && (
          <p className="mt-3 text-sm text-gray-600">
            Most influential feature:{" "}
            <strong>
              {featureNames[topFeature.name] || topFeature.name}
            </strong>{" "}
            ({topFeature.percentage}%).
          </p>
        )}
      </section>

      {/* Model Configuration */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Model Configuration
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configuration of the selected Random Forest classifier.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modelConfig.map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-gray-50 p-4"
            >
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="mt-1 font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Crop Classes */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Supported Crop Categories
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          The model can classify inputs into these 22 crop categories.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {cropNames.map((crop) => (
            <span
              key={crop}
              className="rounded-full border border-green-100 bg-green-50 px-3 py-2 text-xs font-medium text-green-800"
            >
              {crop}
            </span>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-300"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-green-50 p-3 text-green-700">
                  {item.icon}
                </div>

                <ArrowUpRight
                  size={19}
                  className="text-gray-400 transition group-hover:text-green-700"
                />
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
