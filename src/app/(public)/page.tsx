'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  const services = [
    {
      titleKey: 'home.services.buildOnLand.title',
      descKey: 'home.services.buildOnLand.description',
      icon: '🏗️',
    },
    {
      titleKey: 'home.services.landPurchase.title',
      descKey: 'home.services.landPurchase.description',
      icon: '🏞️',
    },
    {
      titleKey: 'home.services.renovation.title',
      descKey: 'home.services.renovation.description',
      icon: '🔨',
    },
    {
      titleKey: 'home.services.design.title',
      descKey: 'home.services.design.description',
      icon: '📐',
    },
    {
      titleKey: 'home.services.turnkey.title',
      descKey: 'home.services.turnkey.description',
      icon: '🔑',
    },
    {
      titleKey: 'home.services.financing.title',
      descKey: 'home.services.financing.description',
      icon: '💰',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-navy to-brand-gray text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-brand-gold text-brand-navy px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                {t('home.hero.cta1')}
              </Link>
              <Link
                href="/services"
                className="bg-white text-brand-navy px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('home.hero.cta2')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brand-navy mb-4">{t('home.services.title')}</h2>
            <p className="text-xl text-brand-gray max-w-2xl mx-auto">
              {t('home.services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-brand-navy mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="text-brand-gray">{t(service.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-brand-navy mb-12 text-center">
              {t('home.whyChooseUs.title')}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-brand-gold rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-navy" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">
                    {t('home.whyChooseUs.remote.title')}
                  </h3>
                  <p className="text-brand-gray">
                    {t('home.whyChooseUs.remote.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-gold rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-navy" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">
                    {t('home.whyChooseUs.payment.title')}
                  </h3>
                  <p className="text-brand-gray">
                    {t('home.whyChooseUs.payment.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-gold rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-navy" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">
                    {t('home.whyChooseUs.endToEnd.title')}
                  </h3>
                  <p className="text-brand-gray">
                    {t('home.whyChooseUs.endToEnd.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-gold text-brand-navy px-10 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-lg"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
