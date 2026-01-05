'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type ProjectImage = {
  id: string;
  imagePath: string;
  caption: string | null;
  phase: string | null;
  displayOrder: number;
  uploadedAt: string;
};

type ProjectDetail = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  projectType: string;
  status: string;
  thumbnailImage: string | null;
  isPublished: boolean;
  progressPercent: number;
  currentPhase: string | null;
  contractDate: string | null;
  startDate: string | null;
  endDatePlanned: string | null;
  actualEndDate: string | null;
  images: ProjectImage[];
};

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString();
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useLanguage();
  const { id } = React.use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/projects/${id}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        const data = await res.json();

        if (!res.ok) {
          setProject(null);
          setError(data?.error || 'Failed to fetch project');
          return;
        }

        const p = data?.project as ProjectDetail | undefined;
        if (!p || !p.id) {
          setProject(null);
          setError('Project not found');
          return;
        }

        // Public site: hide unpublished projects
        if (!p.isPublished) {
          setProject(null);
          setError('Project not found');
          return;
        }

        setProject(p);
      } catch (e) {
        console.error('Error fetching project:', e);
        setProject(null);
        setError('Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const heroImage = useMemo(() => {
    if (!project) return null;
    return project.thumbnailImage || project.images?.[0]?.imagePath || null;
  }, [project]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-brand-gray">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-brand-navy mb-3">Project not found</h1>
          <p className="text-brand-gray mb-6">{error || 'Project not found'}</p>
          <Link
            href="/projects"
            className="inline-block bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const contractDate = formatDate(project.contractDate);
  const startDate = formatDate(project.startDate);
  const endPlanned = formatDate(project.endDatePlanned);
  const endActual = formatDate(project.actualEndDate);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-navy text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <div className="text-sm text-gray-200 mb-2">
                <Link href="/projects" className="hover:text-brand-gold transition-colors">
                  {t('common.projects')}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-300 truncate">{project.title}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{project.title}</h1>
              <div className="flex flex-wrap gap-3 items-center text-gray-200">
                <span className="inline-flex items-center gap-2">
                  <span className="text-brand-gold font-semibold">{project.projectType}</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold">{project.status}</span>
                {project.location ? (
                  <>
                    <span className="text-gray-400">•</span>
                    <span>{project.location}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <div className="bg-white/10 rounded-lg px-5 py-4">
                <div className="text-sm text-gray-200 mb-1">Progress</div>
                <div className="flex items-center gap-3">
                  <div className="w-40 bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-brand-gold"
                      style={{ width: `${Math.min(100, Math.max(0, project.progressPercent))}%` }}
                    />
                  </div>
                  <div className="font-semibold">{project.progressPercent}%</div>
                </div>
                {project.currentPhase && (
                  <div className="text-sm text-gray-200 mt-2">{project.currentPhase}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left: Images */}
            <div className="lg:col-span-8">
              {heroImage ? (
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <Image src={heroImage} alt={project.title} fill className="object-cover" priority />
                </div>
              ) : (
                <div className="w-full aspect-[16/9] rounded-xl border border-gray-200 bg-gradient-to-br from-brand-navy to-brand-gray flex items-center justify-center text-white">
                  <span className="text-6xl">🏠</span>
                </div>
              )}

              {project.images?.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">Photos</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.images.map((img) => (
                      <div
                        key={img.id}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                      >
                        <div className="relative w-full aspect-[4/3] bg-gray-50">
                          <Image
                            src={img.imagePath}
                            alt={img.caption || project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {(img.caption || img.phase) && (
                          <div className="p-3">
                            {img.phase && (
                              <div className="text-xs font-semibold text-brand-gold mb-1">
                                {img.phase}
                              </div>
                            )}
                            {img.caption && (
                              <div className="text-sm text-brand-gray line-clamp-2">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-brand-navy mb-4">Details</h2>

                {project.description && (
                  <p className="text-brand-gray leading-relaxed mb-6">{project.description}</p>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-brand-gray">Status</span>
                    <span className="font-semibold text-brand-navy">{project.status}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-brand-gray">Type</span>
                    <span className="font-semibold text-brand-navy">{project.projectType}</span>
                  </div>
                  {project.location && (
                    <div className="flex justify-between gap-4">
                      <span className="text-brand-gray">Location</span>
                      <span className="font-semibold text-brand-navy">{project.location}</span>
                    </div>
                  )}
                  {contractDate && (
                    <div className="flex justify-between gap-4">
                      <span className="text-brand-gray">Contract</span>
                      <span className="font-semibold text-brand-navy">{contractDate}</span>
                    </div>
                  )}
                  {startDate && (
                    <div className="flex justify-between gap-4">
                      <span className="text-brand-gray">Start</span>
                      <span className="font-semibold text-brand-navy">{startDate}</span>
                    </div>
                  )}
                  {endPlanned && (
                    <div className="flex justify-between gap-4">
                      <span className="text-brand-gray">Planned End</span>
                      <span className="font-semibold text-brand-navy">{endPlanned}</span>
                    </div>
                  )}
                  {endActual && (
                    <div className="flex justify-between gap-4">
                      <span className="text-brand-gray">Actual End</span>
                      <span className="font-semibold text-brand-navy">{endActual}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="w-full inline-flex justify-center bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    {t('common.contact')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

