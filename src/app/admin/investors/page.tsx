'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Investor {
  id: string
  investorNumber: string
  fullName: string
  email: string | null
  phone: string | null
  country: string | null
  address: string | null
  profileImage: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminInvestorsPage() {
  const { t } = useLanguage()
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    notes: '',
    isActive: true,
  })
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchInvestors()
  }, [])

  const fetchInvestors = async () => {
    try {
      const res = await fetch('/api/investors')
      const data = await res.json()
      setInvestors(data.investors || [])
    } catch (error) {
      console.error('Error fetching investors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingInvestor(null)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      address: '',
      notes: '',
      isActive: true,
    })
    setProfileImageFile(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEdit = (investor: Investor) => {
    setEditingInvestor(investor)
    setFormData({
      fullName: investor.fullName,
      email: investor.email || '',
      phone: investor.phone || '',
      country: investor.country || '',
      address: investor.address || '',
      notes: investor.notes || '',
      isActive: investor.isActive,
    })
    setProfileImageFile(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.investors.confirmDelete'))) return

    try {
      const res = await fetch(`/api/investors/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert(t('admin.investors.deleteSuccess'))
        fetchInvestors()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete investor')
      }
    } catch (error) {
      console.error('Error deleting investor:', error)
      alert('Failed to delete investor')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('fullName', formData.fullName)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('country', formData.country)
      data.append('address', formData.address)
      data.append('notes', formData.notes)
      data.append('isActive', formData.isActive.toString())
      if (profileImageFile) data.append('profileImage', profileImageFile)

      const url = editingInvestor
        ? `/api/investors/${editingInvestor.id}`
        : '/api/investors'
      const method = editingInvestor ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: data,
      })

      if (res.ok) {
        alert(
          editingInvestor
            ? t('admin.investors.updateSuccess')
            : t('admin.investors.createSuccess')
        )
        setShowForm(false)
        fetchInvestors()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save investor')
      }
    } catch (error) {
      console.error('Error saving investor:', error)
      alert('Failed to save investor')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-brand-gray">
          {t('admin.investors.loading')}
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center text-brand-navy hover:text-brand-gold transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('admin.investors.title')}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">
            {editingInvestor
              ? t('admin.investors.editInvestor')
              : t('admin.investors.addNew')}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                {t('admin.investors.profileImage')}
              </h2>
              {editingInvestor?.profileImage && !profileImageFile && (
                <div className="mb-3">
                  <img
                    src={editingInvestor.profileImage}
                    alt={editingInvestor.fullName}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">現在の画像</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-opacity-90"
              />
            </div>

            {/* Basic Information */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                {t('admin.investors.basicInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.investors.form.fullName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder={t('admin.investors.form.fullNamePlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.investors.form.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t('admin.investors.form.emailPlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.investors.form.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={t('admin.investors.form.phonePlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.investors.form.country')}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder={t('admin.investors.form.countryPlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.investors.form.address')}
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder={t('admin.investors.form.addressPlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.investors.form.notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder={t('admin.investors.form.notesPlaceholder')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-brand-gold focus:ring-brand-gold border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-brand-navy">
                      {t('admin.investors.form.isActive')}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none px-8 py-3 bg-brand-navy text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 font-medium transition-colors"
              >
                {submitting
                  ? editingInvestor
                    ? t('admin.investors.form.updating')
                    : t('admin.investors.form.creating')
                  : t('admin.investors.form.save')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="flex-1 sm:flex-none px-8 py-3 bg-gray-200 text-brand-navy rounded-md hover:bg-gray-300 font-medium transition-colors"
              >
                {t('admin.investors.form.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">
          {t('admin.investors.title')}
        </h1>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('admin.investors.addNew')}
        </button>
      </div>

      {investors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">
              {t('admin.investors.noInvestors')}
            </h2>
            <p className="text-brand-gray max-w-md mx-auto mb-6">
              {t('admin.investors.noInvestorsDesc')}
            </p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              {t('admin.investors.addNew')}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[20%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.investors.table.investor')}
                    </th>
                    <th className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.investors.table.email')}
                    </th>
                    <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.investors.table.phone')}
                    </th>
                    <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.investors.table.country')}
                    </th>
                    <th className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.investors.table.address')}
                    </th>
                    <th className="w-[8%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.investors.table.status')}
                    </th>
                    <th className="w-[18%] px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.investors.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investors.map((investor) => (
                    <tr key={investor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {investor.profileImage ? (
                            <img
                              src={investor.profileImage}
                              alt={investor.fullName}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-brand-navy truncate" title={investor.fullName}>
                              {investor.fullName}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {investor.investorNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-brand-gray truncate" title={investor.email || '-'}>
                          {investor.email || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-brand-gray truncate">
                          {investor.phone || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-brand-gray truncate">
                          {investor.country || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-brand-gray truncate" title={investor.address || '-'}>
                          {investor.address || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {investor.isActive ? (
                          <span className="inline-flex items-center text-xs text-green-600 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(investor)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-brand-navy bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                            title={t('admin.investors.table.edit')}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {t('admin.investors.table.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(investor.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                            title={t('admin.investors.table.delete')}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t('admin.investors.table.delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {investors.map((investor) => (
              <div key={investor.id} className="bg-white rounded-lg shadow-md p-4">
                {/* Investor Header */}
                <div className="flex gap-3 mb-3">
                  {investor.profileImage ? (
                    <img
                      src={investor.profileImage}
                      alt={investor.fullName}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-navy mb-1 truncate">
                      {investor.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {investor.investorNumber}
                    </p>
                    <div>
                      {investor.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          ✓ {t('admin.investors.table.active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {t('admin.investors.table.inactive')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Investor Details */}
                <div className="space-y-2 text-sm mb-3 pb-3 border-b">
                  {investor.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.investors.table.email')}:</span>
                      <span className="font-medium text-brand-navy truncate ml-2">{investor.email}</span>
                    </div>
                  )}
                  {investor.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.investors.table.phone')}:</span>
                      <span className="font-medium">{investor.phone}</span>
                    </div>
                  )}
                  {investor.country && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.investors.table.country')}:</span>
                      <span className="font-medium">{investor.country}</span>
                    </div>
                  )}
                  {investor.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.investors.table.address')}:</span>
                      <span className="font-medium truncate ml-2">{investor.address}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(investor)}
                    className="flex-1 px-4 py-2 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium"
                  >
                    {t('admin.investors.table.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(investor.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    {t('admin.investors.table.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
