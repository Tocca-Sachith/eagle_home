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

interface Investor {
  id: string
  investorNumber: string
  fullName: string
  email: string | null
  phone: string | null
  isActive: boolean
}

interface ProjectInvestorAssignment {
  investorId: string
  investor?: Investor
  payments: Array<{
    amount: string
    paidAt: string
  }>
}

interface ProjectExpenseRow {
  name: string
  content: string
  amount: string
  date: string
}

interface ProjectImage {
  id: string
  imagePath: string
  caption: string | null
  phase: string | null
  displayOrder: number
  uploadedAt: string
}

interface ProjectExpenseFromApi {
  phase: string | null
  category: string | null
  item: string
  amount: number
  currency: string
  expenseDate: string | null
  notes: string | null
}

interface ProjectInvestorFromApi {
  investorId: string
  investmentAmount: number | null
  investor: Investor
}

interface ProjectInvestmentFromApi {
  investorId: string
  installmentNo: number
  amount: number
  paidAt: string | null
  investor: Investor
}

interface ProjectDetails extends Project {
  images: ProjectImage[]
  investors: ProjectInvestorFromApi[]
  expenses: ProjectExpenseFromApi[]
  investments: ProjectInvestmentFromApi[]
}

export default function AdminProjectsPage() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [investors, setInvestors] = useState<Investor[]>([])
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
  const [projectInvestors, setProjectInvestors] = useState<ProjectInvestorAssignment[]>([])
  const [projectExpenses, setProjectExpenses] = useState<ProjectExpenseRow[]>([])
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([])
  const [selectedInvestorId, setSelectedInvestorId] = useState('')
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [reorderingImages, setReorderingImages] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatCurrencyFromString = (amount: string) => {
    const num = amount ? Number(amount) : 0
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(num)
  }

  useEffect(() => {
    fetchProjects()
    fetchCustomers()
    fetchInvestors()
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

  const fetchInvestors = async () => {
    try {
      const res = await fetch('/api/investors')
      const data = await res.json()
      setInvestors(data.investors || [])
    } catch (error) {
      console.error('Error fetching investors:', error)
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
    setProjectInvestors([])
    setProjectExpenses([])
    setProjectImages([])
    setSelectedInvestorId('')
    setNewImageFiles([])
    setShowForm(true)
  }

  const handleEdit = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, { cache: 'no-store' })
      const data = await res.json()
      const p = (data.project || project) as ProjectDetails

      setEditingProject(p)
      setFormData({
        title: p.title,
        description: p.description || '',
        location: p.location || '',
        projectType: p.projectType,
        status: p.status,
        customerId: p.customerId || '',
        budgetTotal: p.budgetTotal?.toString() || '',
        actualCost: p.actualCost?.toString() || '',
        contractDate: p.contractDate ? p.contractDate.substring(0, 10) : '',
        startDate: p.startDate ? p.startDate.substring(0, 10) : '',
        endDatePlanned: p.endDatePlanned ? p.endDatePlanned.substring(0, 10) : '',
        actualEndDate: p.actualEndDate ? p.actualEndDate.substring(0, 10) : '',
        investorName: p.investorName || '',
        investorContact: p.investorContact || '',
        currentPhase: p.currentPhase || '',
        progressPercent: (p.progressPercent ?? 0).toString(),
        isPublished: !!p.isPublished,
        displayOrder: (p.displayOrder ?? 0).toString(),
        notes: p.notes || '',
      })

      const investorRows: ProjectInvestorAssignment[] = Array.isArray(p.investors)
        ? p.investors.map((pi) => ({
            investorId: pi.investorId,
            investor: pi.investor,
            payments: [],
          }))
        : []

      // Group payments by investorId (installments)
      const investmentRows = Array.isArray(p.investments) ? p.investments : []
      const paymentsByInvestor = new Map<string, Array<{ amount: string; paidAt: string }>>()
      for (const inv of investmentRows) {
        const list = paymentsByInvestor.get(inv.investorId) || []
        list.push({
          amount: String(inv.amount),
          paidAt: inv.paidAt ? String(inv.paidAt).substring(0, 10) : '',
        })
        paymentsByInvestor.set(inv.investorId, list)
      }

      const mergedInvestors = investorRows.map((row) => ({
        ...row,
        payments: paymentsByInvestor.get(row.investorId) || [],
      }))
      setProjectInvestors(mergedInvestors)

      const expenseRows: ProjectExpenseRow[] = Array.isArray(p.expenses)
        ? p.expenses.map((e) => ({
            name: e.phase || '',
            content: e.item || '',
            amount: e.amount === null || e.amount === undefined ? '' : String(e.amount),
            date: e.expenseDate ? String(e.expenseDate).substring(0, 10) : '',
          }))
        : []
      setProjectExpenses(expenseRows)

      setProjectImages(Array.isArray(p.images) ? p.images : [])
      setSelectedInvestorId('')
      setThumbnailFile(null)
      setNewImageFiles([])
      setShowForm(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error fetching project details:', error)
      // fallback to basic
      setEditingProject(project)
      setProjectInvestors([])
      setProjectExpenses([])
      setProjectImages([])
      setShowForm(true)
    }
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
      if (formData.currentPhase) data.append('currentPhase', formData.currentPhase)
      data.append('progressPercent', formData.progressPercent)
      data.append('isPublished', formData.isPublished.toString())
      data.append('displayOrder', formData.displayOrder)
      if (formData.notes) data.append('notes', formData.notes)
      if (thumbnailFile) data.append('thumbnail', thumbnailFile)

      // Investors (multiple) + investment amounts
      data.append(
        'investorsJson',
        JSON.stringify(
          projectInvestors
            .filter((pi) => pi.investorId)
            .map((pi) => ({ investorId: pi.investorId }))
        )
      )

      data.append(
        'investorPaymentsJson',
        JSON.stringify(
          projectInvestors
            .filter((pi) => pi.investorId)
            .map((pi) => ({
              investorId: pi.investorId,
              payments: (pi.payments || [])
                .filter((p) => p.amount)
                .map((p) => ({
                  amount: Number(p.amount),
                  paidAt: p.paidAt || null,
                })),
            }))
        )
      )

      // Project expenses (phase/item based)
      data.append(
        'expensesJson',
        JSON.stringify(
          projectExpenses
            .filter((e) => e.name && e.amount)
            .map((e) => ({
              phase: e.name || null,
              category: null,
              item: e.content || '',
              amount: Number(e.amount),
              currency: 'LKR',
              expenseDate: e.date || null,
              notes: null,
            }))
        )
      )

      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: data,
      })

      if (res.ok) {
        const saved = await res.json().catch(() => null)
        const savedProject = saved?.project as Project | undefined

        alert(
          editingProject
            ? t('admin.projects.updateSuccess')
            : t('admin.projects.createSuccess')
        )
        await fetchProjects()

        // After create, keep the form open so the user can add images immediately
        if (!editingProject && savedProject) {
          setEditingProject(savedProject)
          // refresh details (includes investors/expenses/images)
          await handleEdit(savedProject)
        } else {
          setShowForm(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
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

  const addInvestorToProject = () => {
    const id = selectedInvestorId
    if (!id) return
    if (projectInvestors.some((pi) => pi.investorId === id)) return
    const investor = investors.find((i) => i.id === id)
    setProjectInvestors([
      ...projectInvestors,
      { investorId: id, investor, payments: [{ amount: '', paidAt: '' }] },
    ])
    setSelectedInvestorId('')
  }

  const removeInvestorFromProject = (investorId: string) => {
    setProjectInvestors(projectInvestors.filter((pi) => pi.investorId !== investorId))
  }

  const addInvestorPayment = (investorId: string) => {
    setProjectInvestors(
      projectInvestors.map((pi) =>
        pi.investorId === investorId
          ? {
              ...pi,
              payments: [...(pi.payments || []), { amount: '', paidAt: '' }],
            }
          : pi
      )
    )
  }

  const removeInvestorPayment = (investorId: string, paymentIndex: number) => {
    setProjectInvestors(
      projectInvestors.map((pi) =>
        pi.investorId === investorId
          ? {
              ...pi,
              payments: (pi.payments || []).filter((_, idx) => idx !== paymentIndex),
            }
          : pi
      )
    )
  }

  const updateInvestorPayment = (
    investorId: string,
    paymentIndex: number,
    patch: Partial<{ amount: string; paidAt: string }>
  ) => {
    setProjectInvestors(
      projectInvestors.map((pi) => {
        if (pi.investorId !== investorId) return pi
        const payments = [...(pi.payments || [])]
        payments[paymentIndex] = { ...payments[paymentIndex], ...patch }
        return { ...pi, payments }
      })
    )
  }

  const investorPaymentTotal = (payments: Array<{ amount: string }>) => {
    return (payments || []).reduce((sum, p) => sum + (p.amount ? Number(p.amount) : 0), 0)
  }

  const addExpenseRow = () => {
    setProjectExpenses([
      ...projectExpenses,
      {
        name: '',
        content: '',
        amount: '',
        date: '',
      },
    ])
  }

  const removeExpenseRow = (index: number) => {
    setProjectExpenses(projectExpenses.filter((_, i) => i !== index))
  }

  // Images are uploaded immediately when selected (see handleSelectImages)

  const handleSelectImages = async (files: FileList | null) => {
    const list = Array.from(files || [])
    if (list.length === 0) return
    // upload immediately without refreshing the page
    try {
      if (!editingProject?.id) return
      setNewImageFiles(list)
      const createdImages: ProjectImage[] = []

      for (const file of list) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch(`/api/projects/${editingProject.id}/images`, {
          method: 'POST',
          body: fd,
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          alert(err.error || 'Failed to upload image')
          return
        }
        const data = await res.json().catch(() => null)
        if (data?.image) createdImages.push(data.image as ProjectImage)
      }

      const merged = [...projectImages, ...createdImages]
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
      setProjectImages(merged)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images')
    } finally {
      setNewImageFiles([])
    }
  }

  const reorderProjectImages = async (next: ProjectImage[]) => {
    if (!editingProject?.id) return
    try {
      setReorderingImages(true)
      const withOrder = next.map((img, idx) => ({ ...img, displayOrder: idx }))
      setProjectImages(withOrder)

      await Promise.all(
        withOrder.map((img) =>
          fetch(`/api/projects/${editingProject.id}/images/${img.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              caption: img.caption,
              phase: img.phase,
              displayOrder: img.displayOrder,
            }),
          })
        )
      )
    } catch (error) {
      console.error('Error reordering images:', error)
      alert('Failed to reorder images')
    } finally {
      setReorderingImages(false)
    }
  }

  const deleteProjectImage = async (imageId: string) => {
    if (!editingProject?.id) return
    if (!confirm('Delete this image?')) return
    try {
      const res = await fetch(`/api/projects/${editingProject.id}/images/${imageId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Failed to delete image')
        return
      }
      setProjectImages(projectImages.filter((img) => img.id !== imageId))
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image')
    }
  }

  const updateProjectImageMeta = async (img: ProjectImage) => {
    if (!editingProject?.id) return
    try {
      const res = await fetch(`/api/projects/${editingProject.id}/images/${img.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: img.caption,
          phase: img.phase,
          displayOrder: img.displayOrder,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Failed to update image')
        return
      }
      await handleEdit(editingProject)
    } catch (error) {
      console.error('Error updating image:', error)
      alert('Failed to update image')
    }
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
              </div>

              {/* Investors (multiple) */}
              <div className="mt-6">
                <div className="flex flex-col md:flex-row md:items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      Investors
                    </label>
                    <select
                      value={selectedInvestorId}
                      onChange={(e) => setSelectedInvestorId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    >
                      <option value="">Select an investor to add</option>
                      {investors
                        .filter((inv) => !projectInvestors.some((pi) => pi.investorId === inv.id))
                        .map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.fullName} ({inv.investorNumber})
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addInvestorToProject}
                    className="px-5 py-2 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Add Investor
                  </button>
                </div>

                {projectInvestors.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {projectInvestors.map((pi) => {
                      const inv = pi.investor || investors.find((i) => i.id === pi.investorId)
                      const total = investorPaymentTotal(pi.payments || [])
                      return (
                        <div
                          key={pi.investorId}
                          className="border border-gray-200 rounded-md p-4 space-y-3"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="text-sm font-semibold text-brand-navy">
                              {inv ? `${inv.fullName} (${inv.investorNumber})` : pi.investorId}
                            </div>
                            <div className="text-sm font-semibold text-brand-navy">
                              Total: {formatCurrencyFromString(String(total))}
                            </div>
                          </div>

                          {inv?.email && <div className="text-xs text-gray-500 truncate">{inv.email}</div>}

                          {/* Payments (1st/2nd/3rd...) */}
                          <div className="space-y-2">
                            {(pi.payments || []).length === 0 ? (
                              <div className="text-sm text-gray-500">No payments yet.</div>
                            ) : (
                              (pi.payments || []).map((p, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border border-gray-100 rounded-md p-3"
                                >
                                  <div className="md:col-span-3">
                                    <div className="text-xs text-gray-600 mb-1">Payment #{pIdx + 1}</div>
                                    <input
                                      type="date"
                                      value={p.paidAt}
                                      onChange={(e) =>
                                        updateInvestorPayment(pi.investorId, pIdx, { paidAt: e.target.value })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                                    />
                                  </div>
                                  <div className="md:col-span-7">
                                    <div className="text-xs text-gray-600 mb-1">Amount (LKR)</div>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={p.amount}
                                      onChange={(e) =>
                                        updateInvestorPayment(pi.investorId, pIdx, { amount: e.target.value })
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                                    />
                                  </div>
                                  <div className="md:col-span-2 flex md:justify-end">
                                    <button
                                      type="button"
                                      onClick={() => removeInvestorPayment(pi.investorId, pIdx)}
                                      className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}

                            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                              <button
                                type="button"
                                onClick={() => addInvestorPayment(pi.investorId)}
                                className="px-4 py-2 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
                              >
                                Add Payment
                              </button>
                              <button
                                type="button"
                                onClick={() => removeInvestorFromProject(pi.investorId)}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
                              >
                                Remove Investor
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Cost Breakdown (Expenses) */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                Cost Breakdown
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
                <p className="text-sm text-brand-gray">
                  Add costs by phase (e.g., Foundation, Bathroom, Painting) with amounts.
                </p>
                <button
                  type="button"
                  onClick={addExpenseRow}
                  className="px-5 py-2 bg-brand-navy text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
                >
                  Add Cost Row
                </button>
              </div>

              {projectExpenses.length === 0 ? (
                <div className="text-sm text-gray-500">No cost rows yet.</div>
              ) : (
                <div className="space-y-3">
                  {projectExpenses.map((row, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Cost name</label>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => {
                              const next = [...projectExpenses]
                              next[index] = { ...next[index], name: e.target.value }
                              setProjectExpenses(next)
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Cost details</label>
                          <input
                            type="text"
                            value={row.content}
                            onChange={(e) => {
                              const next = [...projectExpenses]
                              next[index] = { ...next[index], content: e.target.value }
                              setProjectExpenses(next)
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Amount (LKR)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={row.amount}
                            onChange={(e) => {
                              const next = [...projectExpenses]
                              next[index] = { ...next[index], amount: e.target.value }
                              setProjectExpenses(next)
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Date</label>
                          <input
                            type="date"
                            value={row.date}
                            onChange={(e) => {
                              const next = [...projectExpenses]
                              next[index] = { ...next[index], date: e.target.value }
                              setProjectExpenses(next)
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeExpenseRow(index)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
                        >
                          Remove Row
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

            {/* Project Images (multiple, excluding thumbnail) */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 pb-2 border-b">
                Project Images
              </h2>

              {!editingProject?.id ? (
                <p className="text-sm text-gray-500">
                  Save the project first to upload additional images.
                </p>
              ) : (
                <div className="space-y-6">
                  {/* Upload */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-navy mb-2">
                        Upload Images (multiple)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          // Auto-upload immediately (no button) and keep form state intact
                          await handleSelectImages(e.target.files)
                          // allow re-selecting the same file(s)
                          e.currentTarget.value = ''
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-opacity-90"
                      />
                      {newImageFiles.length > 0 && (
                        <div className="text-xs text-gray-500 mt-2">
                          {newImageFiles.length} file(s) selected
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Existing images */}
                  {projectImages.length === 0 ? (
                    <p className="text-sm text-gray-500">No additional images yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {reorderingImages && (
                        <div className="text-sm text-gray-500">
                          Reordering...
                        </div>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {projectImages.map((img, idx) => (
                          <div
                            key={img.id}
                            draggable={!reorderingImages}
                            onDragStart={() => setDragIndex(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (dragIndex === null || dragIndex === idx) return
                              const next = [...projectImages]
                              const [moved] = next.splice(dragIndex, 1)
                              next.splice(idx, 0, moved)
                              setDragIndex(null)
                              reorderProjectImages(next)
                            }}
                            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                          >
                            <div className="relative">
                              <img
                                src={img.imagePath}
                                alt="Project image"
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                Drag
                              </div>
                            </div>
                            <div className="p-2 flex items-center justify-between gap-2">
                              <div className="text-xs text-gray-500 truncate">
                                #{idx + 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteProjectImage(img.id)}
                                className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Drag and drop images to change the order.
                      </p>
                    </div>
                  )}
                </div>
              )}
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
