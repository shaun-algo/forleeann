'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 60 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      speeds[i] = Math.random() * 0.4 + 0.2
    }
    
    return { positions, speeds }
  }, [count])
  
  useFrame((state) => {
    if (!mesh.current) return
    const positions = mesh.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const speed = particles.speeds[i]
      
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime * speed + i) * 0.001
      positions[i3] += Math.cos(state.clock.elapsedTime * speed * 0.5 + i) * 0.0008
      
      if (positions[i3 + 1] > 4) positions[i3 + 1] = -4
      if (positions[i3] > 6) positions[i3] = -6
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true
    mesh.current.rotation.y = state.clock.elapsedTime * 0.015
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        color="#E8C9C2"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

function Ring() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.15
  })
  
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#C8877A" transparent opacity={0.25} />
      </mesh>
    </Float>
  )
}

function Cube() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.25
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  
  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshBasicMaterial color="#D4B8B0" transparent opacity={0.15} wireframe />
      </mesh>
    </Float>
  )
}

export default function ParticleBackground() {
  return (
    <div 
      className="absolute inset-0"
      style={{ opacity: 0.4 }}
    >
      <Canvas 
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }} 
        camera={{ position: [0, 0, 5], fov: 55 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <Particles count={50} />
        <Ring />
        <Cube />
      </Canvas>
    </div>
  )
}