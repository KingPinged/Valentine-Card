'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef } from 'react'
import { View } from '@react-three/drei'

const ValentineCard = dynamic(() => import('@/components/canvas/ValentineCard').then((mod) => mod.ValentineCard), {
  ssr: false,
})
const Common = dynamic(() => import('@/components/canvas/Common').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const audioRef = useRef(new Audio('/ambient.mp3'))

  useEffect(() => {
    const audio = audioRef.current
    audio.loop = true

    const playAudio = () => {
      audio.play()
    }
    playAudio()

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      <View className='h-screen w-screen'>
        <Suspense fallback={null}>
          <ValentineCard />
          <Common color={'#ff1493'} />
        </Suspense>
      </View>
    </div>
  )
}
