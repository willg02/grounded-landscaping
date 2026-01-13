'use client'

import { useState, useEffect } from 'react'
import { 
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
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
  jobState: string
  jobZip: string
  client: {
    firstName: string
    lastName: string
    phone: string
  }
  assignedTo: {
    name: string
  } | null
}

export default function RoutingPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
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

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getJobsForDate = (date: Date) => {
    return jobs
      .filter(job => {
        if (!job.scheduledDate) return false
        const jobDate = new Date(job.scheduledDate)
        return jobDate.toDateString() === date.toDateString()
      })
      .sort((a, b) => {
        if (!a.scheduledTime) return 1
        if (!b.scheduledTime) return -1
        return a.scheduledTime.localeCompare(b.scheduledTime)
      })
  }

  const dayJobs = getJobsForDate(selectedDate)

  const getGoogleMapsUrl = (job: Job) => {
    const address = encodeURIComponent(`${job.jobAddress}, ${job.jobCity}, ${job.jobState} ${job.jobZip}`)
    return `https://www.google.com/maps/search/?api=1&query=${address}`
  }

  const getFullRouteUrl = () => {
    if (dayJobs.length === 0) return ''
    
    // Start from first job, end at last job
    const addresses = dayJobs.map(job => 
      `${job.jobAddress}, ${job.jobCity}, ${job.jobState} ${job.jobZip}`
    )
    
    if (addresses.length === 1) {
      return getGoogleMapsUrl(dayJobs[0])
    }
    
    const origin = encodeURIComponent(addresses[0])
    const destination = encodeURIComponent(addresses[addresses.length - 1])
    const waypoints = addresses.slice(1, -1).map(a => encodeURIComponent(a)).join('|')
    
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
    if (waypoints) {
      url += `&waypoints=${waypoints}`
    }
    
    return url
  }

  const formatTime = (time: string | null) => {
    if (!time) return 'Time TBD'
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bark-900">Daily Routing</h1>
          <p className="text-bark-500">Plan your route for the day</p>
        </div>
        {dayJobs.length > 0 && (
          <a
            href={getFullRouteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <TruckIcon className="w-5 h-5" />
            Open Full Route
          </a>
        )}
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDay('prev')}
              className="p-2 hover:bg-bark-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-bark-600" />
            </button>
            <div className="text-center min-w-[200px]">
              <p className="text-sm text-bark-500">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <p className="text-xl font-bold text-bark-900">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => navigateDay('next')}
              className="p-2 hover:bg-bark-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-bark-600" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isToday(selectedDate)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-bark-600 hover:bg-bark-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={fetchJobs}
              className="p-2 hover:bg-bark-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <ArrowPathIcon className="w-5 h-5 text-bark-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-bark-900">{dayJobs.length}</p>
          <p className="text-sm text-bark-500">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-yellow-600">
            {dayJobs.filter(j => j.status === 'pending' || j.status === 'scheduled').length}
          </p>
          <p className="text-sm text-bark-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-purple-600">
            {dayJobs.filter(j => j.status === 'in_progress').length}
          </p>
          <p className="text-sm text-bark-500">In Progress</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-4">
          <p className="text-2xl font-bold text-green-600">
            {dayJobs.filter(j => j.status === 'completed').length}
          </p>
          <p className="text-sm text-bark-500">Completed</p>
        </div>
      </div>

      {/* Route List */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-bark-500 mt-4">Loading route...</p>
        </div>
      ) : dayJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-bark-100 p-12 text-center">
          <TruckIcon className="w-12 h-12 text-bark-300 mx-auto mb-4" />
          <p className="text-bark-500">No jobs scheduled for this day</p>
          <a
            href="/dashboard/jobs/new"
            className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Schedule a new job
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {dayJobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-bark-100 overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Stop Number */}
                <div className={`w-16 flex flex-col items-center justify-center ${
                  job.status === 'completed' ? 'bg-green-600' : 'bg-primary-600'
                } text-white`}>
                  {job.status === 'completed' ? (
                    <CheckCircleIcon className="w-8 h-8" />
                  ) : (
                    <>
                      <span className="text-xs uppercase opacity-75">Stop</span>
                      <span className="text-2xl font-bold">{index + 1}</span>
                    </>
                  )}
                </div>

                {/* Job Details */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-bark-900">{job.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.status]}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-bark-600 mt-1">
                        {job.client.firstName} {job.client.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-bark-500">
                      <ClockIcon className="w-4 h-4" />
                      <span className="font-medium">{formatTime(job.scheduledTime)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-2 text-sm text-bark-600">
                      <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>
                        {job.jobAddress}<br />
                        {job.jobCity}, {job.jobState} {job.jobZip}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <a
                        href={`tel:${job.client.phone}`}
                        className="px-3 py-1.5 text-sm font-medium text-bark-600 hover:text-bark-900 hover:bg-bark-100 rounded-lg transition-colors"
                      >
                        Call Client
                      </a>
                      <a
                        href={getGoogleMapsUrl(job)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        Navigate
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
        <h3 className="font-semibold text-primary-900 mb-2">Routing Tips</h3>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Jobs are sorted by scheduled time automatically</li>
          <li>• Click "Open Full Route" to get turn-by-turn directions for all stops</li>
          <li>• Click "Navigate" on individual jobs to open directions to that location</li>
          <li>• Use the "Call Client" button to quickly contact customers</li>
        </ul>
      </div>
    </div>
  )
}
