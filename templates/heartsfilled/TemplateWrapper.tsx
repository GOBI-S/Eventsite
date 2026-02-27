"use client"

import { useState, useRef } from "react"
import Intro from "./pages/Intro"
import Message from "./pages/Message"
import Gallery from "./pages/Gallery"

type TemplateData = {
  birthdayPersonName: string
  birthdayDate: string
  fromName: string
  message: string
  photos: string[]
  musicUrl?: string
}

type TemplateWrapperProps = {
  data: TemplateData
}

export default function HeartsFilledTemplate({ data }: TemplateWrapperProps) {
  const [page, setPage] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.7
      audioRef.current.play().catch(() => {}) // prevents autoplay crash
    }
  }

  const goToPage = (nextPage: number) => {
    // Start music ONLY when leaving intro
    if (page === 0) startMusic()
    setPage(nextPage)
  }

  const pages = [
    <Intro key="intro" data={data} next={() => goToPage(1)} />,
    <Message key="message" data={data} next={() => goToPage(2)} />,
    <Gallery key="gallery" data={data} next={() => goToPage(2)} />, // This stays on gallery or you can remove the next button
  ]

  return (
    <div className="min-h-screen relative">
      {/* Hidden audio player */}
      {data.musicUrl && (
        <audio ref={audioRef} src={data.musicUrl} loop />
      )}

      {pages[page]}
    </div>
  )
}