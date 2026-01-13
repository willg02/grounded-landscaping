'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function NewEmployeePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'employee',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, password }))
    setShowPassword(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create employee')
      }

      toast.success('Employee added successfully!')
      router.push('/dashboard/employees')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create employee')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/employees"
          className="inline-flex items-center gap-2 text-bark-500 hover:text-bark-700 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Employees
        </Link>
        <h1 className="font-display text-2xl font-bold text-bark-900">Add New Employee</h1>
        <p className="text-bark-500">Create a new team member account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-bark-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-bark-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bark-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="john@grounded.com"
              />
              <p className="text-xs text-bark-500 mt-1">
                This will be used to log in to the dashboard
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-bark-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-bark-700 mb-1">
                Role *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-xs text-bark-500 mt-1">
                Admins and managers can add new employees and manage all data
              </p>
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
          <h2 className="font-semibold text-bark-900 mb-4">Login Credentials</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bark-700 mb-1">
                Password *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bark-400 hover:text-bark-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-bark-500 mt-1">
                Make sure to share this password with the employee securely
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
          <h3 className="font-semibold text-primary-900 mb-2">Onboarding Tips</h3>
          <ul className="text-sm text-primary-700 space-y-1">
            <li>• After creating the account, share the login credentials securely</li>
            <li>• New employees can use their email and password to log in at /login</li>
            <li>• Consider having them change their password on first login</li>
            <li>• Assign their first job to get them started in the system</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/employees"
            className="px-6 py-2.5 text-bark-600 hover:text-bark-800 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  )
}
