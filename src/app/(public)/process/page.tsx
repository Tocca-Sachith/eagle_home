export default function ProcessPage() {
  const steps = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'We begin with a comprehensive discussion of your vision, needs, and budget. Whether in person or via video call for overseas clients, we ensure we understand every detail.',
      duration: '1-2 weeks',
      activities: [
        'Discuss your requirements and preferences',
        'Review budget and financing options',
        'Site visit or virtual property assessment',
        'Preliminary timeline establishment',
      ],
    },
    {
      number: '02',
      title: 'Design & Planning',
      description: 'Our architects and designers create detailed plans tailored to your specifications. We handle all permit applications and approvals.',
      duration: '4-8 weeks',
      activities: [
        'Architectural design and 3D visualization',
        'Engineering and structural planning',
        'Material selection and specifications',
        'Permit applications and approvals',
      ],
    },
    {
      number: '03',
      title: 'Contract & Financing',
      description: 'Clear, transparent contracts are prepared. We assist with financing arrangements and payment plan setup.',
      duration: '1-2 weeks',
      activities: [
        'Detailed cost breakdown and contract',
        'Financing support and bank introductions',
        'Payment schedule establishment',
        'Insurance and warranty arrangements',
      ],
    },
    {
      number: '04',
      title: 'Construction Phase',
      description: 'Your project comes to life. Regular updates keep you informed of progress, with weekly video calls for overseas clients.',
      duration: '3-12 months',
      activities: [
        'Site preparation and foundation work',
        'Structural construction',
        'Regular progress updates (photos/videos)',
        'Quality inspections at each milestone',
      ],
    },
    {
      number: '05',
      title: 'Finishing & Details',
      description: 'Interior finishing, fixtures, and all the details that make your house a home.',
      duration: '4-8 weeks',
      activities: [
        'Interior finishing and painting',
        'Fixture and appliance installation',
        'Flooring and final touches',
        'Landscaping and exterior completion',
      ],
    },
    {
      number: '06',
      title: 'Handover & Support',
      description: 'Final inspection, documentation, and keys to your new home. We provide ongoing support even after completion.',
      duration: '1-2 weeks',
      activities: [
        'Final walkthrough and inspection',
        'Documentation and warranty handover',
        'Training on home systems and features',
        'Post-completion support and service',
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Process</h1>
            <p className="text-xl text-gray-200">
              A clear, transparent journey from concept to completion. Every step managed with professional care.
            </p>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-12 top-24 w-0.5 h-full bg-brand-gold -z-10" />
                  )}
                  
                  <div className="flex gap-8">
                    {/* Step number */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-brand-navy">
                          {step.number}
                        </span>
                      </div>
                    </div>
                    
                    {/* Step content */}
                    <div className="flex-grow pb-8">
                      <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-brand-navy">
                            {step.title}
                          </h3>
                          <span className="text-sm font-semibold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-brand-gray mb-6">
                          {step.description}
                        </p>
                        <div className="space-y-2">
                          {step.activities.map((activity, aIndex) => (
                            <div key={aIndex} className="flex items-start gap-3">
                              <svg
                                className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-brand-gray">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overseas Clients Communication */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-brand-navy mb-8 text-center">
              Communication for Overseas Clients
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  Weekly Video Updates
                </h3>
                <p className="text-brand-gray">
                  Scheduled video calls showing construction progress, addressing questions, and making decisions together.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  Daily Photo Reports
                </h3>
                <p className="text-brand-gray">
                  Receive daily photo documentation of work progress through our secure client portal.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  24/7 WhatsApp Support
                </h3>
                <p className="text-brand-gray">
                  Direct messaging access to your project manager for quick questions and updates.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">
                  Digital Documentation
                </h3>
                <p className="text-brand-gray">
                  All contracts, plans, and approvals handled digitally with secure e-signatures.
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
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-brand-gray mb-8 max-w-2xl mx-auto">
            Let's start with a conversation about your vision. Schedule your initial consultation today.
          </p>
          <a
            href="/contact"
            className="inline-block bg-brand-gold text-brand-navy px-10 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-lg"
          >
            Schedule Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
