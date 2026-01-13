'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

interface Job {
  id: string
  title: string
  description: string | null
  serviceType: string
  status: string
  priority: string
  scheduledDate: string | null
  scheduledTime: string | null
  jobAddress: string
  jobCity: string
  jobState: string
  jobZipCode: string
  estimatedCost: number | null
  client: {
    firstName: string
    lastName: string
  }
  assignedTo: {
    name: string
  } | null
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const serviceLabels: Record<string, string> = {
  demo: 'Demo & Removal',
  plant_installation: 'Plant Installation',
  mulch: 'Mulch',
  general_install: 'Basic Installation',
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${job.client.firstName} ${job.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobAddress.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Jobs</h1>
          <p className="text-bark-500">Manage and track all landscaping projects</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <PlusIcon className="w-5 h-5" />
          New Job
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bark-400" />
            <input
              type="text"
              placeholder="Search by title, client, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-bark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-bark-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-bark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-bark-500 mt-4">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-bark-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-bark-400" />
            </div>
            <h3 className="font-semibold text-bark-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No jobs found' : 'No jobs yet'}
            </h3>
            <p className="text-bark-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter' 
                : 'Create your first job to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/dashboard/jobs/new" className="btn-primary">
                Create Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-bark-100">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="block p-6 hover:bg-bark-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-bark-900 text-lg">
                        {job.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                        {statusLabels[job.status]}
                      </span>
                    </div>
                    <p className="text-bark-600 mb-3">
                      {job.client.firstName} {job.client.lastName} • {serviceLabels[job.serviceType] || job.serviceType}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-bark-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(job.scheduledDate)}
                        {job.scheduledTime && ` at ${job.scheduledTime}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {job.jobAddress}, {job.jobCity}
                      </span>
                      {job.assignedTo && (
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          Assigned to {job.assignedTo.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {job.estimatedCost && (
                    <div className="text-right">
                      <p className="text-lg font-semibold text-bark-900">
                        ${job.estimatedCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-bark-400">estimated</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
