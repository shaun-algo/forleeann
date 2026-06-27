'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

export default function PetalsExplosion() {
  const explosionSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize explosion sound
    explosionSound.current = new Audio('/mp3_effects/explotion.mp3')
    
    // Play explosion sound
    if (explosionSound.current) {
      explosionSound.current.play()
    }

    // Mixed lilac, pink, and purple petal colors
    const colors = [
      '#E6E6FA', '#D8BFD8', '#DDA0DD', '#DA70D6',
      '#EE82EE', '#FF69B4', '#FFB6C1', '#FFC0CB',
      '#FFD1DC', '#FFE4E9', '#F8BBD0', '#F48FB1',
      '#9B7FC8', '#BDB0D8', '#D5C8EE', '#C8B8E8',
      '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA'
    ]

    const heartShape = (confetti as any).shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    })

    // Create realistic petal explosion from side edges
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = {
      startVelocity: 45,
      spread: 180,
      ticks: 100,
      zIndex: 20,
      colors: colors,
      particleCount: 200,
      scalar: 1.5,
      gravity: 0.25,
      drift: 0,
      disableForReducedMotion: true,
      useWorker: true,
      shapes: [heartShape]
    }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    // Trigger explosion from left edge
    setTimeout(() => {
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 80 * (timeLeft / duration)
        
        confetti({
          ...defaults,
          particleCount,
          spread: randomInRange(120, 150),
          startVelocity: randomInRange(35, 55),
          scalar: randomInRange(1.0, 2.0),
          drift: randomInRange(-1.5, 1.5),
          origin: { x: 0, y: 0.5 }
        })
      }, 250)
    }, 500)

    // Trigger explosion from right edge
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 120,
        spread: 160,
        startVelocity: 50,
        scalar: randomInRange(1.2, 2.2),
        drift: randomInRange(-2, 2),
        origin: { x: 1, y: 0.5 }
      })
    }, 800)

    // Additional burst from left edge
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 100,
        spread: 140,
        startVelocity: 40,
        scalar: randomInRange(1.0, 2.0),
        drift: randomInRange(-1.5, 1.5),
        origin: { x: 0, y: 0.5 }
      })
    }, 1200)
  }, [])

  return null
}
