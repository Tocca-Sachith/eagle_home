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
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [width, setWidth] = useState('1920')
  const [height, setHeight] = useState('1080')
  const [displayOrder, setDisplayOrder] = useState('0')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) {
      alert('ファイルとタイトルは必須です')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('altText', altText || title)
      formData.append('width', width)
      formData.append('height', height)
      formData.append('displayOrder', displayOrder)

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
      setWidth('1920')
      setHeight('1080')
      setDisplayOrder('0')
      setFile(null)
      setPreviewUrl('')
      setShowUploadForm(false)

      // Refresh list
      fetchHeroImages()
      alert('画像をアップロードしました！')
    } catch (error) {
      console.error('Error uploading:', error)
      alert('アップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (id: string, updates: Partial<HeroImage>) => {
    try {
      const res = await fetch(`/api/hero-images/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        throw new Error('Update failed')
      }

      fetchHeroImages()
      setEditingImage(null)
      alert('更新しました！')
    } catch (error) {
      console.error('Error updating:', error)
      alert('更新に失敗しました')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この画像を削除してもよろしいですか？')) {
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
      alert('削除しました')
    } catch (error) {
      console.error('Error deleting:', error)
      alert('削除に失敗しました')
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    await handleUpdate(id, { isActive: !currentActive })
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">
            ヒーロー画像管理
          </h1>
          <p className="text-gray-600 mt-2">
            ホームページのヒーローセクションに表示する画像を管理します
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-6 py-3 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          {showUploadForm ? 'キャンセル' : '+ 新規画像追加'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">新規画像アップロード</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                画像ファイル *
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
                  タイトル *
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
                  代替テキスト (ALT)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="タイトルが使用されます"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  幅 (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  min="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  高さ (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  min="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示順序
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  min="0"
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
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {uploading ? 'アップロード中...' : 'アップロード'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hero Images List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {heroImages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>ヒーロー画像がまだありません</p>
            <p className="text-sm mt-2">「新規画像追加」ボタンから追加してください</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プレビュー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイトル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サイズ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    表示順序
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heroImages.map((image) => (
                  <tr key={image.id}>
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
                      {editingImage?.id === image.id ? (
                        <input
                          type="text"
                          value={editingImage.title}
                          onChange={(e) =>
                            setEditingImage({
                              ...editingImage,
                              title: e.target.value,
                            })
                          }
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
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
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingImage?.id === image.id ? (
                        <div className="space-y-1">
                          <input
                            type="number"
                            value={editingImage.width}
                            onChange={(e) =>
                              setEditingImage({
                                ...editingImage,
                                width: parseInt(e.target.value),
                              })
                            }
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <span> × </span>
                          <input
                            type="number"
                            value={editingImage.height}
                            onChange={(e) =>
                              setEditingImage({
                                ...editingImage,
                                height: parseInt(e.target.value),
                              })
                            }
                            className="w-20 px-2 py-1 border rounded"
                          />
                        </div>
                      ) : (
                        `${image.width} × ${image.height} px`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingImage?.id === image.id ? (
                        <input
                          type="number"
                          value={editingImage.displayOrder}
                          onChange={(e) =>
                            setEditingImage({
                              ...editingImage,
                              displayOrder: parseInt(e.target.value),
                            })
                          }
                          className="w-16 px-2 py-1 border rounded"
                        />
                      ) : (
                        image.displayOrder
                      )}
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
                        {image.isActive ? '有効' : '無効'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {editingImage?.id === image.id ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdate(image.id, {
                                title: editingImage.title,
                                width: editingImage.width,
                                height: editingImage.height,
                                displayOrder: editingImage.displayOrder,
                              })
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditingImage(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            キャンセル
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingImage(image)}
                            className="text-brand-navy hover:text-blue-900"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
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
    </div>
  )
}
