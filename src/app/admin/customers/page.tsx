'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: string
  title: string
  status: string
}

interface Customer {
  id: string
  customerNumber: string
  fullName: string
  email: string | null
  phone: string | null
  address: string | null
  country: string | null
  isOverseas: boolean
  notes: string | null
  createdAt: string
  projects: Project[]
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Create form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [isOverseas, setIsOverseas] = useState(false)
  const [notes, setNotes] = useState('')

  // Edit form state
  const [editFullName, setEditFullName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [editIsOverseas, setEditIsOverseas] = useState(false)
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async (search?: string) => {
    try {
      const url = search
        ? `/api/customers?search=${encodeURIComponent(search)}`
        : '/api/customers'
      const res = await fetch(url)
      const data = await res.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCustomers(searchQuery)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      alert('Full name is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: email || null,
          phone: phone || null,
          address: address || null,
          country: country || null,
          isOverseas,
          notes: notes || null,
        }),
      })

      if (!res.ok) {
        throw new Error('Create failed')
      }

      resetForm()
      fetchCustomers()
      alert('Customer created successfully!')
    } catch (error) {
      console.error('Error creating customer:', error)
      alert('Failed to create customer')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setCountry('')
    setIsOverseas(false)
    setNotes('')
    setShowCreateForm(false)
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setEditFullName(customer.fullName)
    setEditEmail(customer.email || '')
    setEditPhone(customer.phone || '')
    setEditAddress(customer.address || '')
    setEditCountry(customer.country || '')
    setEditIsOverseas(customer.isOverseas)
    setEditNotes(customer.notes || '')
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingCustomer(null)
    setEditFullName('')
    setEditEmail('')
    setEditPhone('')
    setEditAddress('')
    setEditCountry('')
    setEditIsOverseas(false)
    setEditNotes('')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer || !editFullName.trim()) {
      alert('Full name is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editFullName,
          email: editEmail || null,
          phone: editPhone || null,
          address: editAddress || null,
          country: editCountry || null,
          isOverseas: editIsOverseas,
          notes: editNotes || null,
        }),
      })

      if (!res.ok) {
        throw new Error('Update failed')
      }

      closeEditModal()
      fetchCustomers()
      alert('Customer updated successfully!')
    } catch (error) {
      console.error('Error updating customer:', error)
      alert('Failed to update customer')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, hasProjects: boolean) => {
    if (hasProjects) {
      alert('Cannot delete customer with associated projects')
      return
    }

    if (!confirm('Are you sure you want to delete this customer?')) {
      return
    }

    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }

      fetchCustomers()
      alert('Customer deleted successfully')
    } catch (error: any) {
      console.error('Error deleting customer:', error)
      alert(error.message || 'Failed to delete customer')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">
            Customers Management
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Manage customer information and contact details
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 md:px-6 py-2 md:py-3 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          {showCreateForm ? 'Cancel' : '+ Add New Customer'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or customer number..."
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
                  fetchCustomers()
                }}
                className="flex-1 sm:flex-none px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Customer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isOverseas}
                  onChange={(e) => setIsOverseas(e.target.checked)}
                  className="w-4 h-4 text-brand-navy focus:ring-brand-navy border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Overseas Client
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
              />
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
                disabled={saving}
                className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Customer</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Customer Number</p>
                <p className="text-lg font-semibold text-brand-navy">
                  {editingCustomer.customerNumber}
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editIsOverseas}
                      onChange={(e) => setEditIsOverseas(e.target.checked)}
                      className="w-4 h-4 text-brand-navy focus:ring-brand-navy border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Overseas Client
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                  />
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
                    disabled={saving}
                    className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Update Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No customers found</p>
            {!showCreateForm && (
              <p className="text-sm mt-2">Click &quot;Add New Customer&quot; to create one</p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-medium text-brand-navy">
                          {customer.customerNumber}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-[200px]">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {customer.fullName}
                          </div>
                          {customer.isOverseas && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              🌍 Overseas
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs max-w-[180px]">
                          {customer.email && (
                            <div className="text-gray-900 truncate" title={customer.email}>{customer.email}</div>
                          )}
                          {customer.phone && (
                            <div className="text-gray-500 truncate">{customer.phone}</div>
                          )}
                          {!customer.email && !customer.phone && (
                            <span className="text-gray-400">No contact</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs max-w-[200px]">
                          {customer.address && (
                            <div className="text-gray-900 mb-1 truncate" title={customer.address}>{customer.address}</div>
                          )}
                          {customer.country && (
                            <div className="text-gray-500 truncate">{customer.country}</div>
                          )}
                          {!customer.address && !customer.country && (
                            <span className="text-gray-400">No address</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {customer.projects.length} project{customer.projects.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs font-medium">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => openEditModal(customer)}
                            className="text-brand-navy hover:text-blue-900 text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id, customer.projects.length > 0)}
                            className="text-red-600 hover:text-red-900 text-left"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {customers.map((customer) => (
                <div key={customer.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-brand-navy text-base truncate">
                        {customer.fullName}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        {customer.customerNumber}
                      </p>
                    </div>
                    {customer.isOverseas && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-2 whitespace-nowrap">
                        🌍 Overseas
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    {customer.email && (
                      <div className="flex items-start">
                        <span className="text-gray-500 w-20 flex-shrink-0">Email:</span>
                        <span className="text-gray-900 break-all">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-start">
                        <span className="text-gray-500 w-20 flex-shrink-0">Phone:</span>
                        <span className="text-gray-900">{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-start">
                        <span className="text-gray-500 w-20 flex-shrink-0">Address:</span>
                        <span className="text-gray-900 break-words">{customer.address}</span>
                      </div>
                    )}
                    {customer.country && (
                      <div className="flex items-start">
                        <span className="text-gray-500 w-20 flex-shrink-0">Country:</span>
                        <span className="text-gray-900">{customer.country}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <span className="text-gray-500 w-20 flex-shrink-0">Projects:</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {customer.projects.length} project{customer.projects.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(customer)}
                      className="flex-1 px-4 py-2 bg-brand-navy text-white text-sm rounded-lg hover:bg-opacity-90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.projects.length > 0)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 text-xs md:text-sm text-gray-500">
        <p>💡 Tip: Customer numbers are automatically generated when you create a new customer</p>
      </div>
    </div>
  )
}
