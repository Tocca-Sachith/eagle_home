'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/inquiries', label: 'Inquiries', icon: '📬' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/projects', label: 'Projects', icon: '🏗️' },
    { href: '/admin/finance', label: 'Finance', icon: '💰' },
    { href: '/admin/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-brand-navy text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold">
                Eagle Admin
              </Link>
              <Link href="/" className="text-sm text-gray-300 hover:text-white">
                ← Back to Website
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Auth Notice */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <p className="font-semibold">
              Note: Authentication will be added in a future update. This admin area is currently unprotected.
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        pathname === item.href
                          ? 'bg-brand-gold text-brand-navy font-semibold'
                          : 'text-brand-gray hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
