'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Inquiries', value: '0', icon: '📬', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', trend: '+0%' },
    { label: 'Active Projects', value: '0', icon: '🏗️', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', trend: '+0%' },
    { label: 'Total Customers', value: '0', icon: '👥', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', trend: '+0%' },
    { label: 'Revenue (YTD)', value: '$0', icon: '💰', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', trend: '+0%' },
  ];

  const quickActions = [
    { 
      href: '/admin/inquiries', 
      label: 'View Inquiries', 
      description: 'Check new customer inquiries',
      icon: '📬',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      href: '/admin/projects', 
      label: 'Manage Projects', 
      description: 'View and update projects',
      icon: '🏗️',
      color: 'from-green-500 to-green-600'
    },
    { 
      href: '/admin/customers', 
      label: 'Customer Database', 
      description: 'Access customer information',
      icon: '👥',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      href: '/admin/finance', 
      label: 'Financial Overview', 
      description: 'View financial reports',
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      href: '/admin/services', 
      label: 'Service Management', 
      description: 'Manage company services',
      icon: '🔧',
      color: 'from-red-500 to-red-600'
    },
    { 
      href: '/admin/reports', 
      label: 'Generate Reports', 
      description: 'Create business reports',
      icon: '📈',
      color: 'from-indigo-500 to-indigo-600'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-brand-navy mb-2">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`${stat.bgColor} w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-xl lg:text-2xl`}>
                  {stat.icon}
                </div>
                <span className="text-xs lg:text-sm text-green-600 font-semibold">{stat.trend}</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-brand-navy mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-bold text-brand-navy">Quick Actions</h2>
          <span className="text-xs lg:text-sm text-gray-500">Frequently used</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-transparent transition-all hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative p-4 lg:p-5">
                <div className="flex flex-col items-center text-center gap-2 lg:gap-3">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl lg:text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy text-sm lg:text-base mb-1">{action.label}</div>
                    <div className="text-xs text-gray-600 hidden lg:block">{action.description}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-bold text-brand-navy">Recent Activity</h2>
          <button className="text-xs lg:text-sm text-brand-gold hover:text-yellow-600 font-semibold">
            View All →
          </button>
        </div>
        <div className="text-center py-12 lg:py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm lg:text-base mb-2">No recent activity</p>
          <p className="text-gray-400 text-xs lg:text-sm">Activity will appear here as you use the system</p>
        </div>
      </div>
    </div>
  );
}
