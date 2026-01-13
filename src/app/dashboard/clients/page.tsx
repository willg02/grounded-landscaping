'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  notes: string | null
  createdAt: string
  _count?: {
    jobs: number
    invoices: number
  }
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Clients</h1>
          <p className="text-bark-500">Manage your customer database</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <PlusIcon className="w-5 h-5" />
          Add Client
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bark-400" />
          <input
            type="text"
            placeholder="Search clients by name, email, phone, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-bark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-bark-500 mt-4">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-bark-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-bark-400" />
            </div>
            <h3 className="font-semibold text-bark-900 mb-2">
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-bark-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Add your first client to get started'}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/clients/new" className="btn-primary">
                Add Your First Client
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-bark-100">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-6 hover:bg-bark-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-semibold text-lg">
                        {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-bark-900 text-lg">
                        {client.firstName} {client.lastName}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-bark-500">
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="w-4 h-4" />
                          {client.phone}
                        </span>
                        {client.email && (
                          <span className="flex items-center gap-1">
                            <EnvelopeIcon className="w-4 h-4" />
                            {client.email}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-sm text-bark-400">
                        <MapPinIcon className="w-4 h-4" />
                        {client.address}, {client.city}, {client.state} {client.zipCode}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="p-2 text-bark-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/dashboard/clients/${client.id}/edit`}
                      className="p-2 text-bark-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit Client"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
