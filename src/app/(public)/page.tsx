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

  // Fetch services from database
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    fetchServices();

    // Auto-refresh services every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchServices();
    }, 30000);

    // Refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchServices();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await res.json();
      if (data.services && data.services.length > 0) {
        setServices(data.services.slice(0, 6)); // Show max 6 services on homepage
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

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

          {servicesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  {service.imagePath ? (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={service.imagePath}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-4xl mb-4">{service.icon || '📋'}</div>
                  )}
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">
                    {service.title}
                  </h3>
                  <p className="text-brand-gray line-clamp-3">{service.description}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-brand-gold/20 text-brand-navy text-xs font-medium rounded-full">
                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block bg-brand-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              View All
            </Link>
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
      <section className="relative bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-navy py-20 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-navy rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-brand-navy rounded-full mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('home.cta.title')}</h2>
            <p className="text-xl mb-10 text-gray-800 leading-relaxed">
              {t('home.cta.subtitle')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
            >
              <span>{t('home.cta.button')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
