import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, PerspectiveCamera, useHelper, useTexture } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

export function ValentineCard() {
  const groupRef = useRef()
  const frontRef = useRef()
  const backRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef(null)
  const [cameraPosition] = useState(() => {
    // Check if we're on mobile (window width < 768px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    return new THREE.Vector3(0, 0, isMobile ? 15 : 10)
  })
  const [cardText, setCardText] = useState({
    to: 'To you',
    message: "Happy Valentine's Day!\n\nI love you so much!"
  })

  // Spring animation for entrance
  const { position, rotation } = useSpring({
    from: {
      position: [0, 10, 0],
      rotation: [0, 0, 0],
    },
    to: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
    },
    onRest: () => setHasEntered(true),
  })

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      cameraPosition.z = isMobile ? 15 : 10
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [cameraPosition])

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
    if (!groupRef.current || !hasEntered) return

    const mouseX = state.pointer.x
    const mouseY = state.pointer.y

    if (!isOpen) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.5, 0.1)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.5, 0.1)
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }

    if (isOpen) {
      frontRef.current.rotation.y = THREE.MathUtils.lerp(frontRef.current.rotation.y, Math.PI / 2, 0.1)
      const targetZ = window.innerWidth < 768 ? 6 : 4
      state.camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.05)
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

      <animated.group
        ref={groupRef}
        onClick={handleClick}
        position={position}
        rotation={rotation}
      >
        {/* Back of card with border */}
        <group>
          {/* Border */}
          <mesh position={[0, 0, -0.015]} castShadow receiveShadow>
            <planeGeometry args={[3.2, 4.2]} />
            <meshPhongMaterial
              color='#ffffff'
              emissive='#ffffff'
              emissiveIntensity={0.2}
              shininess={100}
              specular='#ffffff'
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Back panel */}
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
        </group>

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

        {/* Front of card with border */}
        <group ref={frontRef} position={[1.5, 0, 0.01]}>
          {/* Border */}
          <mesh position={[-1.5, 0, -0.005]} castShadow receiveShadow>
            <planeGeometry args={[3.2, 4.2]} />
            <meshPhongMaterial
              color='#ffffff'
              emissive='#ffffff'
              emissiveIntensity={0.2}
              shininess={100}
              specular='#ffffff'
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Front panel */}
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
      </animated.group>
    </>
  )
}
