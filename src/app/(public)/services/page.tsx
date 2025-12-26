import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: 'Build on Your Land',
      description: 'Already own a perfect plot? We specialize in building custom homes on client-owned land. Our team handles all aspects from design to completion, ensuring your property is transformed into the home of your dreams.',
      features: [
        'Custom home design',
        'Site assessment and preparation',
        'Full construction management',
        'Quality materials and craftsmanship',
      ],
      icon: '🏗️',
    },
    {
      title: 'Land Purchase + Build Package',
      description: 'Don\'t have land yet? No problem. We assist in finding and acquiring the ideal property for your needs, followed by complete construction services. One team, one vision, seamless execution.',
      features: [
        'Land sourcing and evaluation',
        'Due diligence and legal support',
        'Integrated design and build',
        'Single point of contact',
      ],
      icon: '🏞️',
    },
    {
      title: 'Renovation & Remodeling',
      description: 'Transform your existing space with our comprehensive renovation services. From minor updates to complete overhauls, we breathe new life into your property while respecting its character.',
      features: [
        'Kitchen and bathroom remodels',
        'Home additions and extensions',
        'Interior redesign',
        'Structural improvements',
      ],
      icon: '🔨',
    },
    {
      title: 'Design & Planning Services',
      description: 'Professional architectural design and planning services to create approval-ready plans. Our experienced designers work closely with you to create functional, beautiful spaces that meet all regulatory requirements.',
      features: [
        'Architectural design',
        'Engineering plans',
        'Permit acquisition support',
        '3D visualization',
      ],
      icon: '📐',
    },
    {
      title: 'Turnkey Delivery',
      description: 'Move into a completely finished home with our turnkey delivery service. Every detail is handled - from foundation to furnishing - so you can simply unlock the door and start living.',
      features: [
        'Complete construction',
        'Interior finishing',
        'Landscaping',
        'Ready-to-move-in condition',
      ],
      icon: '🔑',
    },
    {
      title: 'Financing & Payment Support',
      description: 'We understand that building a home is a significant investment. Our financing support includes flexible monthly payment plans and introductions to trusted banking partners to make your dream achievable.',
      features: [
        'Flexible payment plans',
        'Bank introductions',
        'Loan application support',
        'Budget planning assistance',
      ],
      icon: '💰',
    },
  ];

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
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="lg:w-1/3">
                  <div className="text-8xl text-center lg:text-left">{service.icon}</div>
                </div>
                <div className="lg:w-2/3">
                  <h2 className="text-3xl font-bold text-brand-navy mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-brand-gray mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-brand-gold flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-brand-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
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
            Let's Discuss Your Project
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
  );
}
