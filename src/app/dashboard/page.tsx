'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

const stats = [
  { name: 'Active Jobs', value: '12', icon: CalendarDaysIcon, href: '/dashboard/jobs', change: '+2 from last week', trend: 'up' },
  { name: 'Total Clients', value: '48', icon: UsersIcon, href: '/dashboard/clients', change: '+5 this month', trend: 'up' },
  { name: 'Pending Invoices', value: '8', icon: DocumentTextIcon, href: '/dashboard/invoices', change: '$4,250 outstanding', trend: 'neutral' },
  { name: 'Revenue (MTD)', value: '$12,450', icon: CurrencyDollarIcon, href: '/dashboard/invoices', change: '+18% vs last month', trend: 'up' },
]

const todaySchedule = [
  { id: 1, client: 'Johnson Residence', service: 'Mulch Installation', time: '8:00 AM', address: '123 Oak Street', status: 'in_progress' },
  { id: 2, client: 'Smith Property', service: 'Plant Installation', time: '11:00 AM', address: '456 Maple Ave', status: 'scheduled' },
  { id: 3, client: 'Williams Home', service: 'Demo & Removal', time: '2:00 PM', address: '789 Pine Road', status: 'scheduled' },
]

const recentActivity = [
  { id: 1, action: 'Invoice #1024 paid', client: 'Anderson Family', amount: '$850', time: '2 hours ago' },
  { id: 2, action: 'New lead received', client: 'Contact Form', amount: null, time: '4 hours ago' },
  { id: 3, action: 'Job completed', client: 'Miller Residence', amount: '$1,200', time: 'Yesterday' },
  { id: 4, action: 'Invoice sent', client: 'Davis Property', amount: '$650', time: 'Yesterday' },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'scheduled': return 'bg-yellow-100 text-yellow-700'
      case 'completed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress'
      case 'scheduled': return 'Scheduled'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Team'}! 👋
        </h1>
        <p className="text-primary-100">
          Here's what's happening with Grounded Landscaping today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-bark-100 hover:shadow-md hover:border-primary-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <stat.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              {stat.trend === 'up' && (
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
              )}
            </div>
            <h3 className="text-3xl font-bold text-bark-900 mb-1">{stat.value}</h3>
            <p className="text-bark-500 text-sm font-medium">{stat.name}</p>
            <p className="text-bark-400 text-xs mt-2">{stat.change}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-bark-100">
          <div className="p-6 border-b border-bark-100">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-bark-900">Today's Schedule</h2>
              <Link href="/dashboard/schedule" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-bark-100">
            {todaySchedule.map((job) => (
              <div key={job.id} className="p-6 hover:bg-bark-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-bark-900">{job.client}</h3>
                      <p className="text-bark-500 text-sm">{job.service}</p>
                      <p className="text-bark-400 text-sm mt-1">{job.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusLabel(job.status)}
                    </span>
                    <p className="text-bark-600 font-medium mt-2">{job.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {todaySchedule.length === 0 && (
            <div className="p-12 text-center text-bark-500">
              <CalendarDaysIcon className="w-12 h-12 mx-auto mb-4 text-bark-300" />
              <p>No jobs scheduled for today</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-bark-100">
          <div className="p-6 border-b border-bark-100">
            <h2 className="font-display text-xl font-semibold text-bark-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-bark-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-bark-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-bark-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircleIcon className="w-4 h-4 text-bark-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-bark-900 truncate">{activity.action}</p>
                    <p className="text-xs text-bark-500">{activity.client}</p>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="text-sm font-semibold text-green-600">{activity.amount}</p>
                    )}
                    <p className="text-xs text-bark-400">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-6">
        <h2 className="font-display text-xl font-semibold text-bark-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/jobs/new"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-bark-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-primary-600" />
            </div>
            <span className="font-medium text-bark-700">New Job</span>
          </Link>
          <Link
            href="/dashboard/clients/new"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-bark-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-primary-600" />
            </div>
            <span className="font-medium text-bark-700">Add Client</span>
          </Link>
          <Link
            href="/dashboard/invoices/new"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-bark-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-primary-600" />
            </div>
            <span className="font-medium text-bark-700">Create Invoice</span>
          </Link>
          <Link
            href="/dashboard/routing"
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-bark-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-primary-600" />
            </div>
            <span className="font-medium text-bark-700">Plan Route</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
