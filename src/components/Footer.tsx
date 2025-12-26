'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-navy text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-brand-gold">{t('header.companyName')}</h3>
            <p className="text-gray-300">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-brand-gold transition-colors">{t('common.home')}</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-brand-gold transition-colors">{t('common.services')}</Link></li>
              <li><Link href="/projects" className="text-gray-300 hover:text-brand-gold transition-colors">{t('common.projects')}</Link></li>
              <li><Link href="/process" className="text-gray-300 hover:text-brand-gold transition-colors">{t('common.process')}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-brand-gold transition-colors">{t('common.contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>{t('footer.email')}: info@eaglehome.com</li>
              <li>{t('footer.phone')}: +1 (555) 123-4567</li>
              <li>{t('footer.availableFor')}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
