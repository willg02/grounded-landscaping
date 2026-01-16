'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  activeJobs: number
  totalClients: number
  pendingInvoices: number
  outstandingAmount: number
  revenueThisMonth: number
}

interface ScheduleItem {
  id: string
  client: string
  service: string
  time: string
  address: string
  status: string
}

interface ActivityItem {
  id: string
  action: string
  client: string
  amount: string | null
  time: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setTodaySchedule(data.todaySchedule || [])
        setRecentActivity(data.recentActivity || [])
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress'
      case 'scheduled': return 'Scheduled'
      case 'completed': return 'Completed'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  const statsConfig = [
    { 
      name: 'Active Jobs', 
      value: stats?.activeJobs ?? 0, 
      icon: CalendarDaysIcon, 
      href: '/dashboard/jobs', 
      format: (v: number) => v.toString(),
      trend: 'up' 
    },
    { 
      name: 'Total Clients', 
      value: stats?.totalClients ?? 0, 
      icon: UsersIcon, 
      href: '/dashboard/clients', 
      format: (v: number) => v.toString(),
      trend: 'up' 
    },
    { 
      name: 'Pending Invoices', 
      value: stats?.outstandingAmount ?? 0, 
      icon: DocumentTextIcon, 
      href: '/dashboard/invoices', 
      format: formatCurrency,
      subtitle: `${stats?.pendingInvoices ?? 0} invoices`,
      trend: 'neutral' 
    },
    { 
      name: 'Revenue (MTD)', 
      value: stats?.revenueThisMonth ?? 0, 
      icon: CurrencyDollarIcon, 
      href: '/dashboard/invoices', 
      format: formatCurrency,
      trend: 'up' 
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Team'}! 👋
            </h1>
            <p className="text-primary-100">
              Here's what's happening with Grounded Landscaping today.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div 
          variants={itemVariants}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400"
        >
          {error}
          <button onClick={fetchDashboardData} className="ml-2 underline hover:no-underline">
            Try again
          </button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.name}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Link
              href={stat.href}
              className="block bg-white dark:bg-bark-800 rounded-xl p-6 shadow-sm border border-bark-100 dark:border-bark-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-600 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                </div>
                {stat.trend === 'up' && (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                )}
              </div>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-bark-200 dark:bg-bark-700 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-bark-100 dark:bg-bark-700 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-bark-900 dark:text-white mb-1">
                    {stat.format(stat.value)}
                  </h3>
                  <p className="text-bark-500 dark:text-bark-400 text-sm font-medium">{stat.name}</p>
                  {stat.subtitle && (
                    <p className="text-bark-400 dark:text-bark-500 text-xs mt-2">{stat.subtitle}</p>
                  )}
                </>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-bark-800 rounded-xl shadow-sm border border-bark-100 dark:border-bark-700"
        >
          <div className="p-6 border-b border-bark-100 dark:border-bark-700">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-bark-900 dark:text-white">Today's Schedule</h2>
              <Link href="/dashboard/schedule" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-bark-100 dark:divide-bark-700">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 bg-bark-200 dark:bg-bark-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-bark-200 dark:bg-bark-700 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-bark-100 dark:bg-bark-700 rounded w-48"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : todaySchedule.length === 0 ? (
              <div className="p-12 text-center text-bark-500 dark:text-bark-400">
                <CalendarDaysIcon className="w-12 h-12 mx-auto mb-4 text-bark-300 dark:text-bark-600" />
                <p>No jobs scheduled for today</p>
              </div>
            ) : (
              todaySchedule.map((job) => (
                <div key={job.id} className="p-6 hover:bg-bark-50 dark:hover:bg-bark-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-bark-900 dark:text-white">{job.client}</h3>
                        <p className="text-bark-500 dark:text-bark-400 text-sm">{job.service}</p>
                        <p className="text-bark-400 dark:text-bark-500 text-sm mt-1">{job.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                      <p className="text-bark-600 dark:text-bark-300 font-medium mt-2">{job.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-bark-800 rounded-xl shadow-sm border border-bark-100 dark:border-bark-700"
        >
          <div className="p-6 border-b border-bark-100 dark:border-bark-700">
            <h2 className="font-display text-xl font-semibold text-bark-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-bark-100 dark:divide-bark-700">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-8 h-8 bg-bark-200 dark:bg-bark-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-bark-200 dark:bg-bark-700 rounded w-24 mb-1"></div>
                      <div className="h-2 bg-bark-100 dark:bg-bark-700 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center text-bark-500 dark:text-bark-400">
                <CheckCircleIcon className="w-10 h-10 mx-auto mb-3 text-bark-300 dark:text-bark-600" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-bark-50 dark:hover:bg-bark-700/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bark-100 dark:bg-bark-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-bark-500 dark:text-bark-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-bark-900 dark:text-white truncate">{activity.action}</p>
                      <p className="text-xs text-bark-500 dark:text-bark-400">{activity.client}</p>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">{activity.amount}</p>
                      )}
                      <p className="text-xs text-bark-400 dark:text-bark-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-bark-800 rounded-xl shadow-sm border border-bark-100 dark:border-bark-700 p-6"
      >
        <h2 className="font-display text-xl font-semibold text-bark-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/dashboard/jobs/new', icon: CalendarDaysIcon, label: 'New Job' },
            { href: '/dashboard/clients/new', icon: UsersIcon, label: 'Add Client' },
            { href: '/dashboard/invoices/new', icon: DocumentTextIcon, label: 'Create Invoice' },
            { href: '/dashboard/routing', icon: ExclamationTriangleIcon, label: 'Plan Route' },
          ].map((action) => (
            <motion.div
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={action.href}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-bark-200 dark:border-bark-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="font-medium text-bark-700 dark:text-bark-200">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
