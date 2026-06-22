'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      setIsHovering(false)
    }

    // Hide default cursor on desktop
    document.body.style.cursor = 'none'

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mouseover', handleMouseOver)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.body.style.cursor = 'auto'
    }
  }, [isVisible])

  // Only render on client
  if (typeof window === 'undefined') return null

  return (
    <>
      {/* Dot cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          backgroundColor: '#9B7FC8',
          mixBlendMode: 'difference',
          left: 0,
          top: 0,
        }}
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          x: { type: "spring", stiffness: 500, damping: 28 },
          y: { type: "spring", stiffness: 500, damping: 28 },
          scale: { duration: 0.15 }
        }}
      />

      {/* Ring cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] hidden md:block border-2"
        style={{
          borderColor: 'rgba(155, 127, 200, 0.5)',
          left: 0,
          top: 0,
        }}
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isHovering ? 1.4 : 1,
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{
          x: { type: "spring", stiffness: 400, damping: 28 },
          y: { type: "spring", stiffness: 400, damping: 28 },
          scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.2 }
        }}
      />
    </>
  )
}
