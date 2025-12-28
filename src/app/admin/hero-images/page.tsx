'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface HeroImage {
  id: string
  title: string
  imagePath: string
  altText: string | null
  width: number
  height: number
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export default function HeroImagesPage() {
  const router = useRouter()
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editAltText, setEditAltText] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editPreviewUrl, setEditPreviewUrl] = useState<string>('')

  useEffect(() => {
    fetchHeroImages()
  }, [])

  const fetchHeroImages = async () => {
    try {
      const res = await fetch('/api/hero-images')
      const data = await res.json()
      setHeroImages(data.heroImages || [])
    } catch (error) {
      console.error('Error fetching hero images:', error)
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

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setEditFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setEditPreviewUrl(url)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) {
      alert('File and title are required')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('altText', altText || title)
      formData.append('displayOrder', heroImages.length.toString())

      const res = await fetch('/api/hero-images', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      // Reset form
      setTitle('')
      setAltText('')
      setFile(null)
      setPreviewUrl('')
      setShowUploadForm(false)

      // Refresh list
      fetchHeroImages()
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const openEditModal = (image: HeroImage) => {
    setEditingImage(image)
    setEditTitle(image.title)
    setEditAltText(image.altText || '')
    setEditFile(null)
    setEditPreviewUrl('')
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingImage(null)
    setEditTitle('')
    setEditAltText('')
    setEditFile(null)
    setEditPreviewUrl('')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingImage || !editTitle) {
      alert('Title is required')
      return
    }

    setUploading(true)
    try {
      // If new image file is provided, upload it
      if (editFile) {
        const formData = new FormData()
        formData.append('file', editFile)
        formData.append('title', editTitle)
        formData.append('altText', editAltText || editTitle)
        formData.append('displayOrder', editingImage.displayOrder.toString())

        // Delete old image and create new one
        await fetch(`/api/hero-images/${editingImage.id}`, {
          method: 'DELETE',
        })

        const res = await fetch('/api/hero-images', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          throw new Error('Update failed')
        }
      } else {
        // Update only title and altText
        const res = await fetch(`/api/hero-images/${editingImage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editTitle,
            altText: editAltText,
          }),
        })

        if (!res.ok) {
          throw new Error('Update failed')
        }
      }

      closeEditModal()
      fetchHeroImages()
      alert('Image updated successfully!')
    } catch (error) {
      console.error('Error updating:', error)
      alert('Update failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const res = await fetch(`/api/hero-images/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      fetchHeroImages()
      alert('Deleted successfully')
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Delete failed')
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/hero-images/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      })

      if (!res.ok) {
        throw new Error('Update failed')
      }

      fetchHeroImages()
    } catch (error) {
      console.error('Error toggling active:', error)
      alert('Failed to update status')
    }
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

    const reorderedImages = [...heroImages]
    const [draggedItem] = reorderedImages.splice(draggedIndex, 1)
    reorderedImages.splice(dropIndex, 0, draggedItem)

    // Update display order for all affected images
    const updates = reorderedImages.map((img, idx) => ({
      id: img.id,
      displayOrder: idx,
    }))

    try {
      // Update all orders in parallel
      await Promise.all(
        updates.map((update) =>
          fetch(`/api/hero-images/${update.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayOrder: update.displayOrder }),
          })
        )
      )

      fetchHeroImages()
    } catch (error) {
      console.error('Error reordering:', error)
      alert('Failed to reorder images')
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
            Hero Images Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage images displayed in the homepage hero section
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-6 py-3 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          {showUploadForm ? 'Cancel' : '+ Add New Image'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image File *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-opacity-90"
                required
              />
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-md rounded-lg shadow"
                  />
                </div>
              )}
            </div>

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
                  Alt Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Title will be used if empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false)
                  setFile(null)
                  setPreviewUrl('')
                  setTitle('')
                  setAltText('')
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Hero Image</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Current Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </label>
                  <div className="relative w-full h-48">
                    <Image
                      src={editingImage.imagePath}
                      alt={editingImage.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* New Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Replace Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-opacity-90"
                  />
                  {editPreviewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                      <img
                        src={editPreviewUrl}
                        alt="Preview"
                        className="max-w-md rounded-lg shadow"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={editAltText}
                      onChange={(e) => setEditAltText(e.target.value)}
                      placeholder="Title will be used if empty"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {uploading ? 'Updating...' : 'Update Image'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Images List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {heroImages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No hero images yet</p>
            <p className="text-sm mt-2">Click &quot;Add New Image&quot; button to add one</p>
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
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title / Alt
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
                {heroImages.map((image, index) => (
                  <tr
                    key={image.id}
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
                      <div className="relative w-32 h-20">
                        <Image
                          src={image.imagePath}
                          alt={image.altText || image.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {image.title}
                        </div>
                        {image.altText && (
                          <div className="text-sm text-gray-500">
                            ALT: {image.altText}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(image.id, image.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          image.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {image.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openEditModal(image)}
                        className="text-brand-navy hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
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

      <div className="mt-4 text-sm text-gray-500">
        <p>💡 Tip: Drag and drop rows to reorder images</p>
      </div>
    </div>
  )
}
