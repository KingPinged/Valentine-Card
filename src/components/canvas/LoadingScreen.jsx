import { Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [showClick, setShowClick] = useState(false)

  useEffect(() => {
    // Create a loading manager to track all Three.js asset loading
    const manager = new THREE.LoadingManager()

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progressRatio = itemsLoaded / itemsTotal
      setProgress(progressRatio)

      if (progressRatio === 1) {
        setTimeout(() => {
          setShowClick(true)
        }, 500)
      }
    }

    // Set the global loading manager
    THREE.DefaultLoadingManager = manager
  }, [])

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
