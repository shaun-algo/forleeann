'use client'

import { useEffect, useRef } from 'react'

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/mp3_effects/fireworks.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0
    audioRef.current.preload = 'auto'

    let fadeInterval: NodeJS.Timeout | null = null
    const targetVolume = 1.0
    const fadeStep = 0.02
    const fadeIntervalMs = 50

    const fadeIn = () => {
      if (!audioRef.current) return

      // Clear any existing fade
      if (fadeInterval) clearInterval(fadeInterval)

      // Start playing if not already playing
      if (audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err)
          // Retry on user interaction
          const retryPlay = () => {
            if (audioRef.current) {
              audioRef.current.play().catch(() => {})
              fadeIn()
            }
            document.removeEventListener('click', retryPlay)
            document.removeEventListener('touchstart', retryPlay)
          }
          document.addEventListener('click', retryPlay, { once: true })
          document.addEventListener('touchstart', retryPlay, { once: true })
        })
      }

      fadeInterval = setInterval(() => {
        if (!audioRef.current) {
          if (fadeInterval) clearInterval(fadeInterval)
          return
        }

        if (audioRef.current.volume < targetVolume) {
          audioRef.current.volume = Math.min(audioRef.current.volume + fadeStep, targetVolume)
        } else {
          if (fadeInterval) clearInterval(fadeInterval)
        }
      }, fadeIntervalMs)
    }

    const fadeOut = () => {
      if (!audioRef.current) return

      // Clear any existing fade
      if (fadeInterval) clearInterval(fadeInterval)

      fadeInterval = setInterval(() => {
        if (!audioRef.current) {
          if (fadeInterval) clearInterval(fadeInterval)
          return
        }

        if (audioRef.current.volume > 0) {
          audioRef.current.volume = Math.max(audioRef.current.volume - fadeStep, 0)
        } else {
          if (fadeInterval) clearInterval(fadeInterval)
          // Keep playing but muted, so it continues seamlessly
          // Don't pause or reset, just keep it at 0 volume
        }
      }, fadeIntervalMs)
    }

    // Intersection observer to detect when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fadeIn()
          } else {
            fadeOut()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let fireworks: Firework[] = []
    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        canvasWidth = window.innerWidth
        canvasHeight = window.innerHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class for explosion
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      alpha: number
      color: string
      decay: number

      constructor(x: number, y: number, color: string, vx: number, vy: number) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.alpha = 1
        this.color = color
        this.decay = Math.random() * 0.012 + 0.008 // slightly longer lifetime
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.02 // lower gravity to preserve heart shape longer
        this.alpha -= this.decay
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color

        // Draw a tiny heart
        const size = 3
        ctx.beginPath()
        ctx.moveTo(this.x, this.y - size / 4)
        ctx.bezierCurveTo(this.x - size / 2, this.y - size, this.x - size, this.y - size / 3, this.x, this.y + size)
        ctx.bezierCurveTo(this.x + size, this.y - size / 3, this.x + size / 2, this.y - size, this.x, this.y - size / 4)
        ctx.fill()

        ctx.restore()
      }
    }

    // Firework class
    class Firework {
      x: number
      y: number
      targetY: number
      vx: number
      vy: number
      color: string
      exploded: boolean

      constructor(x: number, targetY: number, color: string) {
        this.x = x
        this.y = canvasHeight
        this.targetY = targetY
        this.vx = (Math.random() - 0.5) * 2
        this.vy = -Math.random() * 3 - 8
        this.color = color
        this.exploded = false
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.1

        if (this.vy >= 0 || this.y <= this.targetY) {
          this.exploded = true
          this.explode()
        }
      }

      explode() {
        const particleCount = 100
        for (let i = 0; i < particleCount; i++) {
          // Angle around the circle to evaluate parametric heart
          const t = (i / particleCount) * Math.PI * 2

          // Heart formula coordinates
          const heartX = 16 * Math.pow(Math.sin(t), 3)
          const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))

          // Add minor speed randomisation for organic sparkliness
          const speed = 0.22 * (0.85 + Math.random() * 0.3)
          const vx = heartX * speed
          const vy = heartY * speed

          particles.push(new Particle(this.x, this.y, this.color, vx, vy))
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.fillStyle = this.color

        // Draw a small rising heart
        const size = 4
        ctx.beginPath()
        ctx.moveTo(this.x, this.y - size / 4)
        ctx.bezierCurveTo(this.x - size / 2, this.y - size, this.x - size, this.y - size / 3, this.x, this.y + size)
        ctx.bezierCurveTo(this.x + size, this.y - size / 3, this.x + size / 2, this.y - size, this.x, this.y - size / 4)
        ctx.fill()

        ctx.restore()
      }
    }

    const colors = [
      '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff',
      '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24', '#f368e0'
    ]

    const createFirework = () => {
      const x = Math.random() * canvasWidth
      const targetY = Math.random() * (canvasHeight * 0.5) + canvasHeight * 0.1
      const color = colors[Math.floor(Math.random() * colors.length)]
      fireworks.push(new Firework(x, targetY, color))
    }

    // Create fireworks periodically
    let lastFirework = 0
    const fireworkInterval = 800

    const animate = (timestamp: number) => {
      if (!canvas || !ctx) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Create new fireworks
      if (timestamp - lastFirework > fireworkInterval) {
        createFirework()
        lastFirework = timestamp
      }

      // Update and draw fireworks
      fireworks = fireworks.filter(fw => !fw.exploded)
      fireworks.forEach(fw => {
        fw.update()
        fw.draw(ctx)
      })

      // Update and draw particles
      particles = particles.filter(p => p.alpha > 0)
      particles.forEach(p => {
        p.update()
        p.draw(ctx)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
      if (sectionRef.current) {
        observer.disconnect()
      }
      if (fadeInterval) clearInterval(fadeInterval)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className="relative w-full h-[600px] bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h2 className="font-serif text-4xl md:text-6xl text-white/90 mb-4">
            Better Together
          </h2>
        </div>
      </div>
    </div>
  )
}
