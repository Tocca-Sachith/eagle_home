'use client'

import { useState, useEffect, useRef } from 'react'

interface Customer {
  id: string
  fullName: string
  email: string | null
}

interface Project {
  id: string
  title: string
  description: string | null
  location: string | null
  projectType: string
  status: string
  budgetTotal: number | null
  startDate: string | null
  endDatePlanned: string | null
  contractDate: string | null
  actualEndDate: string | null
  customerId: string | null
  customer?: Customer
  thumbnailImage: string | null
  isPublished: boolean
  displayOrder: number
  progressPercent: number
  currentPhase: string | null
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    projectType: 'BUILD',
    status: 'PLANNING',
    customerId: '',
    budgetTotal: '',
    contractDate: '',
    startDate: '',
    endDatePlanned: '',
    actualEndDate: '',
    currentPhase: '',
    progressPercent: '0',
    isPublished: false,
    displayOrder: '0',
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProjects()
    fetchCustomers()
  }, [])

  const fetchProjects = async (search?: string) => {
    try {
      const url = search
        ? `/api/projects?search=${encodeURIComponent(search)}`
        : '/api/projects'
      const res = await fetch(url)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProjects(searchQuery)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      projectType: 'BUILD',
      status: 'PLANNING',
      customerId: '',
      budgetTotal: '',
      contractDate: '',
      startDate: '',
      endDatePlanned: '',
      actualEndDate: '',
      currentPhase: '',
      progressPercent: '0',
      isPublished: false,
      displayOrder: '0',
    })
    setThumbnailFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setEditingProject(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      location: project.location || '',
      projectType: project.projectType,
      status: project.status,
      customerId: project.customerId || '',
      budgetTotal: project.budgetTotal?.toString() || '',
      contractDate: project.contractDate ? new Date(project.contractDate).toISOString().split('T')[0] : '',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDatePlanned: project.endDatePlanned ? new Date(project.endDatePlanned).toISOString().split('T')[0] : '',
      actualEndDate: project.actualEndDate ? new Date(project.actualEndDate).toISOString().split('T')[0] : '',
      currentPhase: project.currentPhase || '',
      progressPercent: project.progressPercent.toString(),
      isPublished: project.isPublished,
      displayOrder: project.displayOrder.toString(),
    })
    setThumbnailFile(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }

    setSaving(true)
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString())
      })
      
      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile)
      }

      const url = editingProject 
        ? `/api/projects/${editingProject.id}`
        : '/api/projects'
      
      const method = editingProject ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: data,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Operation failed')
      }

      closeModal()
      fetchProjects()
      alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!')
    } catch (error: any) {
      console.error('Error saving project:', error)
      alert(error.message || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      fetchProjects()
      alert('Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'PLANNING': return 'bg-yellow-100 text-yellow-800'
      case 'ON_HOLD': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">
            Project Management
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Track and manage construction projects
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 md:px-6 py-2 md:py-3 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          + Add New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 text-sm whitespace-nowrap"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  fetchProjects()
                }}
                className="flex-1 sm:flex-none px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No projects found</p>
            <p className="text-sm mt-2">Click "Add New Project" to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Info</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {project.thumbnailImage && (
                          <img
                            src={project.thumbnailImage}
                            alt={project.title}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-xs text-gray-500">{project.projectType} • {project.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {project.customer ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{project.customer.fullName}</div>
                          <div className="text-xs text-gray-500">{project.customer.email}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No client assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      {project.isPublished && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex flex-col text-xs">
                        <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</span>
                        <span>End: {project.endDatePlanned ? new Date(project.endDatePlanned).toLocaleDateString() : '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        onClick={() => openEditModal(project)}
                        className="text-brand-navy hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-brand-navy">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Info</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        >
                          <option value="BUILD">Build</option>
                          <option value="RENOVATION">Renovation</option>
                          <option value="DESIGN">Design</option>
                          <option value="CONSULTATION">Consultation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        >
                          <option value="PLANNING">Planning</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="ON_HOLD">On Hold</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                      <select
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      >
                        <option value="">Select a client...</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.fullName} ({customer.email || 'No email'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Financial & Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Details & Timeline</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget Total</label>
                      <input
                        type="number"
                        value={formData.budgetTotal}
                        onChange={(e) => setFormData({ ...formData, budgetTotal: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Planned End Date</label>
                        <input
                          type="date"
                          value={formData.endDatePlanned}
                          onChange={(e) => setFormData({ ...formData, endDatePlanned: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.progressPercent}
                          onChange={(e) => setFormData({ ...formData, progressPercent: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Phase</label>
                        <input
                          type="text"
                          value={formData.currentPhase}
                          onChange={(e) => setFormData({ ...formData, currentPhase: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-blue-900"
                        />
                        {editingProject?.thumbnailImage && !thumbnailFile && (
                          <div className="flex-shrink-0">
                            <img
                              src={editingProject.thumbnailImage}
                              alt="Current thumbnail"
                              className="h-10 w-10 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                          className="w-4 h-4 text-brand-navy border-gray-300 rounded focus:ring-brand-navy"
                        />
                        <span className="ml-2 text-sm text-gray-700">Publish to Homepage</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
