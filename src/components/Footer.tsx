'use client'

import Link from 'next/link'

export default function Footer() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-bark-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="font-display font-bold text-2xl">
                Grounded <span className="text-primary-400">Landscaping</span>
              </span>
            </div>
            <p className="text-bark-400 max-w-md leading-relaxed mb-6">
              Professional landscaping services that transform your outdoor spaces. 
              From demo to plant installation, we bring your vision to life with quality and care.
            </p>
            <div className="pt-6 border-t border-bark-800">
              <p className="text-bark-500 text-sm mb-1">Website designed & built by</p>
              <p className="font-display font-semibold text-primary-400">Frame & Function</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => scrollToSection(e, '#home')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => scrollToSection(e, '#services')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => scrollToSection(e, '#about')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => scrollToSection(e, '#contact')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="text-bark-400 hover:text-primary-400 transition-colors">
                  Employee Portal
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => scrollToSection(e, '#services')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  Demo & Removal
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => scrollToSection(e, '#services')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  Plant Installation
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => scrollToSection(e, '#services')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  Mulch & Ground Cover
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => scrollToSection(e, '#services')}
                  className="text-bark-400 hover:text-primary-400 transition-colors"
                >
                  Basic Installation
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-bark-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-bark-500 text-sm">
            © {new Date().getFullYear()} Grounded Landscaping. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-bark-500 hover:text-bark-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-bark-500 hover:text-bark-400 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
