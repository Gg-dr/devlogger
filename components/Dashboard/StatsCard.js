export default function StatsCard({ title, value, icon, color }) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  }