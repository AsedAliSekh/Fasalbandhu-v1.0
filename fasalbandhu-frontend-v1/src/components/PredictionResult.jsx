
import {
  CheckCircle2,
  Sprout,
  TrendingUp,
  TrendingDown,
  FlaskConical,
} from "lucide-react";

const formatCropName = (crop) =>
  crop?.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const inputLabels = {
  N: "Nitrogen",
  P: "Phosphorus",
  K: "Potassium",
  temperature: "Temperature",
  humidity: "Humidity",
  ph: "Soil pH",
  rainfall: "Rainfall",
};

const inputUnits = {
  N: "kg/ha",
  P: "kg/ha",
  K: "kg/ha",
  temperature: "°C",
  humidity: "%",
  ph: "",
  rainfall: "mm",
};

function FactorCard({ factor, positive }) {
  const magnitude = Math.abs(factor.shap_value);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-gray-800">{factor.label}</p>
          <p className="mt-1 text-xs text-gray-500">
            Input value: {factor.input_value}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            positive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {positive ? "+" : "-"}{magnitude.toFixed(4)}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${
            positive ? "bg-green-500" : "bg-red-500"
          }`}
          style={{
            width: `${Math.max(4, Math.min(magnitude / 0.3 * 100, 100))}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function PredictionResult({ result }) {
  if (!result) return null;

  const recommendations = result.top_recommendations || [];
  const explanation = result.explanation || {};

  return (
    <div className="space-y-6">
      {/* Main Recommendation */}
      <section className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">
        <div className="bg-green-700 p-6 text-white">
          <div className="flex items-center gap-2 text-sm font-medium text-green-100">
            <CheckCircle2 size={18} />
            AI Analysis Completed
          </div>

          <p className="mt-5 text-sm text-green-100">
            Recommended Crop
          </p>

          <div className="mt-2 flex items-center gap-3">
            <Sprout size={38} />
            <h2 className="text-3xl font-bold">
              {formatCropName(result.recommended_crop)}
            </h2>
          </div>

          <p className="mt-3 text-sm text-green-100">
            Your Random Forest model selected this crop based on the
            submitted soil and environmental parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
          {recommendations.map((item, index) => (
            <div
              key={item.crop}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <p className="text-xs font-medium text-gray-500">
                {index === 0 ? "Top Recommendation" : `Alternative ${index + 1}`}
              </p>

              <h3 className="mt-2 text-lg font-bold text-gray-800">
                {formatCropName(item.crop)}
              </h3>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {item.probability}%
              </p>

              <div className="mt-3 h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-600"
                  style={{
                    width: `${Math.min(item.probability, 100)}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Model probability
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SHAP Explanation */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-3 text-purple-700">
            <FlaskConical size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Explainable AI Analysis
            </h2>
            <p className="text-sm text-gray-500">
              Understanding why the model predicted {formatCropName(explanation.explained_crop)}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-900">
            Explanation Method
          </p>
          <p className="mt-1 text-sm text-purple-700">
            {explanation.method}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Positive Factors */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-800">
                Positive Factors
              </h3>
            </div>

            <div className="space-y-3">
              {explanation.positive_factors?.length > 0 ? (
                explanation.positive_factors.map((factor) => (
                  <FactorCard
                    key={factor.feature}
                    factor={factor}
                    positive={true}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No positive factors returned.
                </p>
              )}
            </div>
          </div>

          {/* Negative Factors */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <TrendingDown className="text-red-600" size={20} />
              <h3 className="font-semibold text-gray-800">
                Negative Factors
              </h3>
            </div>

            <div className="space-y-3">
              {explanation.negative_factors?.length > 0 ? (
                explanation.negative_factors.map((factor) => (
                  <FactorCard
                    key={factor.feature}
                    factor={factor}
                    positive={false}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No negative factors returned.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 rounded-lg bg-gray-50 p-4 text-xs leading-6 text-gray-600">
          SHAP values explain how individual input features influenced
          the model's prediction for the selected crop. Positive values
          support the model output, while negative values push it away.
          These are model explanations, not proof of agricultural
          causation or a guarantee of crop suitability.
        </p>
      </section>

      {/* Input Summary */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Submitted Parameters
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Soil and environmental values used for this prediction.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(result.input_features || {}).map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl bg-gray-50 p-4"
            >
              <p className="text-xs text-gray-500">
                {inputLabels[key] || key}
              </p>
              <p className="mt-2 text-xl font-bold text-gray-800">
                {value}{" "}
                <span className="text-xs font-normal text-gray-500">
                  {inputUnits[key]}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
