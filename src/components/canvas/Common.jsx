'use client'

import { Suspense } from 'react'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'

export const Common = ({ color }) => (
  <Suspense fallback={null}>
    <color attach='background' args={['#120318']} />
    <ambientLight intensity={0.2} />
    <spotLight
      position={[10, 10, 10]}
      angle={0.5}
      penumbra={0.5}
      intensity={1}
      color='#ff69b4'
      castShadow
      shadow-mapSize={[1024, 1024]}
    />
    <pointLight position={[-10, -10, -10]} intensity={0.2} color='#ff69b4' />
    <pointLight position={[0, 0, -10]} intensity={0.5} color='#ffffff' />
    <PerspectiveCamera makeDefault fov={40} position={[0, 0, 10]} near={0.1} far={100} />
  </Suspense>
)
