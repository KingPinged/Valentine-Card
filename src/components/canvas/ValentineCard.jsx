import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, PerspectiveCamera, useHelper, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function ValentineCard() {
  const groupRef = useRef()
  const frontRef = useRef()
  const backRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef(null)
  const [cameraPosition] = useState(() => new THREE.Vector3(0, 0, 10))
  const [cardText, setCardText] = useState({
    to: 'To you',
    message: "Happy Valentine's Day!\n\nI love you so much!"
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const to = params.get('to')
      const message = params.get('message')

      if (to || message) {
        setCardText({
          to: to || 'To you',
          message: message || "Happy Valentine's Day!\n\nI love you so much!"
        })
      }
    }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Get normalized mouse position from Three.js pointer
    const mouseX = state.pointer.x
    const mouseY = state.pointer.y

    if (!isOpen) {
      // Smooth rotation based on mouse position
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.5, 0.1)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.5, 0.1)

      // Hovering animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }

    // Card opening animation
    if (isOpen) {
      frontRef.current.rotation.y = THREE.MathUtils.lerp(frontRef.current.rotation.y, Math.PI / 2, 0.1)
      state.camera.position.lerp(new THREE.Vector3(0, 0, 4), 0.05)

    } else {
      frontRef.current.rotation.y = THREE.MathUtils.lerp(frontRef.current.rotation.y, 0, 0.1)
      state.camera.position.lerp(cameraPosition, 0.05)
    }
  })

  const handleClick = () => {
    setIsOpen(!isOpen)

    if (audioRef.current) {
      audioRef.current.play()
    }

  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new window.Audio('/flip.mp3')

    }
  }, []);

  return (
    <>
      {/* Replace the sphere with proper lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 5]} intensity={1} color='#ff69b4' />
      <pointLight position={[0, -3, 5]} intensity={0.5} color='#fff' />

      <group ref={groupRef} onClick={handleClick}>
        {/* Back of card */}
        <mesh ref={backRef} position={[0, 0, -0.01]} castShadow receiveShadow>
          <planeGeometry args={[3, 4]} />
          <meshPhongMaterial
            color='#ff69b4'
            emissive='#ff69b4'
            emissiveIntensity={0.2}
            shininess={100}
            specular='#ffffff'
            toneMapped={false}
            side={THREE.DoubleSide}
            depthWrite={true}
          />
        </mesh>

        {/* Inside of card - adjust position and add depthTest */}
        <mesh position={[0, 0, -0.005]} castShadow receiveShadow>
          <planeGeometry args={[3, 4]} />
          <meshPhongMaterial
            color='#fff'
            emissive='#fff'
            emissiveIntensity={0.1}
            shininess={100}
            specular='#ff69b4'
            toneMapped={false}
            side={THREE.DoubleSide}
          />
          <Text
            position={[0, 0, 0.001]}
            fontSize={0.2}
            color='#ff1493'
            anchorX='center'
            anchorY='middle'
            font='/Pacifico-Regular.ttf'
            depthTest={true}
            renderOrder={1}
          >
            {cardText.to + ',\n' + cardText.message}
          </Text>
        </mesh>

        {/* Front of card - adjust material and text */}
        <group ref={frontRef} position={[1.5, 0, 0.01]}>
          <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
            <planeGeometry args={[3, 4]} />
            <meshPhongMaterial
              color='#ff69b4'
              emissive='#ff69b4'
              emissiveIntensity={0.2}
              shininess={100}
              specular='#ffffff'
              toneMapped={false}
              side={THREE.DoubleSide}
              depthWrite={true}
            />
            <Text
              position={[0, 0, 0.001]}
              fontSize={0.3}
              color='#fff'
              anchorX='center'
              anchorY='middle'
              font='/Pacifico-Regular.ttf'
              depthTest={true}
              renderOrder={2}
            >
              Happy{'\n'}
              Valentine&apos;s{'\n'}
              Day
            </Text>
          </mesh>
        </group>
      </group>
    </>
  )
}
