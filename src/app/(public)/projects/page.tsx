'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type ProjectSummary = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  projectType: string;
  status: string;
  thumbnailImage: string | null;
  progressPercent: number;
  currentPhase: string | null;
};

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(
    () => [
      { value: '50+', label: t('projects.stats.completed') },
      { value: '100%', label: t('projects.stats.satisfaction') },
      { value: '15+', label: t('projects.stats.experience') },
      { value: '30%', label: t('projects.stats.overseas') },
    ],
    [t]
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?publishedOnly=true', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        const data = await res.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{t('projects.hero.title')}</h1>
            <p className="text-xl text-gray-200">
              {t('projects.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow block"
                >
                  {/* Project image */}
                  {project.thumbnailImage ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={project.thumbnailImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-brand-navy to-brand-gray h-48 flex items-center justify-center">
                      <span className="text-6xl">🏠</span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="text-sm text-brand-gold font-semibold mb-2">
                      {project.projectType}
                    </div>
                    <h3 className="text-2xl font-bold text-brand-navy mb-2">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-brand-gray mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {project.location}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-brand-gray mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-semibold text-brand-navy">
                        {project.status}
                      </div>
                      <div className="text-sm text-brand-gray">
                        {project.progressPercent}%{project.currentPhase ? ` • ${project.currentPhase}` : ''}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-5xl font-bold text-brand-gold mb-2">{s.value}</div>
                <div className="text-brand-gray">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-brand-navy mb-12 text-center">
            {t('projects.testimonials.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-brand-gold text-2xl mb-4">&quot;</div>
              <p className="text-brand-gray mb-4">
                Building from overseas seemed impossible until we found Eagle Home. Their regular video updates and professional management made the entire process smooth. Our dream home was delivered exactly as promised.
              </p>
              <div className="font-semibold text-brand-navy">- James & Sarah M.</div>
              <div className="text-sm text-brand-gray">Overseas Clients, UK</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-brand-gold text-2xl mb-4">&quot;</div>
              <p className="text-brand-gray mb-4">
                The renovation of our townhouse exceeded expectations. Eagle Home&apos;s attention to detail and respect for the original character while modernizing made all the difference. Highly recommended!
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
          <h2 className="text-4xl font-bold mb-6">{t('projects.cta.title')}</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            {t('projects.cta.subtitle')}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-gold text-brand-navy px-10 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-lg"
          >
            {t('common.getStarted')}
          </Link>
        </div>
      </section>
    </div>
  );
}
