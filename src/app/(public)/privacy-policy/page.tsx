'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            {t('privacyPolicy.title')}
          </h1>
          <p className="text-center text-gray-300 mt-4">
            {t('privacyPolicy.lastUpdated')}: December 28, 2024
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('privacyPolicy.introduction.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('privacyPolicy.introduction.content')}
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('privacyPolicy.informationCollect.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed mb-4">
                {t('privacyPolicy.informationCollect.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-brand-gray">
                <li>{t('privacyPolicy.informationCollect.item1')}</li>
                <li>{t('privacyPolicy.informationCollect.item2')}</li>
                <li>{t('privacyPolicy.informationCollect.item3')}</li>
                <li>{t('privacyPolicy.informationCollect.item4')}</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('privacyPolicy.howWeUse.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-brand-gray">
                <li>{t('privacyPolicy.howWeUse.item1')}</li>
                <li>{t('privacyPolicy.howWeUse.item2')}</li>
                <li>{t('privacyPolicy.howWeUse.item3')}</li>
                <li>{t('privacyPolicy.howWeUse.item4')}</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('privacyPolicy.informationSharing.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('privacyPolicy.informationSharing.content')}
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('privacyPolicy.dataSecurity.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('privacyPolicy.dataSecurity.content')}
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('privacyPolicy.yourRights.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-brand-gray">
                <li>{t('privacyPolicy.yourRights.item1')}</li>
                <li>{t('privacyPolicy.yourRights.item2')}</li>
                <li>{t('privacyPolicy.yourRights.item3')}</li>
                <li>{t('privacyPolicy.yourRights.item4')}</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                {t('privacyPolicy.contact.title')}
              </h2>
              <p className="text-brand-gray leading-relaxed">
                {t('privacyPolicy.contact.content')}
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-brand-navy font-semibold">Eagle Home & Construction</p>
                <p className="text-brand-gray">Email: privacy@eaglehome.com</p>
                <p className="text-brand-gray">Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
