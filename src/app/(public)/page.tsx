import Link from 'next/link';

export default function HomePage() {
  const services = [
    {
      title: 'Build on Your Land',
      description: 'We bring your vision to life on your property with expert craftsmanship.',
      icon: '🏗️',
    },
    {
      title: 'Land Purchase + Build',
      description: 'Complete package: we help you find the perfect land and build your dream home.',
      icon: '🏞️',
    },
    {
      title: 'Renovation & Remodeling',
      description: 'Transform your existing space with our comprehensive renovation services.',
      icon: '🔨',
    },
    {
      title: 'Design & Planning',
      description: 'Full architectural design and planning services for approval-ready plans.',
      icon: '📐',
    },
    {
      title: 'Turnkey Delivery',
      description: 'Move-in ready homes with every detail completed to perfection.',
      icon: '🔑',
    },
    {
      title: 'Financing Support',
      description: 'Monthly payment plans and bank introduction for easy financing.',
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
              Building Your Dreams Into Reality
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Professional construction services with full support for overseas clients. From land acquisition to turnkey delivery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-brand-gold text-brand-navy px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/services"
                className="bg-white text-brand-navy px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brand-navy mb-4">Our Services</h2>
            <p className="text-xl text-brand-gray max-w-2xl mx-auto">
              Comprehensive construction solutions tailored to your needs
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
                  {service.title}
                </h3>
                <p className="text-brand-gray">{service.description}</p>
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
              Why Choose Eagle Home & Construction
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
                    Full Remote Support for Overseas Clients
                  </h3>
                  <p className="text-brand-gray">
                    Stay connected with regular phone and video updates. We handle everything so you can build from anywhere in the world.
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
                    Flexible Payment Options
                  </h3>
                  <p className="text-brand-gray">
                    Monthly payment plans and bank introduction services to make your dream home affordable.
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
                    End-to-End Service
                  </h3>
                  <p className="text-brand-gray">
                    From initial design and permits to final turnkey delivery, we manage every aspect of your project.
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
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Contact us today for a free consultation. Let's discuss how we can bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-gold text-brand-navy px-10 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-lg"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
}
