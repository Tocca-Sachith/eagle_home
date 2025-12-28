'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Service {
  id: string
  title: string
  description: string
  category: string
  icon: string | null
  imagePath: string | null
  displayOrder: number
  isActive: boolean
  createdAt: string
}

const CATEGORIES = [
  { value: 'construction', label: 'Construction' },
  { value: 'design', label: 'Design & Planning' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'financing', label: 'Financing' },
  { value: 'other', label: 'Other' },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('construction')
  const [icon, setIcon] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?includeInactive=true')
      const data = await res.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !category) {
      alert('Title, description, and category are required')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      if (file) formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('icon', icon)
      formData.append('displayOrder', services.length.toString())

      const res = await fetch('/api/services', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Create failed')
      }

      // Reset form
      resetForm()
      fetchServices()
      alert('Service created successfully!')
    } catch (error) {
      console.error('Error creating service:', error)
      alert('Failed to create service')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('construction')
    setIcon('')
    setFile(null)
    setPreviewUrl('')
    setShowForm(false)
  }

  const handleUpdate = async (id: string, updates: Partial<Service>) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        throw new Error('Update failed')
      }

      fetchServices()
      setEditingService(null)
      alert('Service updated successfully!')
    } catch (error) {
      console.error('Error updating service:', error)
      alert('Failed to update service')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      fetchServices()
      alert('Service deleted successfully')
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    await handleUpdate(id, { isActive: !currentActive })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const reorderedServices = [...services]
    const [draggedItem] = reorderedServices.splice(draggedIndex, 1)
    reorderedServices.splice(dropIndex, 0, draggedItem)

    const updates = reorderedServices.map((service, idx) => ({
      id: service.id,
      displayOrder: idx,
    }))

    try {
      await Promise.all(
        updates.map((update) =>
          fetch(`/api/services/${update.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayOrder: update.displayOrder }),
          })
        )
      )

      fetchServices()
    } catch (error) {
      console.error('Error reordering services:', error)
      alert('Failed to reorder services')
    }

    setDraggedIndex(null)
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">
            Services Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage services displayed on the services page
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add New Service'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Service</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🏗️"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-opacity-90"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-xs rounded-lg shadow"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {uploading ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {services.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No services yet</p>
            <p className="text-sm mt-2">Click &quot;Add New Service&quot; to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Icon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title / Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service, index) => (
                  <tr
                    key={service.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`cursor-move hover:bg-gray-50 ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                        </svg>
                        <span className="font-medium">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-3xl">{service.icon || '📋'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.imagePath ? (
                        <div className="relative w-20 h-15">
                          <Image
                            src={service.imagePath}
                            alt={service.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingService?.id === service.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingService.title}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Title"
                          />
                          <textarea
                            value={editingService.description}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                description: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Description"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900">
                            {service.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {service.description}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingService?.id === service.id ? (
                        <select
                          value={editingService.category}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              category: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {CATEGORIES.find((c) => c.value === service.category)?.label || service.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(service.id, service.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {editingService?.id === service.id ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdate(service.id, {
                                title: editingService.title,
                                description: editingService.description,
                                category: editingService.category,
                              })
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingService(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingService(service)}
                            className="text-brand-navy hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>💡 Tip: Drag and drop rows to reorder services</p>
      </div>
    </div>
  )
}
