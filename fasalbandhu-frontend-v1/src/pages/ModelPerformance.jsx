
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Award,
  Target,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const modelResults = [
  {
    model: "Logistic Regression",
    accuracy: 97.2727,
    precision: 97.4022,
    recall: 97.2727,
    f1: 97.2464,
  },
  {
    model: "KNN",
    accuracy: 97.9545,
    precision: 98.0356,
    recall: 97.9545,
    f1: 97.9283,
  },
  {
    model: "Decision Tree",
    accuracy: 97.9545,
    precision: 98.0598,
    recall: 97.9545,
    f1: 97.9423,
  },
  {
    model: "Random Forest",
    accuracy: 99.5455,
    precision: 99.5671,
    recall: 99.5455,
    f1: 99.5452,
  },
  {
    model: "XGBoost",
    accuracy: 98.6364,
    precision: 98.7407,
    recall: 98.6364,
    f1: 98.6210,
  },
];


const crossValidationResults = [
  {
    model: "Logistic Regression",
    meanAccuracy: 96.8182,
    stdAccuracy: 0.6577,
    meanF1: 96.7824,
  },
  {
    model: "KNN",
    meanAccuracy: 96.5341,
    stdAccuracy: 1.2106,
    meanF1: 96.5011,
  },
  {
    model: "Decision Tree",
    meanAccuracy: 98.5227,
    stdAccuracy: 0.6818,
    meanF1: 98.5209,
  },
  {
    model: "Random Forest",
    meanAccuracy: 99.4318,
    stdAccuracy: 0.4754,
    meanF1: 99.4292,
  },
  {
    model: "XGBoost",
    meanAccuracy: 99.2045,
    stdAccuracy: 0.2784,
    meanF1: 99.2035,
  },
];

const randomForestTuning = [
  {
    version: "Baseline Random Forest",
    cvF1: 99.4292,
    testAccuracy: 99.5455,
  },
  {
    version: "Tuned Random Forest",
    cvF1: 99.6002,
    testAccuracy: 99.5455,
  },
];

const xgboostTuning = [
  {
    version: "Baseline XGBoost",
    cvF1: 99.2035,
    testAccuracy: 98.6364,
  },
  {
    version: "Tuned XGBoost",
    cvF1: 99.4879,
    testAccuracy: 98.8636,
  },
];

const randomForestFoldScores = [
  { fold: "Fold 1", accuracy: 100 },
  { fold: "Fold 2", accuracy: 99.7159 },
  { fold: "Fold 3", accuracy: 98.8636 },
  { fold: "Fold 4", accuracy: 98.8636 },
  { fold: "Fold 5", accuracy: 99.7159 },
];


const tunedModelParameters = {
  randomForest: [
    { parameter: "n_estimators", value: "200" },
    { parameter: "max_depth", value: "None" },
    { parameter: "max_features", value: "sqrt" },
    { parameter: "min_samples_leaf", value: "1" },
    { parameter: "min_samples_split", value: "5" },
  ],

  xgboost: [
    { parameter: "n_estimators", value: "200" },
    { parameter: "max_depth", value: "7" },
    { parameter: "learning_rate", value: "0.05" },
    { parameter: "subsample", value: "1.0" },
    { parameter: "colsample_bytree", value: "0.8" },
  ],
};


const cropClasses = [
  "apple", "banana", "blackgram", "chickpea", "coconut",
  "coffee", "cotton", "grapes", "jute", "kidneybeans",
  "lentil", "maize", "mango", "mothbeans", "mungbean",
  "muskmelon", "orange", "papaya", "pigeonpeas",
  "pomegranate", "rice", "watermelon",
];

// Reconstructed from the supplied confusion matrix.
// Rows = actual class; columns = predicted class.
const confusionMatrix = cropClasses.map((crop, i) =>
  cropClasses.map((_, j) => {
    if (i === j) return i === 2 || i === 20 ? 19 : 20;
    if (i === 2 && j === 11) return 1;
    if (i === 20 && j === 8) return 1;
    return 0;
  })
);

const bestModel = modelResults.reduce((best, current) =>
  current.accuracy > best.accuracy ? current : best
);

const chartData = modelResults.map((item) => ({
  model: item.model,
  Accuracy: item.accuracy,
  Precision: item.precision,
  Recall: item.recall,
  "F1-Score": item.f1,
}));

function MetricCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-green-50 p-3 text-green-700">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-gray-800">{value}</h3>
      <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

export default function ModelPerformance() {
  const totalSamples = 440;
  const correctPredictions = 438;
  const incorrectPredictions = 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Model Performance
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Evaluation and comparison of five machine learning
          algorithms for crop recommendation.
        </p>
      </div>

      {/* Best Model */}
      <section className="rounded-2xl bg-green-800 p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 text-green-100">
          <Award size={22} />
          <span className="text-sm font-medium">
            Best Performing Algorithm
          </span>
        </div>

        <h2 className="mt-3 text-3xl font-bold">{bestModel.model}</h2>

        <p className="mt-2 text-sm text-green-100">
          Achieved the highest accuracy among all five evaluated algorithms.
        </p>

        <p className="mt-5 text-4xl font-bold">
          {bestModel.accuracy.toFixed(2)}%
        </p>
        <p className="text-sm text-green-100">Classification accuracy</p>
      </section>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Target size={22} />}
          title="Accuracy"
          value={`${bestModel.accuracy.toFixed(2)}%`}
          subtitle="Correct predictions"
        />
        <MetricCard
          icon={<Activity size={22} />}
          title="Precision"
          value={`${bestModel.precision.toFixed(2)}%`}
          subtitle="Precision score"
        />
        <MetricCard
          icon={<CheckCircle2 size={22} />}
          title="Recall"
          value={`${bestModel.recall.toFixed(2)}%`}
          subtitle="Recall score"
        />
        <MetricCard
          icon={<Award size={22} />}
          title="F1-Score"
          value={`${bestModel.f1.toFixed(2)}%`}
          subtitle="F1 evaluation score"
        />
      </div>

      {/* Accuracy Comparison */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Algorithm Accuracy Comparison
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Accuracy achieved by each evaluated classification algorithm.
        </p>

        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 15, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="model"
                angle={-15}
                textAnchor="end"
                interval={0}
                height={65}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                domain={[90, 100]}
                tick={{ fontSize: 12 }}
                unit="%"
              />
              <Tooltip
                formatter={(value) => [`${value.toFixed(4)}%`, "Accuracy"]}
              />
              <Bar
                dataKey="Accuracy"
                fill="#15803d"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* All Metrics Comparison */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Evaluation Metrics Comparison
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Comparison of accuracy, precision, recall and F1-score.
        </p>

        <div className="mt-5 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="model"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={65}
              />
              <YAxis domain={[90, 100]} unit="%" />
              <Tooltip
                formatter={(value) => `${value.toFixed(4)}%`}
              />
              <Legend />
              <Bar dataKey="Accuracy" fill="#15803d" />
              <Bar dataKey="Precision" fill="#2563eb" />
              <Bar dataKey="Recall" fill="#d97706" />
              <Bar dataKey="F1-Score" fill="#9333ea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Detailed Model Comparison
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">Algorithm</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Precision</th>
                <th className="p-3">Recall</th>
                <th className="p-3">F1-Score</th>
              </tr>
            </thead>

            <tbody>
              {modelResults.map((item) => (
                <tr
                  key={item.model}
                  className="border-b border-gray-100"
                >
                  <td className="p-3 font-semibold text-gray-800">
                    {item.model}
                    {item.model === bestModel.model && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Best
                      </span>
                    )}
                  </td>
                  <td className="p-3">{item.accuracy.toFixed(2)}%</td>
                  <td className="p-3">{item.precision.toFixed(2)}%</td>
                  <td className="p-3">{item.recall.toFixed(2)}%</td>
                  <td className="p-3">{item.f1.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confusion Matrix */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          Confusion Matrix - Random Forest
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Actual versus predicted labels across the 22 crop classes.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-xs text-green-700">Total Samples</p>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {totalSamples}
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs text-blue-700">Correct Predictions</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {correctPredictions}
            </p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-xs text-red-700">Incorrect Predictions</p>
            <p className="mt-1 text-2xl font-bold text-red-900">
              {incorrectPredictions}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={19} className="text-green-600" />
            <p className="text-sm font-semibold text-gray-800">
              Correct classification: 438 out of 440
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle size={19} className="text-amber-600" />
            <p className="text-sm text-gray-700">
              Blackgram was misclassified as Maize once.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle size={19} className="text-amber-600" />
            <p className="text-sm text-gray-700">
              Rice was misclassified as Jute once.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <p className="mb-3 text-xs text-gray-500">
            Full confusion matrix. Rows represent actual classes;
            columns represent predicted classes.
          </p>

          <table className="border-collapse text-center text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white p-2">Actual / Predicted</th>
                {cropClasses.map((crop) => (
                  <th
                    key={crop}
                    className="min-w-12 border border-gray-200 bg-gray-50 p-2"
                    title={crop}
                  >
                    {crop.slice(0, 4)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {confusionMatrix.map((row, i) => (
                <tr key={cropClasses[i]}>
                  <th className="sticky left-0 whitespace-nowrap border border-gray-200 bg-gray-50 p-2 text-left">
                    {cropClasses[i]}
                  </th>

                  {row.map((value, j) => (
                    <td
                      key={j}
                      title={`${cropClasses[i]} → ${cropClasses[j]}: ${value}`}
                      className={`border border-gray-200 p-2 ${
                        i === j
                          ? "bg-green-100 font-bold text-green-900"
                          : value > 0
                          ? "bg-red-200 font-bold text-red-900"
                          : "text-gray-400"
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


    {/* Stratified 5-Fold Cross Validation */}
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div>
        <h2 className="text-lg font-bold text-gray-800">
        Stratified 5-Fold Cross-Validation
        </h2>
        <p className="mt-1 text-sm text-gray-500">
        Evaluation of model stability across five stratified folds.
        </p>
    </div>

    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-green-50 p-4">
        <p className="text-xs text-green-700">Mean CV Accuracy</p>
        <p className="mt-1 text-2xl font-bold text-green-900">99.43%</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
        <p className="text-xs text-blue-700">Standard Deviation</p>
        <p className="mt-1 text-2xl font-bold text-blue-900">0.48%</p>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
        <p className="text-xs text-purple-700">Mean CV F1-Score</p>
        <p className="mt-1 text-2xl font-bold text-purple-900">99.43%</p>
        </div>
    </div>

    <h3 className="mt-7 font-semibold text-gray-800">
        Cross-Validation Accuracy by Algorithm
    </h3>

    <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
            data={crossValidationResults}
            margin={{ top: 10, right: 15, left: 0, bottom: 30 }}
        >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
            dataKey="model"
            angle={-15}
            textAnchor="end"
            interval={0}
            height={65}
            tick={{ fontSize: 11 }}
            />
            <YAxis domain={[90, 100]} unit="%" />
            <Tooltip
            formatter={(value) => `${Number(value).toFixed(4)}%`}
            />
            <Bar
            dataKey="meanAccuracy"
            name="Mean CV Accuracy"
            fill="#15803d"
            radius={[5, 5, 0, 0]}
            />
        </BarChart>
        </ResponsiveContainer>
    </div>

    <h3 className="mt-7 font-semibold text-gray-800">
        Random Forest: Individual Fold Accuracy
    </h3>

    <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={randomForestFoldScores}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="fold" />
            <YAxis domain={[95, 100]} unit="%" />
            <Tooltip
            formatter={(value) => `${Number(value).toFixed(4)}%`}
            />
            <Bar
            dataKey="accuracy"
            name="Accuracy"
            fill="#2563eb"
            radius={[5, 5, 0, 0]}
            />
        </BarChart>
        </ResponsiveContainer>
    </div>

    <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
            <th className="p-3">Algorithm</th>
            <th className="p-3">Mean Accuracy</th>
            <th className="p-3">Std. Dev.</th>
            <th className="p-3">Mean F1</th>
            </tr>
        </thead>
        <tbody>
            {crossValidationResults.map((item) => (
            <tr key={item.model} className="border-b border-gray-100">
                <td className="p-3 font-medium">{item.model}</td>
                <td className="p-3">{item.meanAccuracy.toFixed(2)}%</td>
                <td className="p-3">{item.stdAccuracy.toFixed(2)}%</td>
                <td className="p-3">{item.meanF1.toFixed(2)}%</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </section>

    {/* Hyperparameter Optimization */}
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-gray-800">
        Hyperparameter Optimization
    </h2>
    <p className="mt-1 text-sm text-gray-500">
        Comparison between baseline and tuned model configurations.
    </p>

    {/* Random Forest */}
    <div className="mt-7">
        <h3 className="font-semibold text-gray-800">
        Random Forest Optimization
        </h3>

        <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
            <thead className="bg-gray-50 text-left">
            <tr>
                <th className="p-3">Version</th>
                <th className="p-3">CV F1-Score</th>
                <th className="p-3">Test Accuracy</th>
            </tr>
            </thead>
            <tbody>
            {randomForestTuning.map((item) => (
                <tr key={item.version} className="border-b border-gray-100">
                <td className="p-3 font-medium">{item.version}</td>
                <td className="p-3">{item.cvF1.toFixed(2)}%</td>
                <td className="p-3">{item.testAccuracy.toFixed(2)}%</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>

        <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800">
        CV F1-score improved by 0.17 percentage points after tuning.
        Test accuracy remained unchanged.
        </p>
    </div>

    {/* XGBoost */}
    <div className="mt-8">
        <h3 className="font-semibold text-gray-800">
        XGBoost Optimization
        </h3>

        <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
            <thead className="bg-gray-50 text-left">
            <tr>
                <th className="p-3">Version</th>
                <th className="p-3">CV F1-Score</th>
                <th className="p-3">Test Accuracy</th>
            </tr>
            </thead>
            <tbody>
            {xgboostTuning.map((item) => (
                <tr key={item.version} className="border-b border-gray-100">
                <td className="p-3 font-medium">{item.version}</td>
                <td className="p-3">{item.cvF1.toFixed(2)}%</td>
                <td className="p-3">{item.testAccuracy.toFixed(2)}%</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>

        <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        CV F1-score improved by 0.28 percentage points and test
        accuracy improved by 0.23 percentage points after tuning.
        </p>
    </div>
    </section>


    {/* Selected Hyperparameters */}
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-gray-800">
        Optimized Hyperparameter Configurations
    </h2>

    <p className="mt-1 text-sm text-gray-500">
        Best parameter combinations identified through GridSearchCV.
    </p>

    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Random Forest */}
        <div className="rounded-xl border border-gray-200 p-5">
        <div className="mb-4">
            <h3 className="font-bold text-gray-800">
            Random Forest
            </h3>
            <p className="text-xs text-gray-500">
            Best estimator configuration
            </p>
        </div>

        <div className="space-y-3">
            {tunedModelParameters.randomForest.map((item) => (
            <div
                key={item.parameter}
                className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
            >
                <span className="text-sm text-gray-600">
                {item.parameter}
                </span>
                <code className="rounded bg-green-50 px-2 py-1 text-sm font-semibold text-green-800">
                {item.value}
                </code>
            </div>
            ))}
        </div>
        </div>

        {/* XGBoost */}
        <div className="rounded-xl border border-gray-200 p-5">
        <div className="mb-4">
            <h3 className="font-bold text-gray-800">
            XGBoost
            </h3>
            <p className="text-xs text-gray-500">
            Best estimator configuration
            </p>
        </div>

        <div className="space-y-3">
            {tunedModelParameters.xgboost.map((item) => (
            <div
                key={item.parameter}
                className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
            >
                <span className="text-sm text-gray-600">
                {item.parameter}
                </span>
                <code className="rounded bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-800">
                {item.value}
                </code>
            </div>
            ))}
        </div>
        </div>

    </div>

    <p className="mt-5 rounded-lg bg-amber-50 p-4 text-xs leading-6 text-amber-900">
        These are the best hyperparameters reported by the
        GridSearchCV experiments. They describe the tuned
        configurations and do not necessarily represent the
        configuration of the currently deployed model.
    </p>
    </section>



      {/* Research Interpretation */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">
          Research Interpretation
        </h2>

        <p className="mt-3 text-sm leading-7 text-blue-900">
          Among the five evaluated machine learning algorithms,
          Random Forest achieved the highest classification accuracy
          of 99.55%, with a precision of 99.57%, recall of 99.55%
          and F1-score of 99.55%. Therefore, Random Forest was selected
          as the best-performing model for the current crop
          recommendation system.
        </p>
      </section>
    </div>
  );
}
