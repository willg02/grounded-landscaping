'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-bark-50 to-bark-100 dark:from-bark-900 dark:to-bark-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-bark-900 dark:text-white mb-4">
            Something Went Wrong
          </h1>
          
          <p className="text-bark-600 dark:text-bark-300 text-lg mb-8">
            We hit a snag while loading this page. Don't worry, our team has been notified 
            and we're working to fix it.
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.4 }}
              className="mb-8 p-4 bg-bark-900/5 dark:bg-bark-100/5 rounded-xl text-left overflow-auto max-h-40"
            >
              <p className="text-xs font-mono text-bark-500 dark:text-bark-400 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-bark-400 dark:text-bark-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-bark-300 dark:border-bark-600 text-bark-700 dark:text-bark-200 px-6 py-3 rounded-xl font-semibold hover:bg-bark-100 dark:hover:bg-bark-800 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
