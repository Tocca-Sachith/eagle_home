'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-brand-navy text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="relative w-[220px] h-[70px]">
                <Image 
                  src="/logomain.png" 
                  alt="Eagle Home & Construction" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed text-sm">
                {t('footer.description')}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('footer.companyDetails')}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t('footer.availableFor')}</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-brand-gold pb-2 inline-block">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('common.services')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('common.projects')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/process" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('common.process')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('common.contact')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-conditions" 
                  className="text-gray-300 hover:text-brand-gold transition-colors flex items-center group"
                >
                  <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                  {t('footer.termsConditions')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-brand-gold pb-2 inline-block">
              {t('footer.contactInfo')}
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-400">{t('footer.email')}</div>
                  <a href="mailto:info@eaglehome.com" className="hover:text-brand-gold transition-colors">
                    info@eaglehome.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">{t('footer.phone')}</div>
                  <a href="tel:+15551234567" className="block hover:text-brand-gold transition-colors">
                    +1 (555) 123-4567
                  </a>
                  <a href="tel:+15551234568" className="block hover:text-brand-gold transition-colors">
                    +1 (555) 123-4568
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <div className="text-xs text-gray-400 mb-2">{t('footer.followUs')}</div>
                  {/* All screen sizes: 3 icons per row, 2 rows */}
                  <div className="grid grid-cols-3 gap-2 max-w-[150px]">
                    {/* Facebook */}
                    <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-[#1877F2] rounded-full flex items-center justify-center transition-all hover:scale-110" title="Facebook">
                      <span className="sr-only">Facebook</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] rounded-full flex items-center justify-center transition-all hover:scale-110" title="Instagram">
                      <span className="sr-only">Instagram</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    {/* WhatsApp */}
                    <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-[#25D366] rounded-full flex items-center justify-center transition-all hover:scale-110" title="WhatsApp">
                      <span className="sr-only">WhatsApp</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                    {/* TikTok */}
                    <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-black rounded-full flex items-center justify-center transition-all hover:scale-110" title="TikTok">
                      <span className="sr-only">TikTok</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                    </a>
                    {/* YouTube */}
                    <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-[#FF0000] rounded-full flex items-center justify-center transition-all hover:scale-110" title="YouTube">
                      <span className="sr-only">YouTube</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    {/* Messenger */}
                    <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-[#0084FF] rounded-full flex items-center justify-center transition-all hover:scale-110" title="Messenger">
                      <span className="sr-only">Messenger</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.26 5.887-3.26-6.559 6.863z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} {t('footer.copyright')}
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Design by :{' '}
              <a 
                href="https://sakurawebsolutions.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-gold hover:text-yellow-400 transition-colors font-medium"
              >
                Sakura Web Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
