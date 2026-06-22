'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

// Clean Floating Box with textured backgrounds
function FloatingBox({ position, scale, rotationSpeed, color, floatSpeed, floatRange, patternType }: any) {
  const meshRef = useRef<THREE.LineSegments>(null)
  const initialRotation = useMemo(() => [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  ], [])

  // Create custom texture based on pattern type
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    if (patternType === 'gradient') {
      // Gradient pattern - ENHANCED
      const gradient = ctx.createLinearGradient(0, 0, 512, 512)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.5, color)
      gradient.addColorStop(1, '#ffffff')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)
    } else if (patternType === 'dots') {
      // Minimalist dots pattern - ENHANCED
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 512, 512)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          ctx.beginPath()
          ctx.arc(i * 25 + 12, j * 25 + 12, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    } else if (patternType === 'lines') {
      // Clean parallel lines - ENHANCED
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 512, 512)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 2
      for (let i = 0; i < 512; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, 512)
        ctx.stroke()
      }
    } else if (patternType === 'grid') {
      // Minimalist grid - ENHANCED
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 512, 512)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1.5
      for (let i = 0; i < 512; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, 512)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(512, i)
        ctx.stroke()
      }
    } else if (patternType === 'circles') {
      // Concentric circles - ENHANCED
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 512, 512)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 2
      for (let i = 50; i < 400; i += 50) {
        ctx.beginPath()
        ctx.arc(256, 256, i, 0, Math.PI * 2)
        ctx.stroke()
      }
    } else if (patternType === 'diagonal') {
      // Diagonal lines - ENHANCED
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 512, 512)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)'
      ctx.lineWidth = 2
      for (let i = -512; i < 1024; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + 512, 512)
        ctx.stroke()
      }
    } else {
      // Solid color fallback
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 512, 512)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [color, patternType])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    // Smooth rotation
    meshRef.current.rotation.x = initialRotation[0] + time * rotationSpeed[0]
    meshRef.current.rotation.y = initialRotation[1] + time * rotationSpeed[1]
    meshRef.current.rotation.z = initialRotation[2] + time * rotationSpeed[2]

    // Wide floating motion across the screen
    meshRef.current.position.y = position[1] + Math.sin(time * floatSpeed + position[0]) * floatRange
    meshRef.current.position.x = position[0] + Math.cos(time * floatSpeed * 0.5) * floatRange
    meshRef.current.position.z = position[2] + Math.sin(time * floatSpeed * 0.3) * (floatRange * 0.5)
  })

  return (
    <>
      {/* Outlined edges only - no fill */}
      <lineSegments ref={meshRef} position={position} scale={scale}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial
          attach="material"
          color="#ffffff"
          transparent
          opacity={0.6}
          linewidth={2}
        />
      </lineSegments>
    </>
  )
}

// Main Scene with just boxes
function Scene() {
  // Generate random box configurations - MAXIMIZED DIMENSIONS
  const boxes = useMemo(() => {
    const boxConfigs = []
    const boxCount = 13
    const patterns = ['gradient', 'dots', 'lines', 'grid', 'circles', 'diagonal']
    const colors = ['#7A68B0', '#9B7FC8', '#6858A0', '#8A78C0', '#5E5090']

    for (let i = 0; i < boxCount; i++) {
      boxConfigs.push({
        position: [
          (Math.random() - 0.5) * 16,  // Wider spread
          (Math.random() - 0.5) * 12,  // Taller spread
          -1 - Math.random() * 6       // Deeper spread
        ],
        scale: 1.2 + Math.random() * 1.8,  // Larger boxes (1.2 to 3.0)
        rotationSpeed: [
          0.08 + Math.random() * 0.12,
          0.08 + Math.random() * 0.12,
          0.04 + Math.random() * 0.08
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        floatSpeed: 0.25 + Math.random() * 0.35,
        floatRange: 0.8 + Math.random() * 1.2,  // Much larger roaming range
        patternType: patterns[Math.floor(Math.random() * patterns.length)]
      })
    }

    return boxConfigs
  }, [])

  return (
    <>
      {/* Clean ambient lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#D5C8EE" />

      {/* Render all boxes */}
      {boxes.map((box, index) => (
        <FloatingBox
          key={index}
          position={box.position}
          scale={box.scale}
          rotationSpeed={box.rotationSpeed}
          color={box.color}
          floatSpeed={box.floatSpeed}
          floatRange={box.floatRange}
          patternType={box.patternType}
        />
      ))}
    </>
  )
}

export default function ParticleOrbs() {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        opacity: 0.7,
        background: 'transparent'
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
