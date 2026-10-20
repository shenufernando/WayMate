export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Attractions', count: '48', icon: '🏞️', color: 'bg-blue-500' },
    { title: 'Registered Drivers', count: '24', icon: '🚘', color: 'bg-emerald-500' },
    { title: 'Active Tour Packages', count: '12', icon: '🌴', color: 'bg-amber-500' },
    { title: 'Total Bookings', count: '156', icon: '📑', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">Welcome back! Here is what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.count}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white text-xl flex items-center justify-center shadow-md`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase font-semibold">
                <th className="pb-3">User</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              <tr>
                <td className="py-3">John Doe</td>
                <td className="py-3">Private Driver (Colombo - Kandy)</td>
                <td className="py-3">Oct 12, 2026</td>
                <td className="py-3">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    Confirmed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3">Sarah Smith</td>
                <td className="py-3">Cultural Triangle Tour Package</td>
                <td className="py-3">Oct 15, 2026</td>
                <td className="py-3">
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}