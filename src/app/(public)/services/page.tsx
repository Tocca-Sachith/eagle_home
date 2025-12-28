'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Service {
  id: string
  title: string
  description: string
  category: string
  icon: string | null
  imagePath: string | null
  displayOrder: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()

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
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await res.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-200">
              Comprehensive construction solutions designed to meet every need, from initial planning to final delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`flex flex-col lg:flex-row gap-8 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="lg:w-1/3">
                    {service.imagePath ? (
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={service.imagePath}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-8xl text-center lg:text-left">
                        {service.icon || '📋'}
                      </div>
                    )}
                  </div>
                  <div className="lg:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                      {service.icon && !service.imagePath && (
                        <div className="text-4xl">{service.icon}</div>
                      )}
                      <h2 className="text-3xl font-bold text-brand-navy">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-lg text-brand-gray mb-6 whitespace-pre-wrap">
                      {service.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-brand-gold/20 text-brand-navy text-sm font-medium rounded-full">
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* International Clients Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-brand-navy mb-8 text-center">
              Full Support for Overseas Clients
            </h2>
            <p className="text-lg text-brand-gray mb-8 text-center">
              Distance is no barrier to building your dream home. We provide comprehensive remote support for international clients.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  Regular Updates
                </h3>
                <p className="text-brand-gray">
                  Scheduled phone and video calls to keep you informed of progress at every stage.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  Digital Documentation
                </h3>
                <p className="text-brand-gray">
                  All plans, contracts, and approvals handled digitally for your convenience.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  On-Site Representation
                </h3>
                <p className="text-brand-gray">
                  Our team acts as your eyes and ears, managing all on-site decisions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  Time Zone Flexibility
                </h3>
                <p className="text-brand-gray">
                  We accommodate your schedule with flexible communication times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-brand-navy mb-6">
            Let&apos;s Discuss Your Project
          </h2>
          <p className="text-xl text-brand-gray mb-8 max-w-2xl mx-auto">
            Every project is unique. Contact us to discuss how our services can be tailored to your specific needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-gold text-brand-navy px-10 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
