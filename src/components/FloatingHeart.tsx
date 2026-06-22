'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// Create heart shape
function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0.5)
  shape.bezierCurveTo(0, 0.5, -0.5, 0, -0.5, -0.3)
  shape.bezierCurveTo(-0.5, -0.6, -0.3, -1.1, 0, -1.4)
  shape.bezierCurveTo(0.3, -1.1, 0.5, -0.6, 0.5, -0.3)
  shape.bezierCurveTo(0.5, 0, 0, 0.5, 0, 0.5)
  return shape
}

function Heart() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const heartShape = useMemo(() => createHeartShape(), [])
  
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    
    // Breathing animation
    const scale = 1 + Math.sin(t * 1.5) * 0.08
    meshRef.current.scale.set(scale, scale, scale)
    
    // Gentle floating rotation
    meshRef.current.rotation.y = Math.sin(t * 0.8) * 0.15
    meshRef.current.rotation.z = Math.cos(t * 0.6) * 0.05
  })
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={1.2}>
        <extrudeGeometry 
          args={[
            heartShape,
            {
              depth: 0.12,
              bevelEnabled: true,
              bevelSegments: 3,
              bevelSize: 0.04,
              bevelThickness: 0.04,
              curveSegments: 24,
            }
          ]}
        />
        <meshStandardMaterial
          color="#D5C8EE"
          emissive="#9B7FC8"
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
    </Float>
  )
}

export default function FloatingHeart() {
  return (
    <div 
      className="w-20 h-20 md:w-24 md:h-24"
      style={{ 
        background: 'transparent',
        borderRadius: '0px'
      }}
    >
      <Canvas 
        gl={{ 
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[3, 3, 3]} intensity={0.4} color="#D5C8EE" />
        <pointLight position={[-3, -2, 2]} intensity={0.2} color="#9B7FC8" />
        <Heart />
      </Canvas>
    </div>
  )
}