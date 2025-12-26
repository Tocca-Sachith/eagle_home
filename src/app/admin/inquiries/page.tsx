'use client';

import { useEffect, useState } from 'react';

type Inquiry = {
  id: string;
  fullName: string;
  country: string | null;
  email: string;
  phone: string | null;
  serviceType: string;
  hasLand: boolean | null;
  desiredLocation: string | null;
  budgetRange: string | null;
  message: string | null;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inquiries');
      const data = await response.json();

      if (response.ok) {
        setInquiries(data.inquiries);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch inquiries');
      }
    } catch (err) {
      setError('Failed to fetch inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'build-on-land': 'Build on Your Land',
      'land-purchase-build': 'Land Purchase + Build',
      'renovation': 'Renovation & Remodeling',
      'design-planning': 'Design & Planning',
      'turnkey': 'Turnkey Delivery',
      'consultation': 'General Consultation',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-brand-navy mb-8">Inquiries</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-brand-gray">Loading inquiries...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-brand-navy mb-8">Inquiries</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchInquiries}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">Inquiries</h1>
        <button
          onClick={fetchInquiries}
          className="bg-brand-gold text-brand-navy px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
        >
          Refresh
        </button>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">
              No Inquiries Yet
            </h2>
            <p className="text-brand-gray">
              Customer inquiries will appear here once they submit the contact form.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-navy text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-brand-gray whitespace-nowrap">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-navy">
                      {inquiry.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-gray">
                      <a href={`mailto:${inquiry.email}`} className="hover:text-brand-gold">
                        {inquiry.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-gray">
                      {inquiry.country || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-gray">
                      {getServiceTypeLabel(inquiry.serviceType)}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-gray">
                      {inquiry.budgetRange || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="text-brand-gold hover:text-brand-navy font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-brand-navy">Inquiry Details</h2>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-brand-gray hover:text-brand-navy text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-brand-gray">Date Submitted</label>
                  <p className="text-brand-navy">{formatDate(selectedInquiry.createdAt)}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-brand-gray">Full Name</label>
                    <p className="text-brand-navy">{selectedInquiry.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-gray">Country</label>
                    <p className="text-brand-navy">{selectedInquiry.country || '—'}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-brand-gray">Email</label>
                    <p className="text-brand-navy">
                      <a href={`mailto:${selectedInquiry.email}`} className="hover:text-brand-gold">
                        {selectedInquiry.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-gray">Phone</label>
                    <p className="text-brand-navy">
                      {selectedInquiry.phone ? (
                        <a href={`tel:${selectedInquiry.phone}`} className="hover:text-brand-gold">
                          {selectedInquiry.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-gray">Service Type</label>
                  <p className="text-brand-navy">{getServiceTypeLabel(selectedInquiry.serviceType)}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-brand-gray">Has Land</label>
                    <p className="text-brand-navy">
                      {selectedInquiry.hasLand === null ? '—' : selectedInquiry.hasLand ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-gray">Budget Range</label>
                    <p className="text-brand-navy">{selectedInquiry.budgetRange || '—'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-gray">Desired Location</label>
                  <p className="text-brand-navy">{selectedInquiry.desiredLocation || '—'}</p>
                </div>

                {selectedInquiry.message && (
                  <div>
                    <label className="text-sm font-semibold text-brand-gray">Message</label>
                    <p className="text-brand-navy whitespace-pre-wrap bg-gray-50 p-4 rounded">
                      {selectedInquiry.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="flex-1 bg-brand-gold text-brand-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center"
                >
                  Send Email
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex-1 bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
