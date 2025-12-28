'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function TermsConditionsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            {t('termsConditions.title')}
          </h1>
          <p className="text-center text-gray-300 mt-4">
            {t('termsConditions.lastUpdated')}: December 28, 2024
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Agreement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.agreement.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('termsConditions.agreement.content')}
              </p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.services.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed mb-4">
                {t('termsConditions.services.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-brand-gray">
                <li>{t('termsConditions.services.item1')}</li>
                <li>{t('termsConditions.services.item2')}</li>
                <li>{t('termsConditions.services.item3')}</li>
                <li>{t('termsConditions.services.item4')}</li>
              </ul>
            </section>

            {/* Client Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.clientResponsibilities.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-brand-gray">
                <li>{t('termsConditions.clientResponsibilities.item1')}</li>
                <li>{t('termsConditions.clientResponsibilities.item2')}</li>
                <li>{t('termsConditions.clientResponsibilities.item3')}</li>
                <li>{t('termsConditions.clientResponsibilities.item4')}</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.paymentTerms.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('termsConditions.paymentTerms.content')}
              </p>
            </section>

            {/* Project Timeline */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.projectTimeline.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('termsConditions.projectTimeline.content')}
              </p>
            </section>

            {/* Warranties */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.warranties.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('termsConditions.warranties.content')}
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.limitation.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('termsConditions.limitation.content')}
              </p>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.termination.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('termsConditions.termination.content')}
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('termsConditions.contact.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('termsConditions.contact.content')}
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-brand-navy font-semibold">Eagle Home & Construction</p>
                <p className="text-brand-gray">Email: legal@eaglehome.com</p>
                <p className="text-brand-gray">Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
