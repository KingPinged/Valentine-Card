import { Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [showClick, setShowClick] = useState(false)
  useFrame((state, delta) => {
    if (progress < 1) {
      setProgress((prev) => Math.min(prev + delta * 0.8, 1))
    }
  })

  useEffect(() => {
    if (progress >= 1) {
      setTimeout(() => {
        setShowClick(true)
      }, 500)
    }
  }, [progress])

  const handleClick = () => {
    if (progress >= 1 && showClick && onComplete) {
      onComplete()
    }
  }

  return (
    <group onClick={handleClick}>

      {/* Progress text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.2}
        font="/Pacifico-Regular.ttf"
        color="#ff69b4"
        anchorX="center"
        anchorY="middle"
      >
        {Math.floor(progress * 100)}%
      </Text>

      {/* Click anywhere text */}
      {showClick && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.2}
          font="/Pacifico-Regular.ttf"
          color="#ff69b4"
          anchorX="center"
          anchorY="middle"
          opacity={0.7}
        >
          Click anywhere
        </Text>
      )}
    </group>
  )
} 
