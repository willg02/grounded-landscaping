'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
        setIsLoading(false)
      } else {
        toast.success('Welcome back!')
        // Use window.location for a full page navigation to ensure session is loaded
        window.location.href = callbackUrl
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-bark-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
          placeholder="you@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-bark-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
          placeholder="••••••••"
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Grounded <span className="text-primary-300">Landscaping</span>
            </span>
          </Link>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="font-display text-2xl font-bold text-bark-900 text-center mb-2">
            Employee Login
          </h1>
          <p className="text-bark-500 text-center mb-8">
            Sign in to access the dashboard
          </p>
          
          <Suspense fallback={<div className="text-center text-bark-500">Loading...</div>}>
            <LoginForm />
          </Suspense>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary-600 hover:text-primary-700">
              ← Back to website
            </Link>
          </div>
        </div>
        
        {/* Demo Credentials */}
        <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-primary-100 text-sm mb-2">Demo Credentials</p>
          <p className="text-white text-sm">
            <span className="text-primary-200">Email:</span> admin@grounded.com
          </p>
          <p className="text-white text-sm">
            <span className="text-primary-200">Password:</span> admin123
          </p>
        </div>
      </div>
    </div>
  )
}
