'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface Job {
  id: string
  title: string
  serviceType: string
  status: string
  scheduledDate: string | null
  scheduledTime: string | null
  jobAddress: string
  jobCity: string
  client: {
    firstName: string
    lastName: string
  }
  assignedTo: {
    name: string
  } | null
}

const statusColors: Record<string, string> = {
  pending: 'border-l-yellow-500 bg-yellow-50',
  scheduled: 'border-l-blue-500 bg-blue-50',
  in_progress: 'border-l-purple-500 bg-purple-50',
  completed: 'border-l-green-500 bg-green-50',
}

export default function SchedulePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.filter((job: Job) => job.scheduledDate))
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get week dates
  const getWeekDates = () => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      if (!job.scheduledDate) return false
      const jobDate = new Date(job.scheduledDate)
      return jobDate.toDateString() === date.toDateString()
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Schedule</h1>
          <p className="text-bark-500">View and manage upcoming jobs</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <PlusIcon className="w-5 h-5" />
          Schedule Job
        </Link>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-semibold text-bark-900">
              {formatMonthYear()}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-bark-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-bark-600" />
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-bark-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-bark-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-bark-500 mt-4">Loading schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDates.map((date) => {
            const dayJobs = getJobsForDate(date)
            const today = isToday(date)
            
            return (
              <div
                key={date.toISOString()}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  today ? 'border-primary-300 ring-2 ring-primary-100' : 'border-bark-100'
                }`}
              >
                <div className={`px-4 py-3 text-center ${today ? 'bg-primary-600 text-white' : 'bg-bark-50'}`}>
                  <p className={`text-xs font-medium uppercase ${today ? 'text-primary-100' : 'text-bark-500'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-2xl font-bold ${today ? 'text-white' : 'text-bark-900'}`}>
                    {date.getDate()}
                  </p>
                </div>
                
                <div className="p-2 space-y-2 min-h-[200px]">
                  {dayJobs.length === 0 ? (
                    <p className="text-xs text-bark-400 text-center py-4">No jobs</p>
                  ) : (
                    dayJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/dashboard/jobs/${job.id}`}
                        className={`block p-3 rounded-lg border-l-4 hover:shadow-md transition-all ${statusColors[job.status]}`}
                      >
                        <p className="font-medium text-sm text-bark-900 truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-bark-600 truncate">
                          {job.client.firstName} {job.client.lastName}
                        </p>
                        {job.scheduledTime && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-bark-500">
                            <ClockIcon className="w-3 h-3" />
                            {job.scheduledTime}
                          </div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming Jobs List */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100">
        <div className="p-6 border-b border-bark-100">
          <h2 className="font-display text-xl font-semibold text-bark-900">Upcoming This Week</h2>
        </div>
        <div className="divide-y divide-bark-100">
          {weekDates.flatMap(date => getJobsForDate(date)).length === 0 ? (
            <div className="p-8 text-center text-bark-500">
              No jobs scheduled this week
            </div>
          ) : (
            weekDates.flatMap(date => 
              getJobsForDate(date).map(job => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="block p-4 hover:bg-bark-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-xs text-bark-500 uppercase">
                          {new Date(job.scheduledDate!).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="text-xl font-bold text-bark-900">
                          {new Date(job.scheduledDate!).getDate()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-bark-900">{job.title}</p>
                        <p className="text-sm text-bark-500">
                          {job.client.firstName} {job.client.lastName}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-bark-400">
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            {job.jobAddress}, {job.jobCity}
                          </span>
                          {job.scheduledTime && (
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {job.scheduledTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {job.assignedTo && (
                      <div className="text-right">
                        <p className="text-sm text-bark-500">Assigned to</p>
                        <p className="font-medium text-bark-700">{job.assignedTo.name}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )
          )}
        </div>
      </div>
    </div>
  )
}
