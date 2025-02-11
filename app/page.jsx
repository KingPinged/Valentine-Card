'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef, useState } from 'react'
import { View } from '@react-three/drei'

const ValentineCard = dynamic(
  () => import('@/components/canvas/ValentineCard').then(mod => mod.ValentineCard),
  {
    ssr: false,
    loading: () => null,
    displayName: 'ValentineCard'
  }
)

const Common = dynamic(
  () => import('@/components/canvas/Common').then(mod => mod.Common),
  {
    ssr: false,
    loading: () => null,
    displayName: 'Common'
  }
)

const LoadingScreen = dynamic(
  () => import('../src/components/canvas/LoadingScreen').then(mod => mod.default),
  {
    ssr: false,
    loading: () => null,
    displayName: 'LoadingScreen'
  }
)

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new window.Audio('/ambient.mp3')
      audioRef.current.loop = true
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err))
    }
  }

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      <View className='h-screen w-screen'>
        <Suspense fallback={null}>
          {isLoading ? (
            <LoadingScreen onComplete={handleLoadingComplete} />
          ) : (
            <>
              <ValentineCard />
              <Common color={'#ff1493'} />
            </>
          )}
        </Suspense>
      </View>
    </div>
  )
}
