'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { 
  CheckCircleIcon, 
  SparklesIcon,
  WrenchScrewdriverIcon,
  SunIcon,
  HomeModernIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const services = [
  {
    name: 'Plant Installation',
    description: 'Expert installation of trees, shrubs, ornamental grasses, and flowering plants. We design and install beautiful, thriving landscapes tailored to your property.',
    icon: SparklesIcon,
    features: ['Trees & shrubs', 'Ornamental grasses', 'Perennials & annuals', 'Native plants'],
  },
  {
    name: 'Bed Design & Creation',
    description: 'From scratch or reimagined—we design and build custom landscape beds with proper grading, soil prep, and professional edging.',
    icon: HomeModernIcon,
    features: ['New bed creation', 'Bed redesign', 'Soil amendment', 'Professional edging'],
  },
  {
    name: 'Mulch & Pine Straw',
    description: 'Quality mulch and pine straw installation for healthier plants, moisture retention, and a polished, finished look.',
    icon: SunIcon,
    features: ['Premium hardwood mulch', 'Pine straw', 'Colored mulch options', 'Weed barrier'],
  },
  {
    name: 'Tear-Out & Refresh',
    description: 'Out with the old, in with the new. We remove overgrown or tired landscaping and prepare your beds for a fresh start.',
    icon: WrenchScrewdriverIcon,
    features: ['Old plant removal', 'Overgrowth clearing', 'Bed cleanup', 'Site preparation'],
  },
]

const benefits = [
  { title: 'Licensed & Insured', description: 'Full coverage for your peace of mind' },
  { title: 'Free Estimates', description: 'No obligation project quotes' },
  { title: 'Installation Experts', description: 'We focus on installs, not maintenance' },
  { title: 'Quality Plants', description: 'Healthy stock from trusted nurseries' },
  { title: 'Clean Worksite', description: 'We leave it better than we found it' },
  { title: 'Satisfaction Guaranteed', description: 'Your happiness is our priority' },
]

const serviceOptions = [
  { value: 'plants', label: 'Plant Installation' },
  { value: 'beds', label: 'Bed Design & Creation' },
  { value: 'mulch', label: 'Mulch & Pine Straw' },
  { value: 'tearout', label: 'Tear-Out & Refresh' },
  { value: 'complete', label: 'Complete Landscape Makeover' },
]

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Message sent! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-bark-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-earth-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              <span className="text-primary-200 text-sm font-medium">Professional Landscape Installation</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Beautiful Landscapes,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-earth-300">
                Professionally Installed
              </span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-primary-100/90 max-w-2xl leading-relaxed">
              We design and install stunning plant beds, handle tear-outs, and finish with quality mulch or pine straw. Your landscape transformation starts here.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="group inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-lg shadow-black/20"
              >
                Get Free Quote
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#services" 
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                View Services
              </a>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">100+</div>
                <div className="text-primary-200 text-sm">Projects Done</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">5★</div>
                <div className="text-primary-200 text-sm">Customer Rating</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">24hr</div>
                <div className="text-primary-200 text-sm">Response Time</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">What We Do</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-bark-900 mb-6">
              Installation Services
            </h2>
            <p className="text-xl text-bark-600">
              We focus on what we do best—designing, installing, and refreshing landscape beds. No maintenance, just beautiful transformations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <div
                key={service.name}
                className="group relative bg-gradient-to-br from-bark-50 to-white rounded-2xl p-8 border border-bark-100 hover:border-primary-200 hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-bark-900 mb-3">
                    {service.name}
                  </h3>
                  
                  <p className="text-bark-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-bark-700">
                        <CheckCircleIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-24 bg-gradient-to-b from-white to-bark-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">How We Work</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-bark-900 mb-6">
              Simple Process, Beautiful Results
            </h2>
            <p className="text-xl text-bark-600">
              From first contact to final walkthrough, we make your landscape project stress-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Free Consultation', desc: 'We visit your property, discuss your vision, and provide a detailed quote—no obligation.' },
              { step: '02', title: 'Design & Plan', desc: 'We lay out the design, select plants, and schedule your installation date.' },
              { step: '03', title: 'Professional Install', desc: 'Our crew handles tear-out, bed prep, planting, and mulch. We work clean and efficient.' },
              { step: '04', title: 'Final Walkthrough', desc: 'We review the work together, answer questions, and leave your property spotless.' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-100" />
                )}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-bark-900 mb-2">{item.title}</h3>
                  <p className="text-bark-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About / Why Choose Us Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-bark-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">About Us</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-bark-900 mb-6">
                Why Choose <span className="text-primary-600">Grounded?</span>
              </h2>
              
              <p className="text-lg text-bark-600 mb-6 leading-relaxed">
                At Grounded Landscaping, we specialize in one thing: making your outdoor space look incredible. We're not a maintenance company—we're installers who take pride in transforming tired landscapes into something you'll love coming home to.
              </p>
              
              <p className="text-lg text-bark-600 mb-8 leading-relaxed">
                Whether you need a complete landscape makeover, fresh plant beds, or just a clean mulch refresh, our team handles every detail from design to final cleanup.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-bark-900 text-sm">{benefit.title}</h4>
                      <p className="text-bark-500 text-xs">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative card stack */}
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-earth-200 rounded-3xl transform rotate-3" />
                <div className="absolute inset-0 bg-gradient-to-br from-earth-200 to-primary-200 rounded-3xl transform -rotate-3" />
                <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-10 text-white shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  
                  <h3 className="font-display text-3xl font-bold mb-4">
                    Ready for a Landscape Makeover?
                  </h3>
                  
                  <p className="text-primary-100 mb-8 leading-relaxed">
                    Whether it's a few new plants or a complete bed redesign, we'll handle everything. Free estimates, no pressure.
                  </p>
                  
                  <a 
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Get Started
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              {/* Frame & Function credit */}
              <div className="mt-8 text-center">
                <p className="text-bark-400 text-sm">Website by</p>
                <p className="font-display font-semibold text-bark-600">Frame & Function</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-24 bg-bark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="text-white">
              <span className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Let's Start Your Project
              </h2>
              
              <p className="text-xl text-bark-300 mb-12 leading-relaxed">
                Ready to transform your outdoor space? Get in touch for a free estimate. We typically respond within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-bark-400 text-sm">Email us</p>
                    <a href="mailto:management@bygrounded.com" className="text-xl font-semibold text-white hover:text-primary-400 transition-colors">
                      management@bygrounded.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-bark-400 text-sm">Service Area</p>
                    <p className="text-xl font-semibold text-white">Charlotte, NC</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-bark-800 rounded-2xl">
                <h4 className="font-semibold text-white mb-3">Business Hours</h4>
                <div className="space-y-1 text-bark-300">
                  <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
                  <p>Saturday: 8:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
                <h3 className="font-display text-2xl font-bold text-bark-900 mb-2">
                  Request a Free Quote
                </h3>
                <p className="text-bark-500 mb-8">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-bark-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-bark-700 mb-2">
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
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bark-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-bark-700 mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select a service</option>
                      {serviceOptions.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-bark-700 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/30"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
