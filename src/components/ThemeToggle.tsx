'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SunIcon, MoonIcon, ComputerDesktopIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle({ variant = 'dropdown' }: { variant?: 'dropdown' | 'simple' }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  ] as const

  const currentTheme = themes.find(t => t.value === theme)
  const CurrentIcon = currentTheme?.icon || SunIcon

  if (variant === 'simple') {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg bg-bark-100 dark:bg-bark-800 text-bark-600 dark:text-bark-300 hover:bg-bark-200 dark:hover:bg-bark-700 transition-colors"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {resolvedTheme === 'dark' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bark-100 dark:bg-bark-800 text-bark-600 dark:text-bark-300 hover:bg-bark-200 dark:hover:bg-bark-700 transition-colors"
        aria-label="Select theme"
      >
        <CurrentIcon className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:block">{currentTheme?.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-bark-800 rounded-xl shadow-lg border border-bark-200 dark:border-bark-700 overflow-hidden z-50"
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.value
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isActive 
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                        : 'text-bark-700 dark:text-bark-300 hover:bg-bark-50 dark:hover:bg-bark-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{themeOption.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTheme"
                        className="ml-auto w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"
                      />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
