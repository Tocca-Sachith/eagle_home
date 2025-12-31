'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  projectType: string;
  status: string;
  budgetTotal: number | null;
  actualCost: number | null;
  startDate: string | null;
  endDatePlanned: string | null;
  progressPercent: number;
  currentPhase: string | null;
  thumbnailImage: string | null;
};

export default function InvestorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'INVESTOR') {
        router.push('/admin');
      } else {
        fetchProjects();
      }
    }
  }, [status, session, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/investor/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-navy to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Investor Portal</h1>
              <p className="text-sm text-gray-300">Welcome, {session?.user?.name}</p>
            </div>
            <Link href="/" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
              Back to Website
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Your Investment Projects</h2>
          <p className="text-gray-600">View and track the progress of your investment projects.</p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-brand-navy mb-2">No Projects Assigned</h3>
            <p className="text-gray-600">You don't have any projects assigned yet. Please contact the administrator.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/investor/projects/${project.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {project.thumbnailImage && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={project.thumbnailImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-navy mb-2">{project.title}</h3>
                  {project.location && (
                    <p className="text-sm text-gray-600 mb-3">📍 {project.location}</p>
                  )}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-brand-navy">{project.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brand-gold h-2 rounded-full transition-all"
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'ON_HOLD' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    {project.currentPhase && (
                      <span className="text-xs text-gray-600">{project.currentPhase}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
