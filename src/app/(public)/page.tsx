'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface HeroImage {
  id: string
  title: string
  imagePath: string
  altText: string | null
  width: number
  height: number
  displayOrder: number
}

export default function HomePage() {
  const { t } = useLanguage();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroImages();

    // Auto-refresh hero images every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchHeroImages();
    }, 30000);

    // Refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchHeroImages();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % heroImages.length
        );
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [heroImages]);

  const fetchHeroImages = async () => {
    try {
      const res = await fetch('/api/hero-images', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await res.json();
      if (data.heroImages && data.heroImages.length > 0) {
        setHeroImages(data.heroImages);
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <section className="relative bg-gradient-to-r from-brand-navy to-brand-gray text-white overflow-hidden">
        {/* Hero Image Background */}
        {!loading && heroImages.length > 0 && (
          <div className="absolute inset-0 z-0">
            {heroImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={image.imagePath}
                  alt={image.altText || image.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Overlay - Lighter overlay to show more of the image */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/40 to-brand-gray/40" />
              </div>
            ))}
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 py-24">
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

        {/* Image Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-brand-gold w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
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
