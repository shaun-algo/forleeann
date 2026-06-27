'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  size: number
  color: string
  life: number
  decay: number
}

class Butterfly {
  x: number = 0
  y: number = 0
  targetX: number = 0
  targetY: number = 0
  vx: number = 0
  vy: number = 0
  angle: number = 0
  speed: number = 1.8
  targetSpeed: number = 1.8
  size: number = 18
  wingPhase: number = 0
  wingSpeed: number = 0.22
  color1: string
  color2: string
  color3: string
  targetTimer: number = 0
  flutterPhase: number = 0
  particles: Particle[] = []

  constructor(
    startX: number,
    startY: number,
    color1: string,
    color2: string,
    color3: string,
    size: number
  ) {
    this.x = startX
    this.y = startY
    this.targetX = startX
    this.targetY = startY
    this.color1 = color1
    this.color2 = color2
    this.color3 = color3
    this.size = size
    this.angle = Math.random() * Math.PI * 2
    this.wingPhase = Math.random() * Math.PI * 2
    this.flutterPhase = Math.random() * 100
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  private lerpAngle(a: number, b: number, t: number): number {
    let difference = b - a
    while (difference < -Math.PI) difference += Math.PI * 2
    while (difference > Math.PI) difference -= Math.PI * 2
    return a + difference * t
  }

  update(width: number, height: number) {
    const margin = 50

    // 1. Target Wandering
    this.targetTimer--
    const distToTarget = Math.hypot(this.targetX - this.x, this.targetY - this.y)
    if (this.targetTimer <= 0 || distToTarget < 40) {
      this.targetX = margin + Math.random() * (width - 2 * margin)
      this.targetY = margin + Math.random() * (height - 2 * margin)
      this.targetTimer = 120 + Math.random() * 180 // New target every 2-3 seconds
    }

    // 2. Base Steering towards target
    const angleToTarget = Math.atan2(this.targetY - this.y, this.targetX - this.x)
    this.angle = this.lerpAngle(this.angle, angleToTarget, 0.025)

    // 3. Realistic Erratic Flutter (combining high frequency noise and speed variation)
    this.flutterPhase += 0.2 + Math.random() * 0.15
    const flutterNoise = Math.sin(this.flutterPhase) * 0.12
    this.angle += flutterNoise

    // Steer away from boundaries
    let steerX = 0
    let steerY = 0
    if (this.x < margin) steerX = 1
    else if (this.x > width - margin) steerX = -1
    if (this.y < margin) steerY = 1
    else if (this.y > height - margin) steerY = -1

    if (steerX !== 0 || steerY !== 0) {
      const escapeAngle = Math.atan2(steerY, steerX)
      this.angle = this.lerpAngle(this.angle, escapeAngle, 0.08)
    }

    // Speed adjustment
    if (Math.random() < 0.015) {
      this.targetSpeed = 1.0 + Math.random() * 1.5 // 1.0 to 2.5 pixels per frame
    }
    this.speed = this.lerp(this.speed, this.targetSpeed, 0.05)

    // Apply Velocity
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed

    // 4. Wing Flapping Animation
    // Flapping speed depends on flight speed to look realistic
    this.wingSpeed = this.speed * 0.12 + 0.1
    this.wingPhase += this.wingSpeed

    // 5. Trail Particles
    if (Math.random() < 0.28) {
      this.particles.push({
        x: this.x - Math.cos(this.angle) * 8,
        y: this.y - Math.sin(this.angle) * 8,
        vx: (Math.random() - 0.5) * 0.4 - Math.cos(this.angle) * 0.15,
        vy: (Math.random() - 0.5) * 0.4 - Math.sin(this.angle) * 0.15 + 0.12, // subtle downward drift
        alpha: 0.6 + Math.random() * 0.4,
        size: 0.8 + Math.random() * 1.8,
        color: Math.random() < 0.5 ? this.color1 : this.color2,
        life: 1.0,
        decay: 0.012 + Math.random() * 0.012,
      })
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= p.decay
      p.alpha = Math.max(0, p.life)
      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 1. Draw trail particles first
    for (const p of this.particles) {
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // Wing flapping scale factor (0 to 1)
    const wingWidthScale = Math.abs(Math.sin(this.wingPhase))

    // 2. Draw Shadow (to create a realistic 3D altitude effect)
    ctx.save()
    ctx.translate(this.x + 10, this.y + 16) // offset shadow downwards/rightwards
    ctx.rotate(this.angle + Math.PI / 2)   // rotate facing direction (up is base)
    ctx.scale(0.8, 0.8)                     // shadow is slightly smaller
    ctx.globalAlpha = 0.16                  // soft transparent shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    this.drawButterflyShape(ctx, wingWidthScale, true)
    ctx.restore()

    // 3. Draw Actual Butterfly
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle + Math.PI / 2)
    this.drawButterflyShape(ctx, wingWidthScale, false)
    ctx.restore()
  }

  private drawButterflyShape(
    ctx: CanvasRenderingContext2D,
    wingScaleX: number,
    isShadow: boolean
  ) {
    const s = this.size

    if (isShadow) {
      // Simple shadow shapes (no complex gradients)
      // Left Wing
      ctx.save()
      ctx.scale(-wingScaleX, 1)
      this.drawWingPaths(ctx, s)
      ctx.fill()
      ctx.restore()

      // Right Wing
      ctx.save()
      ctx.scale(wingScaleX, 1)
      this.drawWingPaths(ctx, s)
      ctx.fill()
      ctx.restore()

      // Body
      ctx.beginPath()
      ctx.ellipse(0, 0, s * 0.12, s * 0.7, 0, 0, Math.PI * 2)
      ctx.fill()
      return
    }

    // Colors
    const wingGradient = ctx.createRadialGradient(0, 0, s * 0.1, 0, 0, s * 1.5)
    wingGradient.addColorStop(0, this.color1)
    wingGradient.addColorStop(0.5, this.color2)
    wingGradient.addColorStop(1, this.color3)

    // Left Wing
    ctx.save()
    ctx.scale(-wingScaleX, 1)
    ctx.fillStyle = wingGradient
    ctx.strokeStyle = '#1E1A2E'
    ctx.lineWidth = 0.8
    this.drawWingPaths(ctx, s)
    ctx.fill()
    ctx.stroke()
    this.drawWingVeins(ctx, s)
    ctx.restore()

    // Right Wing
    ctx.save()
    ctx.scale(wingScaleX, 1)
    ctx.fillStyle = wingGradient
    ctx.strokeStyle = '#1E1A2E'
    ctx.lineWidth = 0.8
    this.drawWingPaths(ctx, s)
    ctx.fill()
    ctx.stroke()
    this.drawWingVeins(ctx, s)
    ctx.restore()

    // Body (Thorax & Abdomen)
    ctx.fillStyle = '#1E1A2E'
    ctx.beginPath()
    ctx.ellipse(0, 0, s * 0.08, s * 0.65, 0, 0, Math.PI * 2)
    ctx.fill()

    // Head
    ctx.beginPath()
    ctx.arc(0, -s * 0.72, s * 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Antennae
    ctx.strokeStyle = '#1E1A2E'
    ctx.lineWidth = 0.6
    ctx.beginPath()
    // Left Antenna
    ctx.moveTo(0, -s * 0.75)
    ctx.quadraticCurveTo(-s * 0.25, -s * 1.1, -s * 0.35, -s * 1.05)
    // Right Antenna
    ctx.moveTo(0, -s * 0.75)
    ctx.quadraticCurveTo(s * 0.25, -s * 1.1, s * 0.35, -s * 1.05)
    ctx.stroke()
  }

  private drawWingPaths(ctx: CanvasRenderingContext2D, s: number) {
    // Forewing
    ctx.beginPath()
    ctx.moveTo(0, -s * 0.1)
    ctx.bezierCurveTo(s * 1.8, -s * 1.4, s * 2.3, -s * 0.2, s * 0.9, s * 0.2)
    ctx.bezierCurveTo(s * 0.4, s * 0.2, s * 0.1, s * 0.1, 0, 0)

    // Hindwing
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(s * 0.6, s * 0.1, s * 1.4, s * 0.4, s * 1.0, s * 1.2)
    ctx.bezierCurveTo(s * 0.7, s * 1.5, s * 0.1, s * 0.7, 0, s * 0.2)
  }

  private drawWingVeins(ctx: CanvasRenderingContext2D, s: number) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
    ctx.lineWidth = 0.5

    ctx.beginPath()
    // Forewing veins
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(s * 0.8, -s * 0.6, s * 1.5, -s * 0.8)
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(s * 0.9, -s * 0.2, s * 1.6, -s * 0.4)
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(s * 0.8, s * 0.1, s * 1.2, -s * 0.05)

    // Hindwing veins
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(s * 0.6, s * 0.4, s * 0.8, s * 0.9)
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(s * 0.3, s * 0.5, s * 0.4, s * 1.0)
    ctx.stroke()
  }
}

export default function Butterflies() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0

    // Butterflies configuration
    // 1. Lavender Theme: Deep Indigo -> Pastel Lilac -> Bright Lavender
    // 2. Warm Rose Theme: Deep Plum -> Dusty Rose -> Pale Gold
    const butterflies = [
      new Butterfly(
        150,
        120,
        'rgba(74, 33, 160, 0.85)',   // #4A21A0
        'rgba(155, 127, 200, 0.75)',  // #9B7FC8
        'rgba(213, 200, 238, 0.9)',   // #D5C8EE
        17                            // size
      ),
      new Butterfly(
        450,
        180,
        'rgba(110, 40, 100, 0.85)',   // Deep Plum
        'rgba(189, 176, 216, 0.85)',  // #BDB0D8
        'rgba(253, 231, 190, 0.9)',   // Soft Warm Gold
        15.5                          // size
      ),
    ]

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = canvas.width = parent.clientWidth
      height = canvas.height = parent.clientHeight

      // Put butterflies inside the resized screen
      butterflies.forEach((b) => {
        if (b.x > width) b.x = width * Math.random()
        if (b.y > height) b.y = height * Math.random()
        b.targetX = width * Math.random()
        b.targetY = height * Math.random()
      })
    }

    // Set initial size
    handleResize()

    // Listen for resize changes
    const resizeObserver = new ResizeObserver(() => handleResize())
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw all butterflies
      for (const b of butterflies) {
        b.update(width, height)
        b.draw(ctx)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
