"use client"

import { useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

interface MusicPlayerProps {
  isPlaying: boolean
  onToggle: () => void
}

export default function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio("/birthday-music.mp3")
      audioRef.current.loop = true
    }

    // Play or pause based on isPlaying prop
    if (isPlaying) {
      const playPromise = audioRef.current.play()

      // Handle play promise to avoid uncaught promise errors
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio play failed:", error)
        })
      }
    } else {
      audioRef.current.pause()
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isPlaying])

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-pink-50"
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Volume2 className="h-6 w-6 text-pink-500" /> : <VolumeX className="h-6 w-6 text-gray-500" />}
    </motion.button>
  )
}
