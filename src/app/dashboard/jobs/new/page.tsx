'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Client {
  id: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
}

export default function NewJobPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useClientAddress, setUseClientAddress] = useState(true)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: '',
    priority: 'normal',
    clientId: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedHours: '',
    estimatedCost: '',
    jobAddress: '',
    jobCity: '',
    jobState: '',
    jobZipCode: '',
  })

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
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === 'clientId') {
      const client = clients.find(c => c.id === value)
      setSelectedClient(client || null)
      if (client && useClientAddress) {
        setFormData(prev => ({
          ...prev,
          clientId: value,
          jobAddress: client.address,
          jobCity: client.city,
          jobState: client.state,
          jobZipCode: client.zipCode,
        }))
      }
    }
  }

  const handleAddressToggle = (useClient: boolean) => {
    setUseClientAddress(useClient)
    if (useClient && selectedClient) {
      setFormData(prev => ({
        ...prev,
        jobAddress: selectedClient.address,
        jobCity: selectedClient.city,
        jobState: selectedClient.state,
        jobZipCode: selectedClient.zipCode,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
          estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
        }),
      })

      if (response.ok) {
        toast.success('Job created successfully!')
        router.push('/dashboard/jobs')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to create job')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-bark-500 hover:text-bark-700 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Jobs
        </Link>
        <h1 className="font-display text-2xl font-bold text-bark-900">Create New Job</h1>
        <p className="text-bark-500">Schedule a new landscaping project</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-lg text-bark-900 mb-4">Job Details</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-bark-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Front Yard Mulch Installation"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-bark-700 mb-2">
                  Service Type *
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select service</option>
                  <option value="demo">Demo & Removal</option>
                  <option value="plant_installation">Plant Installation</option>
                  <option value="mulch">Mulch</option>
                  <option value="general_install">Basic Installation</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-bark-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-bark-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Describe the job scope and requirements..."
              />
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-lg text-bark-900 mb-4">Client</h2>
          
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-bark-700 mb-2">
              Select Client *
            </label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Choose a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName} - {client.address}, {client.city}
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="text-sm text-bark-500 mt-2">
                No clients yet.{' '}
                <Link href="/dashboard/clients/new" className="text-primary-600 hover:text-primary-700">
                  Add a client first
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Job Location */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-lg text-bark-900 mb-4">Job Location</h2>
          
          {selectedClient && (
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleAddressToggle(true)}
                className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  useClientAddress 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-bark-200 text-bark-600 hover:border-bark-300'
                }`}
              >
                Use Client Address
              </button>
              <button
                type="button"
                onClick={() => handleAddressToggle(false)}
                className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  !useClientAddress 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-bark-200 text-bark-600 hover:border-bark-300'
                }`}
              >
                Different Address
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="jobAddress" className="block text-sm font-medium text-bark-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                id="jobAddress"
                name="jobAddress"
                value={formData.jobAddress}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="jobCity" className="block text-sm font-medium text-bark-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="jobCity"
                  name="jobCity"
                  value={formData.jobCity}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="jobState" className="block text-sm font-medium text-bark-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="jobState"
                  name="jobState"
                  value={formData.jobState}
                  onChange={handleChange}
                  required
                  className="input-field"
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="jobZipCode" className="block text-sm font-medium text-bark-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="jobZipCode"
                  name="jobZipCode"
                  value={formData.jobZipCode}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Estimate */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-lg text-bark-900 mb-4">Schedule & Estimate</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-bark-700 mb-2">
                Scheduled Date
              </label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-bark-700 mb-2">
                Scheduled Time
              </label>
              <input
                type="time"
                id="scheduledTime"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-bark-700 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                step="0.5"
                min="0"
                className="input-field"
                placeholder="e.g., 4"
              />
            </div>
            <div>
              <label htmlFor="estimatedCost" className="block text-sm font-medium text-bark-700 mb-2">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="input-field"
                placeholder="e.g., 500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Job'}
          </button>
          <Link
            href="/dashboard/jobs"
            className="btn-outline flex-1 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
