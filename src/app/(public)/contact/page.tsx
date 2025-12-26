'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    email: '',
    phone: '',
    serviceType: '',
    hasLand: '',
    desiredLocation: '',
    budgetRange: '',
    message: '',
  });

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: '' });

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you for your inquiry! We will contact you within 24 hours.',
        });
        setFormData({
          fullName: '',
          country: '',
          email: '',
          phone: '',
          serviceType: '',
          hasLand: '',
          desiredLocation: '',
          budgetRange: '',
          message: '',
        });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to submit inquiry. Please check your connection and try again.',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200">
              Let's discuss your project. Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-brand-navy mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder="john@example.com"
                />
              </div>

              {/* Country & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-brand-navy mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder="United States"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label htmlFor="serviceType" className="block text-sm font-semibold text-brand-navy mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <option value="">Select a service</option>
                  <option value="build-on-land">Build on Your Land</option>
                  <option value="land-purchase-build">Land Purchase + Build</option>
                  <option value="renovation">Renovation & Remodeling</option>
                  <option value="design-planning">Design & Planning</option>
                  <option value="turnkey">Turnkey Delivery</option>
                  <option value="consultation">General Consultation</option>
                </select>
              </div>

              {/* Has Land */}
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">
                  Do you already own land?
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasLand"
                      value="yes"
                      checked={formData.hasLand === 'yes'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-brand-gray">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasLand"
                      value="no"
                      checked={formData.hasLand === 'no'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-brand-gray">No</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasLand"
                      value="looking"
                      checked={formData.hasLand === 'looking'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-brand-gray">Currently Looking</span>
                  </label>
                </div>
              </div>

              {/* Desired Location */}
              <div>
                <label htmlFor="desiredLocation" className="block text-sm font-semibold text-brand-navy mb-2">
                  Desired Location/Area
                </label>
                <input
                  type="text"
                  id="desiredLocation"
                  name="desiredLocation"
                  value={formData.desiredLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder="e.g., Downtown, Suburban area, Coastal"
                />
              </div>

              {/* Budget Range */}
              <div>
                <label htmlFor="budgetRange" className="block text-sm font-semibold text-brand-navy mb-2">
                  Budget Range
                </label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <option value="">Select budget range</option>
                  <option value="under-200k">Under $200,000</option>
                  <option value="200k-400k">$200,000 - $400,000</option>
                  <option value="400k-600k">$400,000 - $600,000</option>
                  <option value="600k-1m">$600,000 - $1,000,000</option>
                  <option value="over-1m">Over $1,000,000</option>
                  <option value="flexible">Flexible / To be discussed</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-brand-navy mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder="Tell us more about your project, timeline, or any specific requirements..."
                />
              </div>

              {/* Status Messages */}
              {status.type !== 'idle' && (
                <div
                  className={`p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : status.type === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {status.message || 'Processing...'}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full bg-brand-gold text-brand-navy px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.type === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">
              Other Ways to Reach Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="font-semibold text-brand-navy mb-2">Email</h3>
                <p className="text-brand-gray">info@eaglehome.com</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="font-semibold text-brand-navy mb-2">Phone</h3>
                <p className="text-brand-gray">+1 (555) 123-4567</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-semibold text-brand-navy mb-2">WhatsApp</h3>
                <p className="text-brand-gray">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
