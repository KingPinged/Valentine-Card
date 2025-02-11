import { Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function TextAnimation({ children, onComplete }) {
  const [showChildren, setShowChildren] = useState(false)
  const [showClickText, setShowClickText] = useState(false)
  const textRef = useRef()
  const clickTextRef = useRef()
  const [progress, setProgress] = useState(0)

  // Create a dash pattern for the text
  useEffect(() => {
    if (textRef.current) {
      textRef.current.strokeDasharray = 120
      textRef.current.strokeDashoffset = 120
    }
  }, [])

  useFrame((state, delta) => {
    if (progress < 1 && !showChildren) {
      setProgress((prev) => Math.min(prev + delta * 0.2, 1))
      if (textRef.current) {
        textRef.current.strokeDashoffset = 120 * (1 - progress)
      }
      // When writing animation is complete, show the click text
      if (progress >= 1) {
        setTimeout(() => setShowClickText(true), 500)
      }
    }
  })

  const handleClick = () => {
    if (progress >= 1) {
      setShowChildren(true)
      if (onComplete) onComplete()
    }
  }

  return (
    <group onClick={handleClick}>
      <Text
        ref={textRef}
        position={[0, 0.5, 0]}
        fontSize={0.5}
        font="/Pacifico-Regular.ttf"
        color="#ff69b4"
        anchorX="center"
        anchorY="middle"
        strokeWidth={0.02}
        strokeColor="#ff69b4"
        fillOpacity={progress}
      >
        Ready?
      </Text>

      {showClickText && !showChildren && (
        <Text
          ref={clickTextRef}
          position={[0, 0, 0]}
          fontSize={0.3}
          font="/Pacifico-Regular.ttf"
          color="#ff69b4"
          anchorX="center"
          anchorY="middle"
          opacity={0.7}
        >
          Click anywhere
        </Text>
      )}

      {showChildren && children}
    </group>
  )
} 
