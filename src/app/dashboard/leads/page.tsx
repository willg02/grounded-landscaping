'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: string
  createdAt: string
}

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted',
  closed: 'Closed',
}

const statusColors: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  converted: 'bg-green-100 text-green-800',
  closed: 'bg-bark-100 text-bark-800',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === id ? { ...lead, status } : lead
        ))
        toast.success('Lead status updated')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const convertToClient = async (lead: Lead) => {
    // Navigate to new client page with pre-filled data
    const params = new URLSearchParams({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      leadId: lead.id,
    })
    window.location.href = `/dashboard/clients/new?${params.toString()}`
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Leads</h1>
          <p className="text-bark-500">Manage contact form submissions</p>
        </div>
        <button
          onClick={fetchLeads}
          className="inline-flex items-center gap-2 px-4 py-2 text-bark-600 hover:text-bark-900 hover:bg-bark-100 rounded-lg transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-bark-900">{leads.length}</p>
          <p className="text-sm text-bark-500">Total Leads</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-yellow-600">
            {leads.filter(l => l.status === 'new').length}
          </p>
          <p className="text-sm text-bark-500">New</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-blue-600">
            {leads.filter(l => l.status === 'contacted').length}
          </p>
          <p className="text-sm text-bark-500">Contacted</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-green-600">
            {leads.filter(l => l.status === 'converted').length}
          </p>
          <p className="text-sm text-bark-500">Converted</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-bark-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-bark-500 mt-4">Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-12 text-center">
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-bark-300 mx-auto mb-4" />
          <p className="text-bark-500">No leads found</p>
          <p className="text-sm text-bark-400 mt-1">
            Leads will appear here when visitors submit the contact form
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl shadow-sm border border-bark-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Lead Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-bark-900">{lead.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                      {lead.status === 'new' && (
                        <span className="flex items-center gap-1 text-xs text-yellow-600">
                          <ClockIcon className="w-3 h-3" />
                          Needs follow-up
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-bark-600 mb-3">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary-600">
                        <EnvelopeIcon className="w-4 h-4" />
                        {lead.email}
                      </a>
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                        <PhoneIcon className="w-4 h-4" />
                        {lead.phone}
                      </a>
                      <span className="flex items-center gap-1 text-bark-400">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>

                    <div className="text-sm text-bark-500 mb-2">
                      <span className="font-medium text-bark-700">Interested in:</span> {lead.service}
                    </div>

                    <div className="bg-bark-50 rounded-lg p-3">
                      <p className="text-sm text-bark-600">{lead.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    {lead.status !== 'converted' && (
                      <button
                        onClick={() => convertToClient(lead)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                      >
                        <UserPlusIcon className="w-4 h-4" />
                        Convert to Client
                      </button>
                    )}
                    {lead.status === 'new' && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'contacted')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Mark Contacted
                      </button>
                    )}
                    {lead.status !== 'closed' && lead.status !== 'converted' && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'closed')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-bark-600 hover:text-bark-700 hover:bg-bark-100 border border-bark-200 rounded-lg transition-colors"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Close Lead
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
