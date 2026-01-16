'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  once?: boolean
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = '',
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        y: directionOffset[direction].y,
        x: directionOffset[direction].x,
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        x: 0,
      } : {}}
      transition={{ 
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
