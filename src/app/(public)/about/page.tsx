'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  const stats = [
    { value: '15+', label: t('about.stats.yearsExperience') },
    { value: '200+', label: t('about.stats.projectsCompleted') },
    { value: '95%', label: t('about.stats.clientSatisfaction') },
    { value: '50+', label: t('about.stats.overseasClients') },
  ]

  const values = [
    {
      icon: '🎯',
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description'),
    },
    {
      icon: '🤝',
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
    },
    {
      icon: '💡',
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
    },
    {
      icon: '🌍',
      title: t('about.values.global.title'),
      description: t('about.values.global.description'),
    },
  ]

  const team = [
    {
      name: t('about.team.ceo.name'),
      role: t('about.team.ceo.role'),
      description: t('about.team.ceo.description'),
      icon: '👔',
    },
    {
      name: t('about.team.projectManager.name'),
      role: t('about.team.projectManager.role'),
      description: t('about.team.projectManager.description'),
      icon: '🏗️',
    },
    {
      name: t('about.team.architect.name'),
      role: t('about.team.architect.role'),
      description: t('about.team.architect.description'),
      icon: '📐',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-navy to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-brand-navy mb-2">
                  {stat.value}
                </div>
                <div className="text-brand-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-8 text-center">
              {t('about.story.title')}
            </h2>
            <div className="prose prose-lg max-w-none text-brand-gray leading-relaxed">
              <p className="mb-6">{t('about.story.paragraph1')}</p>
              <p className="mb-6">{t('about.story.paragraph2')}</p>
              <p>{t('about.story.paragraph3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Mission */}
            <div className="bg-gradient-to-br from-brand-navy to-blue-900 text-white p-8 md:p-12 rounded-2xl shadow-xl">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t('about.mission.title')}
              </h3>
              <p className="text-gray-200 leading-relaxed">
                {t('about.mission.description')}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-brand-gold to-yellow-500 text-brand-navy p-8 md:p-12 rounded-2xl shadow-xl">
              <div className="text-4xl mb-6">🌟</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t('about.vision.title')}
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {t('about.vision.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-12 text-center">
            {t('about.values.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {value.title}
                </h3>
                <p className="text-brand-gray leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4 text-center">
            {t('about.team.title')}
          </h2>
          <p className="text-brand-gray text-center mb-12 max-w-2xl mx-auto">
            {t('about.team.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-brand-navy to-blue-900 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  {member.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">
                  {member.name}
                </h3>
                <div className="text-brand-gold font-semibold mb-4">
                  {member.role}
                </div>
                <p className="text-brand-gray leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-brand-navy to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t('about.whyChooseUs.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⭐
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t('about.whyChooseUs.experience.title')}
              </h3>
              <p className="text-gray-300">
                {t('about.whyChooseUs.experience.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🌍
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t('about.whyChooseUs.international.title')}
              </h3>
              <p className="text-gray-300">
                {t('about.whyChooseUs.international.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ✅
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t('about.whyChooseUs.commitment.title')}
              </h3>
              <p className="text-gray-300">
                {t('about.whyChooseUs.commitment.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-brand-gray mb-8">
              {t('about.cta.subtitle')}
            </p>
            <a
              href="/contact"
              className="inline-block bg-brand-gold text-brand-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-xl"
            >
              {t('about.cta.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
