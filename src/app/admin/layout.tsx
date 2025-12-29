'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊', shortLabel: 'Home' },
    { href: '/admin/inquiries', label: 'Inquiries', icon: '📬', shortLabel: 'Inquiries' },
    { href: '/admin/hero-images', label: 'Hero Images', icon: '🖼️', shortLabel: 'Images' },
    { href: '/admin/services', label: 'Services', icon: '🔧', shortLabel: 'Services' },
    { href: '/admin/customers', label: 'Customers', icon: '👥', shortLabel: 'Customers' },
    { href: '/admin/investors', label: 'Investors', icon: '💼', shortLabel: 'Investors' },
    { href: '/admin/projects', label: 'Projects', icon: '🏗️', shortLabel: 'Projects' },
    { href: '/admin/finance', label: 'Finance', icon: '💰', shortLabel: 'Finance' },
    { href: '/admin/reports', label: 'Reports', icon: '📈', shortLabel: 'Reports' },
    { href: '/admin/users', label: 'Users', icon: '👤', shortLabel: 'Users' },
  ];

  // Get bottom nav items (most important 5)
  const bottomNavItems = [
    navItems[0], // Dashboard
    navItems[6], // Projects
    navItems[4], // Customers
    navItems[7], // Finance
    { href: '/admin/users', label: 'More', icon: '☰', shortLabel: 'More' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-brand-navy to-blue-900 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative w-[100px] h-[30px]">
              <Image 
                src="/logo.png" 
                alt="Eagle Admin" 
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
          <Link href="/" className="text-xs text-gray-300 hover:text-white">
            Public Site
          </Link>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-brand-navy to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="relative w-[140px] h-[40px]">
                <Image 
                  src="/logo.png" 
                  alt="Eagle Admin" 
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <Link href="/" className="text-sm text-gray-300 hover:text-white flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Website
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session?.user && (
                <>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                    <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy font-bold">
                      {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-14"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 w-64 bg-white z-40 transform transition-transform duration-300 shadow-xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 h-full overflow-y-auto pb-20">
          {session?.user && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy font-bold text-lg">
                  {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-brand-navy text-sm">
                    {session.user.name || 'Admin'}
                  </div>
                  <div className="text-xs text-gray-500">{session.user.email}</div>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname === item.href
                      ? 'bg-brand-gold text-brand-navy font-semibold shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
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

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg z-30">
        <nav className="p-4 h-full overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname === item.href
                      ? 'bg-brand-gold text-brand-navy font-semibold shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
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
      <main className="pt-14 lg:pt-16 lg:pl-64 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-brand-gold' : 'text-gray-600'
                }`}
              >
                <span className={`text-2xl mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
