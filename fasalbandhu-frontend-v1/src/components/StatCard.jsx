
export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "green"
}) {

  const colors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    purple: "bg-purple-100 text-purple-700"
  };

  return (
    <div className="bg-white border border-gray-100
      rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex justify-between items-start">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-3">
            {value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {Icon && <Icon size={23} />}
        </div>

      </div>

      <p className="text-xs text-gray-400 mt-4">
        {description}
      </p>

    </div>
  );
}
