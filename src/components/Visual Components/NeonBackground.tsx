'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Float } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingOrbProps {
  position: [number, number, number]
  color: string
  size: number
  speed: number
}

function FloatingOrb({ position, color, size, speed }: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.3
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  )
}

interface MagicalParticleProps {
  position: [number, number, number]
  color: string
}

function MagicalParticle({ position, color }: MagicalParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.8
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 1.5 + position[2]) * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.8}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function BackgroundElements() {
  const orbs = useMemo<FloatingOrbProps[]>(() => [
    { position: [-3, 2, -2], color: '#ff00ff', size: 0.3, speed: 0.8 },
    { position: [4, -1, -3], color: '#00ffff', size: 0.4, speed: 1.2 },
    { position: [-2, -3, -1], color: '#ffff00', size: 0.25, speed: 0.6 },
    { position: [3, 3, -4], color: '#ff3366', size: 0.35, speed: 1.0 },
    { position: [-4, 1, -2], color: '#33ff66', size: 0.3, speed: 0.9 },
    { position: [2, -2, -3], color: '#6633ff', size: 0.45, speed: 0.7 },
    { position: [-1, 4, -1], color: '#ff6633', size: 0.28, speed: 1.1 },
  ], [])

  const particles = useMemo(() => {
    const particleArray = []
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3366', '#33ff66', '#6633ff', '#ff6633']
    
    for (let i = 0; i < 30; i++) {
      particleArray.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8,
          -Math.random() * 5 - 1
        ] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    return particleArray
  }, [])

  return (
    <>
      {orbs.map((orb, index) => (
        <FloatingOrb key={`orb-${index}`} {...orb} />
      ))}
      {particles.map((particle, index) => (
        <MagicalParticle key={`particle-${index}`} {...particle} />
      ))}
    </>
  )
}

export default function NeonBackground() {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true)
  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check WebGL support for webview compatibility
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        console.warn('WebGL not supported, using fallback background')
        setHasWebGL(false)
      }
    } catch (e) {
      console.warn('Error checking WebGL support:', e)
      setHasWebGL(false)
    }
  }, [])

  // CSS-only fallback for webviews without WebGL
  if (!isClient || !hasWebGL) {
    return (
      <div className="fixed inset-0 -z-10">
        {/* Animated gradient background fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        
        {/* CSS animated orbs as fallback */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-bounce" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-pink-500/30 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }}
        onCreated={({ gl }) => {
          // Optimize for mobile/webview
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}
        gl={{ 
          antialias: false, // Disable for better performance in webview
          alpha: true,
          powerPreference: 'low-power' // Better for mobile webview
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <BackgroundElements />
      </Canvas>
      
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
    </div>
  )
}
