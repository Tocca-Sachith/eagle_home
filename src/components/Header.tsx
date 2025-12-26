'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('common.home') },
    { href: '/services', label: t('common.services') },
    { href: '/projects', label: t('common.projects') },
    { href: '/process', label: t('common.process') },
    { href: '/contact', label: t('common.contact') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold text-brand-navy">
            {t('header.companyName')}
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors hover:text-brand-gold ${
                  pathname === link.href ? 'text-brand-gold' : 'text-brand-gray'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="flex items-center gap-2 ml-4 border-l border-gray-300 pl-4">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-brand-gold text-brand-navy'
                    : 'text-brand-gray hover:bg-gray-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'si'
                    ? 'bg-brand-gold text-brand-navy'
                    : 'text-brand-gray hover:bg-gray-100'
                }`}
              >
                සිං
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-brand-navy">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
