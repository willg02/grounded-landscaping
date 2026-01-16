'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bark-50 to-bark-100 dark:from-bark-900 dark:to-bark-950 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-display font-bold text-primary-600/20 dark:text-primary-400/20 leading-none select-none">
            404
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-bark-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          
          <p className="text-bark-600 dark:text-bark-300 text-lg max-w-md mx-auto mb-8">
            Oops! It looks like this page has gone off the beaten path. 
            Let's get you back to familiar ground.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
            >
              <HomeIcon className="w-5 h-5" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 border-2 border-bark-300 dark:border-bark-600 text-bark-700 dark:text-bark-200 px-6 py-3 rounded-xl font-semibold hover:bg-bark-100 dark:hover:bg-bark-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-earth-500/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </div>
  )
}
