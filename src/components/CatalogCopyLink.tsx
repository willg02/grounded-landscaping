'use client'

import { useMemo, useState } from 'react'

type CatalogCopyLinkProps = {
  path?: string
  className?: string
}

export default function CatalogCopyLink({
  path = '/catalog.json',
  className = 'btn-outline',
}: CatalogCopyLinkProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const fullUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return path
    }
    return `${window.location.origin}${path}`
  }, [path])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      setStatus('error')
      window.setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {status === 'copied' ? 'Copied link' : 'Copy JSON Link'}
    </button>
  )
}
