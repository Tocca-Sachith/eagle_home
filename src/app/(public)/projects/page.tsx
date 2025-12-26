export default function ProjectsPage() {
  const projects = [
    {
      title: 'Modern Villa - Coastal Paradise',
      location: 'Seaside District',
      type: 'Land Purchase + Build',
      description: 'Luxury 4-bedroom villa with ocean views, completed for overseas client with full remote coordination.',
      status: 'Completed 2024',
    },
    {
      title: 'Urban Townhouse Renovation',
      location: 'Downtown Area',
      type: 'Renovation & Remodeling',
      description: 'Complete interior renovation of historic townhouse, preserving character while adding modern amenities.',
      status: 'Completed 2024',
    },
    {
      title: 'Family Home on Client Land',
      location: 'Suburban Community',
      type: 'Build on Your Land',
      description: 'Custom 3-bedroom family home with sustainable design features and energy-efficient systems.',
      status: 'Completed 2023',
    },
    {
      title: 'Executive Residence',
      location: 'Premium Heights',
      type: 'Turnkey Delivery',
      description: '5-bedroom executive home with home office, landscaped gardens, delivered fully furnished.',
      status: 'Completed 2023',
    },
    {
      title: 'Retirement Villa',
      location: 'Green Valley',
      type: 'Design + Build',
      description: 'Single-story accessible home designed for comfort and ease of living, built from custom plans.',
      status: 'Completed 2023',
    },
    {
      title: 'Investment Property Development',
      location: 'Business District',
      type: 'Land Purchase + Build',
      description: 'Multi-unit residential building developed as investment property for overseas investor.',
      status: 'Completed 2022',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Projects</h1>
            <p className="text-xl text-gray-200">
              A showcase of our completed works - from custom homes to complete renovations.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Placeholder for project image */}
                <div className="bg-gradient-to-br from-brand-navy to-brand-gray h-48 flex items-center justify-center">
                  <span className="text-6xl">🏠</span>
                </div>
                
                <div className="p-6">
                  <div className="text-sm text-brand-gold font-semibold mb-2">
                    {project.type}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-brand-gray mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {project.location}
                  </p>
                  <p className="text-brand-gray mb-4">
                    {project.description}
                  </p>
                  <div className="text-sm font-semibold text-brand-navy">
                    {project.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-brand-gold mb-2">50+</div>
              <div className="text-brand-gray">Projects Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand-gold mb-2">100%</div>
              <div className="text-brand-gray">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand-gold mb-2">15+</div>
              <div className="text-brand-gray">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand-gold mb-2">30%</div>
              <div className="text-brand-gray">Overseas Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-brand-navy mb-12 text-center">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-brand-gold text-2xl mb-4">"</div>
              <p className="text-brand-gray mb-4">
                Building from overseas seemed impossible until we found Eagle Home. Their regular video updates and professional management made the entire process smooth. Our dream home was delivered exactly as promised.
              </p>
              <div className="font-semibold text-brand-navy">- James & Sarah M.</div>
              <div className="text-sm text-brand-gray">Overseas Clients, UK</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-brand-gold text-2xl mb-4">"</div>
              <p className="text-brand-gray mb-4">
                The renovation of our townhouse exceeded expectations. Eagle Home's attention to detail and respect for the original character while modernizing made all the difference. Highly recommended!
              </p>
              <div className="font-semibold text-brand-navy">- Michael Chen</div>
              <div className="text-sm text-brand-gray">Renovation Client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Project Today</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join our satisfied clients and let us help you create your perfect space.
          </p>
          <a
            href="/contact"
            className="inline-block bg-brand-gold text-brand-navy px-10 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-lg"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
