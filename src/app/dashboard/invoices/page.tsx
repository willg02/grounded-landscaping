'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

interface Invoice {
  id: string
  invoiceNumber: string
  status: string
  subtotal: number
  tax: number
  total: number
  amountPaid: number
  issueDate: string
  dueDate: string
  paidDate: string | null
  client: {
    firstName: string
    lastName: string
  }
  job: {
    title: string
  } | null
}

const statusConfig: Record<string, { color: string, icon: any, label: string }> = {
  draft: { color: 'bg-gray-100 text-gray-700', icon: DocumentTextIcon, label: 'Draft' },
  sent: { color: 'bg-blue-100 text-blue-700', icon: ClockIcon, label: 'Sent' },
  paid: { color: 'bg-green-100 text-green-700', icon: CheckCircleIcon, label: 'Paid' },
  overdue: { color: 'bg-red-100 text-red-700', icon: ExclamationCircleIcon, label: 'Overdue' },
  cancelled: { color: 'bg-gray-100 text-gray-500', icon: DocumentTextIcon, label: 'Cancelled' },
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${invoice.client.firstName} ${invoice.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Calculate totals
  const totalOutstanding = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0)

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Invoices</h1>
          <p className="text-bark-500">Manage billing and payments</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <PlusIcon className="w-5 h-5" />
          Create Invoice
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <p className="text-bark-500 text-sm mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-bark-900">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <p className="text-bark-500 text-sm mb-1">Paid This Month</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <p className="text-bark-500 text-sm mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-bark-900">{invoices.length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bark-400" />
            <input
              type="text"
              placeholder="Search by invoice number or client..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-bark-500 mt-4">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-bark-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-8 h-8 text-bark-400" />
            </div>
            <h3 className="font-semibold text-bark-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
            </h3>
            <p className="text-bark-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter' 
                : 'Create your first invoice to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/dashboard/invoices/new" className="btn-primary">
                Create Your First Invoice
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bark-50 border-b border-bark-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-bark-700">Invoice</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-bark-700">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-bark-700">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-bark-700">Issue Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-bark-700">Due Date</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-bark-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bark-100">
                {filteredInvoices.map((invoice) => {
                  const config = statusConfig[invoice.status] || statusConfig.draft
                  return (
                    <tr key={invoice.id} className="hover:bg-bark-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link 
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                        {invoice.job && (
                          <p className="text-sm text-bark-500">{invoice.job.title}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-bark-900">
                          {invoice.client.firstName} {invoice.client.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <config.icon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-bark-600">
                        {formatDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-bark-600">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-bark-900">
                          {formatCurrency(invoice.total)}
                        </span>
                        {invoice.amountPaid > 0 && invoice.amountPaid < invoice.total && (
                          <p className="text-xs text-bark-500">
                            {formatCurrency(invoice.amountPaid)} paid
                          </p>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
