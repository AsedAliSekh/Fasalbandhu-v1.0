import PredictionResult from "../components/PredictionResult";
import { useState } from "react";
import { predictCrop } from "../services/api";
import { Sparkles } from "lucide-react";

const initialValues = {
  N: "",
  P: "",
  K: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
};

const fields = [
  { name: "N", label: "Nitrogen (N)", unit: "kg/ha", min: 0, max: 150 },
  { name: "P", label: "Phosphorus (P)", unit: "kg/ha", min: 0, max: 150 },
  { name: "K", label: "Potassium (K)", unit: "kg/ha", min: 0, max: 210 },
  { name: "temperature", label: "Temperature", unit: "°C", min: 0, max: 50 },
  { name: "humidity", label: "Humidity", unit: "%", min: 0, max: 100 },
  { name: "ph", label: "Soil pH", unit: "pH", min: 0, max: 14 },
  { name: "rainfall", label: "Rainfall", unit: "mm", min: 0, max: 500 },
];

export default function CropRecommendation() {
  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


 // demo input handler
    const handleDemoInput = () => {
    const randomValue = (min, max, decimals = 0) => {
        const value = Math.random() * (max - min) + min;
        return Number(value.toFixed(decimals));
    };

    const demoData = {
        N: randomValue(20, 140),
        P: randomValue(10, 140),
        K: randomValue(10, 200),
        temperature: randomValue(15, 40, 1),
        humidity: randomValue(30, 95, 1),
        ph: randomValue(4.5, 8, 1),
        rainfall: randomValue(40, 300, 1),
    };

    setFormData(demoData);
    setResult(null);
    setError("");
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const inputData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, Number(value)])
    );

    setLoading(true);

    try {
      const data = await predictCrop(inputData);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to get crop recommendation. Check whether the ML API is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialValues);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Crop Recommendation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter soil and environmental parameters to get an AI-based crop recommendation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Soil & Environmental Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Provide all seven parameters required by the trained model.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-2 block text-sm font-medium text-gray-700">
                {field.label}
              </label>

              <div className="relative">
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="any"
                  min={field.min}
                  max={field.max}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-16 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        
        <div className="mt-8 flex flex-wrap gap-3">

        {/* Demo Input Button */}
        <button
            type="button"
            onClick={handleDemoInput}
            className="flex items-center gap-2 rounded-lg border border-green-600 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
        >
            <Sparkles size={18} />
            Demo Input
        </button>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? "Analyzing..." : "Get Crop Recommendation"}
        </button>

        {/* Reset Button */}
        <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
            Reset
        </button>

        </div>

      </form>

      {result && <PredictionResult result={result} />}
    </div>
  );
}
