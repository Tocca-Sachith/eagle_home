'use client';

import { useState, FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  
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
          message: t('contact.form.successMessage'),
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
          message: data.error || t('contact.form.errorMessage'),
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: t('contact.form.errorMessage'),
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
            <h1 className="text-5xl font-bold mb-6">{t('contact.hero.title')}</h1>
            <p className="text-xl text-gray-200">
              {t('contact.hero.subtitle')}
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
                  {t('contact.form.fullName')} <span className="text-red-500">{t('contact.form.required')}</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder={t('contact.form.fullNamePlaceholder')}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
                  {t('contact.form.email')} <span className="text-red-500">{t('contact.form.required')}</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>

              {/* Country & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-brand-navy mb-2">
                    {t('contact.form.country')}
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder={t('contact.form.countryPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label htmlFor="serviceType" className="block text-sm font-semibold text-brand-navy mb-2">
                  {t('contact.form.serviceType')} <span className="text-red-500">{t('contact.form.required')}</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <option value="">{t('contact.form.selectService')}</option>
                  <option value="build-on-land">{t('contact.serviceTypes.buildOnLand')}</option>
                  <option value="land-purchase-build">{t('contact.serviceTypes.landPurchaseBuild')}</option>
                  <option value="renovation">{t('contact.serviceTypes.renovation')}</option>
                  <option value="design-planning">{t('contact.serviceTypes.designPlanning')}</option>
                  <option value="turnkey">{t('contact.serviceTypes.turnkey')}</option>
                  <option value="consultation">{t('contact.serviceTypes.consultation')}</option>
                </select>
              </div>

              {/* Has Land */}
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">
                  {t('contact.form.hasLand')}
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
                    <span className="text-brand-gray">{t('contact.form.yes')}</span>
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
                    <span className="text-brand-gray">{t('contact.form.no')}</span>
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
                    <span className="text-brand-gray">{t('contact.form.looking')}</span>
                  </label>
                </div>
              </div>

              {/* Desired Location */}
              <div>
                <label htmlFor="desiredLocation" className="block text-sm font-semibold text-brand-navy mb-2">
                  {t('contact.form.desiredLocation')}
                </label>
                <input
                  type="text"
                  id="desiredLocation"
                  name="desiredLocation"
                  value={formData.desiredLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder={t('contact.form.locationPlaceholder')}
                />
              </div>

              {/* Budget Range */}
              <div>
                <label htmlFor="budgetRange" className="block text-sm font-semibold text-brand-navy mb-2">
                  {t('contact.form.budgetRange')}
                </label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <option value="">{t('contact.form.selectBudget')}</option>
                  <option value="under-200k">{t('contact.budgetRanges.under200k')}</option>
                  <option value="200k-400k">{t('contact.budgetRanges.200k400k')}</option>
                  <option value="400k-600k">{t('contact.budgetRanges.400k600k')}</option>
                  <option value="600k-1m">{t('contact.budgetRanges.600k1m')}</option>
                  <option value="over-1m">{t('contact.budgetRanges.over1m')}</option>
                  <option value="flexible">{t('contact.budgetRanges.flexible')}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-brand-navy mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder={t('contact.form.messagePlaceholder')}
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
                  {status.message || t('common.loading')}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full bg-brand-gold text-brand-navy px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.type === 'loading' ? t('contact.form.submitting') : t('contact.form.submitButton')}
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
              {t('contact.otherWays.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="font-semibold text-brand-navy mb-2">{t('footer.email')}</h3>
                <p className="text-brand-gray">info@eaglehome.com</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="font-semibold text-brand-navy mb-2">{t('footer.phone')}</h3>
                <p className="text-brand-gray">+1 (555) 123-4567</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-semibold text-brand-navy mb-2">WhatsApp</h3>
                <p className="text-brand-gray">{t('contact.otherWays.available')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
