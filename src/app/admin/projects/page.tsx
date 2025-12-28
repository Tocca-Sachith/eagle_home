'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Customer {
  id: string
  customerNumber: string
  fullName: string
  email: string | null
  phone: string | null
}

interface Project {
  id: string
  title: string
  description: string | null
  location: string | null
  projectType: string
  status: string
  budgetTotal: number | null
  actualCost: number | null
  contractDate: string | null
  startDate: string | null
  endDatePlanned: string | null
  actualEndDate: string | null
  customerId: string | null
  customer: Customer | null
  investorName: string | null
  investorContact: string | null
  thumbnailImage: string | null
  isPublished: boolean
  displayOrder: number
  progressPercent: number
  currentPhase: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminProjectsPage() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    projectType: 'residential',
    status: 'PLANNING',
    customerId: '',
    budgetTotal: '',
    actualCost: '',
    contractDate: '',
    startDate: '',
    endDatePlanned: '',
    actualEndDate: '',
    investorName: '',
    investorContact: '',
    currentPhase: '',
    progressPercent: '0',
    isPublished: false,
    displayOrder: '0',
    notes: '',
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProjects()
    fetchCustomers()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleAddNew = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      location: '',
      projectType: 'residential',
      status: 'PLANNING',
      customerId: '',
      budgetTotal: '',
      actualCost: '',
      contractDate: '',
      startDate: '',
      endDatePlanned: '',
      actualEndDate: '',
      investorName: '',
      investorContact: '',
      currentPhase: '',
      progressPercent: '0',
      isPublished: false,
      displayOrder: '0',
      notes: '',
    })
    setThumbnailFile(null)
    setShowForm(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      location: project.location || '',
      projectType: project.projectType,
      status: project.status,
      customerId: project.customerId || '',
      budgetTotal: project.budgetTotal?.toString() || '',
      actualCost: project.actualCost?.toString() || '',
      contractDate: project.contractDate ? project.contractDate.substring(0, 10) : '',
      startDate: project.startDate ? project.startDate.substring(0, 10) : '',
      endDatePlanned: project.endDatePlanned ? project.endDatePlanned.substring(0, 10) : '',
      actualEndDate: project.actualEndDate ? project.actualEndDate.substring(0, 10) : '',
      investorName: project.investorName || '',
      investorContact: project.investorContact || '',
      currentPhase: project.currentPhase || '',
      progressPercent: project.progressPercent.toString(),
      isPublished: project.isPublished,
      displayOrder: project.displayOrder.toString(),
      notes: project.notes || '',
    })
    setThumbnailFile(null)
    setShowForm(true)
    // スクロールをトップに
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.projects.confirmDelete'))) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert(t('admin.projects.deleteSuccess'))
        fetchProjects()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('location', formData.location)
      data.append('projectType', formData.projectType)
      data.append('status', formData.status)
      if (formData.customerId) data.append('customerId', formData.customerId)
      if (formData.budgetTotal) data.append('budgetTotal', formData.budgetTotal)
      if (formData.actualCost) data.append('actualCost', formData.actualCost)
      if (formData.contractDate) data.append('contractDate', formData.contractDate)
      if (formData.startDate) data.append('startDate', formData.startDate)
      if (formData.endDatePlanned) data.append('endDatePlanned', formData.endDatePlanned)
      if (formData.actualEndDate) data.append('actualEndDate', formData.actualEndDate)
      if (formData.investorName) data.append('investorName', formData.investorName)
      if (formData.investorContact) data.append('investorContact', formData.investorContact)
      if (formData.currentPhase) data.append('currentPhase', formData.currentPhase)
      data.append('progressPercent', formData.progressPercent)
      data.append('isPublished', formData.isPublished.toString())
      data.append('displayOrder', formData.displayOrder)
      if (formData.notes) data.append('notes', formData.notes)
      if (thumbnailFile) data.append('thumbnail', thumbnailFile)

      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: data,
      })

      if (res.ok) {
        alert(
          editingProject
            ? t('admin.projects.updateSuccess')
            : t('admin.projects.createSuccess')
        )
        setShowForm(false)
        fetchProjects()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'ON_HOLD':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PLANNING: t('admin.projects.statuses.planning'),
      IN_PROGRESS: t('admin.projects.statuses.inProgress'),
      COMPLETED: t('admin.projects.statuses.completed'),
      ON_HOLD: t('admin.projects.statuses.onHold'),
    }
    return statusMap[status] || status
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      residential: t('admin.projects.types.residential'),
      commercial: t('admin.projects.types.commercial'),
      renovation: t('admin.projects.types.renovation'),
      custom: t('admin.projects.types.custom'),
    }
    return typeMap[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-brand-gray">
          {t('admin.projects.loading')}
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center text-brand-navy hover:text-brand-gold transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('admin.projects.table.title')}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">
            {editingProject
              ? t('admin.projects.editProject')
              : t('admin.projects.addNew')}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                {t('admin.projects.basicInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.title')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder={t('admin.projects.form.titlePlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder={t('admin.projects.form.descriptionPlaceholder')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.projects.form.location')}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder={t('admin.projects.form.locationPlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.projects.form.projectType')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.projectType}
                      onChange={(e) =>
                        setFormData({ ...formData, projectType: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    >
                      <option value="residential">{t('admin.projects.types.residential')}</option>
                      <option value="commercial">{t('admin.projects.types.commercial')}</option>
                      <option value="renovation">{t('admin.projects.types.renovation')}</option>
                      <option value="custom">{t('admin.projects.types.custom')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.projects.form.status')}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    >
                      <option value="PLANNING">{t('admin.projects.statuses.planning')}</option>
                      <option value="IN_PROGRESS">{t('admin.projects.statuses.inProgress')}</option>
                      <option value="COMPLETED">{t('admin.projects.statuses.completed')}</option>
                      <option value="ON_HOLD">{t('admin.projects.statuses.onHold')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.projects.form.customer')}
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) =>
                        setFormData({ ...formData, customerId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    >
                      <option value="">{t('admin.projects.form.selectCustomer')}</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.fullName} ({customer.customerNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                {t('admin.projects.financialInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.budgetTotal')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budgetTotal}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetTotal: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.actualCost')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.actualCost}
                    onChange={(e) =>
                      setFormData({ ...formData, actualCost: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.investorName')}
                  </label>
                  <input
                    type="text"
                    value={formData.investorName}
                    onChange={(e) =>
                      setFormData({ ...formData, investorName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.investorContact')}
                  </label>
                  <input
                    type="text"
                    value={formData.investorContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investorContact: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                {t('admin.projects.scheduleInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.contractDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.contractDate}
                    onChange={(e) =>
                      setFormData({ ...formData, contractDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.startDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.endDatePlanned')}
                  </label>
                  <input
                    type="date"
                    value={formData.endDatePlanned}
                    onChange={(e) =>
                      setFormData({ ...formData, endDatePlanned: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.actualEndDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.actualEndDate}
                    onChange={(e) =>
                      setFormData({ ...formData, actualEndDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.currentPhase')}
                  </label>
                  <input
                    type="text"
                    value={formData.currentPhase}
                    onChange={(e) =>
                      setFormData({ ...formData, currentPhase: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.progressPercent')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progressPercent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          progressPercent: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                    <span className="text-brand-gray">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                {t('admin.projects.displaySettings')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.thumbnail')}
                  </label>
                  {editingProject?.thumbnailImage && !thumbnailFile && (
                    <div className="mb-3">
                      <img
                        src={editingProject.thumbnailImage}
                        alt="Current thumbnail"
                        className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">現在の画像</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files?.[0] || null)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-opacity-90"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t('admin.projects.form.displayOrder')}
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center pt-7">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPublished: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-brand-gold focus:ring-brand-gold border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-brand-navy">
                        {t('admin.projects.form.isPublished')}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
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
                  ? editingProject
                    ? t('admin.projects.form.updating')
                    : t('admin.projects.form.creating')
                  : t('admin.projects.form.save')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="flex-1 sm:flex-none px-8 py-3 bg-gray-200 text-brand-navy rounded-md hover:bg-gray-300 font-medium transition-colors"
              >
                {t('admin.projects.form.cancel')}
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
          {t('admin.projects.title')}
        </h1>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('admin.projects.addNew')}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">
              {t('admin.projects.noProjects')}
            </h2>
            <p className="text-brand-gray max-w-md mx-auto mb-6">
              {t('admin.projects.noProjectsDesc')}
            </p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              {t('admin.projects.addNew')}
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
                    <th className="w-[25%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.title')}
                    </th>
                    <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.type')}
                    </th>
                    <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.status')}
                    </th>
                    <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.customer')}
                    </th>
                    <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.progress')}
                    </th>
                    <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.budget')}
                    </th>
                    <th className="w-[8%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.published')}
                    </th>
                    <th className="w-[13%] px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.projects.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {project.thumbnailImage && (
                            <img
                              src={project.thumbnailImage}
                              alt={project.title}
                              className="w-10 h-10 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-brand-navy truncate" title={project.title}>
                              {project.title}
                            </div>
                            {project.location && (
                              <div className="text-xs text-gray-500 truncate" title={project.location}>
                                📍 {project.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-brand-gray truncate">
                          {getTypeLabel(project.projectType)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {getStatusLabel(project.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-brand-gray truncate" title={project.customer?.fullName || '-'}>
                          {project.customer?.fullName || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          <div className="text-xs text-brand-gray font-medium">
                            {project.progressPercent}%
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-brand-gold h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${project.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-brand-gray truncate">
                          {formatCurrency(project.budgetTotal)}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {project.isPublished ? (
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
                            onClick={() => handleEdit(project)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-brand-navy bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                            title={t('admin.projects.table.edit')}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {t('admin.projects.table.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                            title={t('admin.projects.table.delete')}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t('admin.projects.table.delete')}
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
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-4">
                {/* Project Header */}
                <div className="flex gap-3 mb-3">
                  {project.thumbnailImage && (
                    <img
                      src={project.thumbnailImage}
                      alt={project.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-navy mb-1 truncate">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        📍 {project.location}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {getTypeLabel(project.projectType)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2 text-sm mb-3 pb-3 border-b">
                  {project.customer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.projects.table.customer')}:</span>
                      <span className="font-medium text-brand-navy">{project.customer.fullName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('admin.projects.table.budget')}:</span>
                    <span className="font-medium">{formatCurrency(project.budgetTotal)}</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">{t('admin.projects.table.progress')}:</span>
                      <span className="font-medium">{project.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brand-gold h-2 rounded-full transition-all"
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('admin.projects.table.published')}:</span>
                    {project.isPublished ? (
                      <span className="text-green-600 font-medium">✓ {t('admin.projects.table.yes')}</span>
                    ) : (
                      <span className="text-gray-400">✗ {t('admin.projects.table.no')}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-4 py-2 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium"
                  >
                    {t('admin.projects.table.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    {t('admin.projects.table.delete')}
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
