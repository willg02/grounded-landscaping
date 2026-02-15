'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <a 
              href="#home" 
              onClick={(e) => scrollToSection(e, '#home')}
              className="-m-1.5 p-1.5 flex items-center gap-2 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                scrolled ? 'bg-primary-600' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className={`font-display font-bold text-xl transition-colors ${
                scrolled ? 'text-bark-900' : 'text-white'
              }`}>
                Grounded <span className={scrolled ? 'text-primary-600' : 'text-primary-300'}>Landscaping</span>
              </span>
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 transition-colors ${
                scrolled ? 'text-bark-700' : 'text-white'
              }`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`text-sm font-semibold leading-6 transition-colors hover:text-primary-400 ${
                  scrolled ? 'text-bark-700 hover:text-primary-600' : 'text-white/90'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <Link
              href="/plant-catalog"
              className={`text-sm font-semibold leading-6 py-2 transition-colors ${
                scrolled ? 'text-bark-600 hover:text-primary-600' : 'text-white/80 hover:text-white'
              }`}
            >
              Plant Catalog
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-semibold leading-6 py-2 transition-colors ${
                scrolled ? 'text-bark-600 hover:text-primary-600' : 'text-white/80 hover:text-white'
              }`}
            >
              Employee Login
            </Link>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, '#contact')}
              className="btn-primary text-sm py-2"
            >
              Get a Quote
            </a>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Slide-in panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-bark-900/10 lg:hidden"
              >
                <div className="flex items-center justify-between">
                  <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="-m-1.5 p-1.5 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="font-display font-bold text-lg text-bark-900">Grounded</span>
                  </a>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="-m-2.5 rounded-md p-2.5 text-bark-700 hover:bg-bark-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </motion.button>
                </div>
                
                <motion.div 
                  className="mt-6 flow-root"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                >
                  <div className="-my-6 divide-y divide-bark-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <motion.a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => scrollToSection(e, item.href)}
                          variants={{
                            open: { x: 0, opacity: 1 },
                            closed: { x: 50, opacity: 0 }
                          }}
                          whileHover={{ x: 8 }}
                          className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-bark-900 hover:bg-bark-50 transition-colors"
                        >
                          {item.name}
                        </motion.a>
                      ))}
                    </div>
                    <motion.div 
                      className="py-6 space-y-4"
                      variants={{
                        open: { opacity: 1 },
                        closed: { opacity: 0 }
                      }}
                    >
                      <Link
                        href="/plant-catalog"
                        className="block text-center text-sm font-semibold text-bark-600 hover:text-primary-600 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Plant Catalog
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block text-center text-sm font-semibold text-bark-600 hover:text-primary-600 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Employee Login
                      </Link>
                      <a
                        href="#contact"
                        onClick={(e) => scrollToSection(e, '#contact')}
                        className="block btn-primary text-center"
                      >
                        Get a Quote
                      </a>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
