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
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-brand-navy">
            {editingProject
              ? t('admin.projects.editProject')
              : t('admin.projects.addNew')}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-navy mb-4">
                {t('admin.projects.basicInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.title')} *
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

                <div className="md:col-span-2">
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
                    {t('admin.projects.form.projectType')} *
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

            {/* Financial Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-navy mb-4">
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
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-navy mb-4">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-navy mb-4">
                {t('admin.projects.displaySettings')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t('admin.projects.form.thumbnail')}
                  </label>
                  {editingProject?.thumbnailImage && !thumbnailFile && (
                    <div className="mb-2">
                      <img
                        src={editingProject.thumbnailImage}
                        alt="Current thumbnail"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files?.[0] || null)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

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

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPublished: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-brand-gold focus:ring-brand-gold border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-brand-navy">
                      {t('admin.projects.form.isPublished')}
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
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
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-brand-navy text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
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
                className="px-6 py-3 bg-gray-300 text-brand-navy rounded-md hover:bg-gray-400"
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">
          {t('admin.projects.title')}
        </h1>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
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
            <p className="text-brand-gray max-w-md mx-auto">
              {t('admin.projects.noProjectsDesc')}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.title')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.customer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.progress')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.budget')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.published')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.projects.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.thumbnailImage && (
                          <img
                            src={project.thumbnailImage}
                            alt={project.title}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-brand-navy">
                            {project.title}
                          </div>
                          {project.location && (
                            <div className="text-xs text-gray-500">
                              {project.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">
                      {getTypeLabel(project.projectType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">
                      {project.customer?.fullName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-brand-gray">
                        {project.progressPercent}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-brand-gold h-2 rounded-full"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">
                      {formatCurrency(project.budgetTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">
                      {project.isPublished
                        ? t('admin.projects.table.yes')
                        : t('admin.projects.table.no')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-brand-navy hover:text-brand-gold mr-4"
                      >
                        {t('admin.projects.table.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('admin.projects.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
