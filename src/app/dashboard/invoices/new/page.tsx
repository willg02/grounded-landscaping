'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon,
} from '@heroicons/react/24/outline'

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zip: string
}

interface Job {
  id: string
  title: string
  serviceType: string
  status: string
  client: {
    id: string
    firstName: string
    lastName: string
  }
}

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  
  const [formData, setFormData] = useState({
    clientId: '',
    jobId: '',
    dueDate: '',
    notes: '',
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ])

  useEffect(() => {
    fetchClients()
    fetchJobs()
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

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        // Filter to only show completed or in_progress jobs
        setJobs(data.filter((job: Job) => 
          job.status === 'completed' || job.status === 'in_progress'
        ))
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId, jobId: '' }))
    const client = clients.find(c => c.id === clientId)
    setSelectedClient(client || null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addLineItem = () => {
    setLineItems(prev => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return
    setLineItems(prev => prev.filter(item => item.id !== id))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.0 // No tax by default, can be adjusted
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate line items
    const validLineItems = lineItems.filter(item => item.description && item.unitPrice > 0)
    if (validLineItems.length === 0) {
      toast.error('Please add at least one line item with a description and price')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lineItems: validLineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          total: calculateTotal(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create invoice')
      }

      toast.success('Invoice created successfully!')
      router.push('/dashboard/invoices')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredJobs = jobs.filter(job => 
    !formData.clientId || job.client.id === formData.clientId
  )

  // Set default due date to 30 days from now
  useEffect(() => {
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    setFormData(prev => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split('T')[0]
    }))
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-2 text-bark-500 hover:text-bark-700 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Invoices
        </Link>
        <h1 className="font-display text-2xl font-bold text-bark-900">Create New Invoice</h1>
        <p className="text-bark-500">Generate an invoice for a client</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client & Job Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-bark-900 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-bark-700 mb-1">
                Client *
              </label>
              <select
                id="clientId"
                name="clientId"
                required
                value={formData.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="input-field"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="jobId" className="block text-sm font-medium text-bark-700 mb-1">
                Related Job (Optional)
              </label>
              <select
                id="jobId"
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">No related job</option>
                {filteredJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.client.firstName} {job.client.lastName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-bark-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Billing Address Preview */}
          {selectedClient && (
            <div className="mt-4 p-4 bg-bark-50 rounded-lg">
              <p className="text-sm font-medium text-bark-700 mb-1">Bill To:</p>
              <p className="text-sm text-bark-600">
                {selectedClient.firstName} {selectedClient.lastName}<br />
                {selectedClient.address}<br />
                {selectedClient.city}, {selectedClient.state} {selectedClient.zip}
              </p>
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-bark-900">Line Items</h2>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-bark-500 pb-2 border-b border-bark-100">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items */}
            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-12 md:col-span-6">
                  <label className="md:hidden text-sm font-medium text-bark-500 mb-1 block">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Service or item description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="md:hidden text-sm font-medium text-bark-500 mb-1 block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="input-field text-right"
                    required
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="md:hidden text-sm font-medium text-bark-500 mb-1 block">
                    Unit Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bark-400">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="input-field text-right pl-6"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="col-span-3 md:col-span-1 flex items-center justify-end">
                  <span className="font-medium text-bark-900">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    className="p-2 text-bark-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 border-t border-bark-100 pt-4">
            <div className="flex justify-end">
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-bark-500">Subtotal</span>
                  <span className="font-medium text-bark-900">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-bark-500">Tax (0%)</span>
                  <span className="font-medium text-bark-900">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-bark-200 pt-2">
                  <span className="text-bark-900">Total</span>
                  <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-bark-900 mb-4">Additional Notes</h2>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input-field"
            placeholder="Payment terms, thank you message, or other notes to appear on the invoice..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/invoices"
            className="px-6 py-2.5 text-bark-600 hover:text-bark-800 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !formData.clientId}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}
