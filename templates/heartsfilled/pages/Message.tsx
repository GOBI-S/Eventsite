"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, Star } from "lucide-react"
import Balloon from "@/templates/heartsfilled/components/balloon"
import Confetti from "@/templates/heartsfilled/components/confetti"

type MessageProps = {
  data: {
    birthdayPersonName: string
    fromName: string
    message: string
  }
  next: () => void
}

export default function Message({ data, next }: MessageProps) {
  const [balloons, setBalloons] = useState<
    { id: number; x: number; color: string; size: number; delay: number }[]
  >([])
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const newBalloons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#FF6B6B", "#4ECDC4", "#FFD166", "#FF9F1C", "#E76F51", "#F4A261"][
        Math.floor(Math.random() * 6)
      ],
      size: Math.random() * 20 + 30,
      delay: Math.random() * 5,
    }))
    setBalloons(newBalloons)
  }, [])

  const handleOpenCard = () => {
    if (!isCardOpen) {
      setIsCardOpen(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    } else {
      setIsCardOpen(false)
    }
  }

  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.02 },
    }),
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-purple-100">
      {showConfetti && <Confetti />}

      {balloons.map((balloon) => (
        <Balloon
          key={balloon.id}
          x={balloon.x}
          color={balloon.color}
          size={balloon.size}
          delay={balloon.delay}
        />
      ))}

      <div className="container relative z-10 mx-auto px-4 py-12">
        <h1 className="mb-10 text-center text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          A Special Message For {data.birthdayPersonName} 💌
        </h1>
         <Sparkles className="mx-auto mb-4 h-10 w-10 text-yellow-400 animate-spin" />

        <h2 className="mb-4 text-center text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  From {data.fromName} ❤️
                </h2>

        <div className="mx-auto max-w-3xl">
          <div className="relative flex justify-center">
            {/* Card */}
            <motion.div
              initial={false}
              animate={{ rotateY: isCardOpen ? 180 : 0 }}
              transition={{ duration: 1.2, type: "spring", stiffness: 70 }}
              className="relative w-full max-w-2xl cursor-pointer rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              onClick={handleOpenCard}
            >
              <div className="flex h-full flex-col items-center justify-center text-white">
                <Heart className="mb-6 h-20 w-20 animate-pulse" />
                <h2 className="mb-4 text-center text-3xl font-bold">
                  Click to Open Your Card
                </h2>
              </div>
            </motion.div>

            {/* Inside Message */}
            {isCardOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 rounded-2xl bg-white p-8 shadow-2xl border-4 border-rose-100"
              >
               
                

                <div className="mb-6 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 p-6 border-2 border-rose-200">
                  <p className="text-center text-lg text-slate-700 leading-relaxed">
                    {data.message.split("").map((char, i) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={letterVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </p>
                  <div className="text-center">
                  <button
                    onClick={next}
                    className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 pt-5 mt-10 px-8 py-3 text-white font-semibold shadow-lg hover:from-rose-600 hover:to-pink-700 transform hover:scale-110 transition-all duration-200"
                  >
                    View Memories 📸
                  </button>
                </div>
                </div>

                
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
