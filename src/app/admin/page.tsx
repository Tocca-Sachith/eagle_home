export default function AdminDashboard() {
  const stats = [
    { label: 'Total Inquiries', value: '0', icon: '📬', color: 'bg-blue-500' },
    { label: 'Active Projects', value: '0', icon: '🏗️', color: 'bg-green-500' },
    { label: 'Total Customers', value: '0', icon: '👥', color: 'bg-purple-500' },
    { label: 'Revenue (YTD)', value: '$0', icon: '💰', color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-navy mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-brand-navy mb-1">{stat.value}</div>
            <div className="text-sm text-brand-gray">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-brand-navy mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/admin/inquiries"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-brand-gold hover:bg-brand-gold/5 transition-colors"
          >
            <span className="text-2xl">📬</span>
            <div>
              <div className="font-semibold text-brand-navy">View Inquiries</div>
              <div className="text-sm text-brand-gray">Check new customer inquiries</div>
            </div>
          </a>
          <a
            href="/admin/projects"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-brand-gold hover:bg-brand-gold/5 transition-colors"
          >
            <span className="text-2xl">🏗️</span>
            <div>
              <div className="font-semibold text-brand-navy">Manage Projects</div>
              <div className="text-sm text-brand-gray">View and update projects</div>
            </div>
          </a>
          <a
            href="/admin/customers"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-brand-gold hover:bg-brand-gold/5 transition-colors"
          >
            <span className="text-2xl">👥</span>
            <div>
              <div className="font-semibold text-brand-navy">Customer Database</div>
              <div className="text-sm text-brand-gray">Access customer information</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-4">Recent Activity</h2>
        <p className="text-brand-gray text-center py-8">
          No recent activity to display. Activity will appear here as you use the system.
        </p>
      </div>
    </div>
  );
}
