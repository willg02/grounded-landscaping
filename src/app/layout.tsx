import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Grounded Landscaping | Professional Landscaping Services',
  description: 'Professional landscaping services including demo, plant installation, mulch, and basic installation. Transform your outdoor space with Grounded Landscaping.',
  keywords: 'landscaping, plant installation, mulch, demo, lawn care, outdoor services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
