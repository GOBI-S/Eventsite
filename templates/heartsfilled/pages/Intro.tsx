"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Gift, Heart, PartyPopper } from "lucide-react"
import Balloon from "@/templates/heartsfilled/components/balloon"
import CountdownTimer from "@/templates/heartsfilled/components/countdown-timer"

type IntroProps = {
  data: {
    birthdayPersonName: string
    birthdayDate: string
  }
  next: () => void
}

export default function Intro({ data, next }: IntroProps) {
  const [balloons, setBalloons] = useState<
    { id: number; x: number; color: string; size: number; delay: number }[]
  >([])
  const [showButtons, setShowButtons] = useState(false)

  const birthday = new Date(data.birthdayDate).getTime()

  useEffect(() => {
    const newBalloons = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#FF6B6B", "#4ECDC4", "#FFD166", "#FF9F1C", "#E76F51", "#F4A261"][
        Math.floor(Math.random() * 6)
      ],
      size: Math.random() * 30 + 40,
      delay: Math.random() * 5,
    }))
    setBalloons(newBalloons)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-100 to-pink-100">
      {balloons.map((balloon) => (
        <Balloon
          key={balloon.id}
          x={balloon.x}
          color={balloon.color}
          size={balloon.size}
          delay={balloon.delay}
        />
      ))}

      <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
        <PartyPopper className="mb-6 h-20 w-20 text-pink-500" />

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-5xl font-extrabold text-pink-600"
        >
          Happy Birthday {data.birthdayPersonName} 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10 text-xl text-pink-500"
        >
          Someone made something special just for you ❤️
        </motion.p>

        <CountdownTimer
          targetDate={birthday}
          oncountdownend={() => setShowButtons(true)}
        />

        {showButtons && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-12 flex gap-6"
          >
            <button
              onClick={next}
              className="flex items-center rounded-full bg-pink-500 px-8 py-3 text-white shadow-lg hover:bg-pink-600"
            >
              <Gift className="mr-2 h-5 w-5" />
              Open Memories
            </button>

            <button
              onClick={next}
              className="flex items-center rounded-full bg-purple-500 px-8 py-3 text-white shadow-lg hover:bg-purple-600"
            >
              <Heart className="mr-2 h-5 w-5" />
              Read Message
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
