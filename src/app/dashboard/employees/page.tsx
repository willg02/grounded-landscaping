'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  _count?: {
    assignedJobs: number
  }
}

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  employee: 'Employee',
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  employee: 'bg-green-100 text-green-800',
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter
    return matchesSearch && matchesRole
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
          <h1 className="font-display text-2xl font-bold text-bark-900">Employees</h1>
          <p className="text-bark-500">Manage your team members</p>
        </div>
        <Link
          href="/dashboard/employees/new"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <PlusIcon className="w-5 h-5" />
          Add Employee
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-bark-900">{employees.length}</p>
          <p className="text-sm text-bark-500">Total Team</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-purple-600">
            {employees.filter(e => e.role === 'admin').length}
          </p>
          <p className="text-sm text-bark-500">Admins</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-blue-600">
            {employees.filter(e => e.role === 'manager').length}
          </p>
          <p className="text-sm text-bark-500">Managers</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-green-600">
            {employees.filter(e => e.role === 'employee').length}
          </p>
          <p className="text-sm text-bark-500">Employees</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-bark-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-bark-500 mt-4">Loading employees...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-12 text-center">
          <UserCircleIcon className="w-12 h-12 text-bark-300 mx-auto mb-4" />
          <p className="text-bark-500">No employees found</p>
          <Link href="/dashboard/employees/new" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
            Add your first employee
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl shadow-sm border border-bark-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary-600">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-bark-900 truncate">{employee.name}</h3>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${roleColors[employee.role]}`}>
                      {roleLabels[employee.role]}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-bark-600">
                    <EnvelopeIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center gap-2 text-sm text-bark-600">
                      <PhoneIcon className="w-4 h-4 shrink-0" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-bark-500">
                    <CalendarIcon className="w-4 h-4 shrink-0" />
                    <span>Joined {formatDate(employee.createdAt)}</span>
                  </div>
                  {employee._count && (
                    <div className="flex items-center gap-2 text-sm text-bark-500">
                      <BriefcaseIcon className="w-4 h-4 shrink-0" />
                      <span>{employee._count.assignedJobs} assigned jobs</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-bark-100 px-6 py-3 bg-bark-50 flex items-center gap-2">
                <a
                  href={`mailto:${employee.email}`}
                  className="flex-1 text-center py-1.5 text-sm font-medium text-bark-600 hover:text-bark-900 hover:bg-bark-100 rounded-lg transition-colors"
                >
                  Email
                </a>
                {employee.phone && (
                  <a
                    href={`tel:${employee.phone}`}
                    className="flex-1 text-center py-1.5 text-sm font-medium text-bark-600 hover:text-bark-900 hover:bg-bark-100 rounded-lg transition-colors"
                  >
                    Call
                  </a>
                )}
                <Link
                  href={`/dashboard/employees/${employee.id}`}
                  className="flex-1 text-center py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
