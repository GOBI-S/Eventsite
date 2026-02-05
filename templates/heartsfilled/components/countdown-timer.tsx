"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "@/templates/heartsfilled/components/confetti"
import { Heart } from "lucide-react"

interface CountdownTimerProps {
  targetDate: number
  oncountdownend: () => void
}

export default function CountdownTimer({ targetDate,oncountdownend }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showHeartExplosion, setShowHeartExplosion] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsComplete(true)
        setShowCelebration(true)
          // Notify parent that countdown has ended
  oncountdownend?.()
        // Trigger heart explosion after a short delay
        setTimeout(() => {
          setShowHeartExplosion(true)
        }, 500)

        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    < >
      {showCelebration && <Confetti />}

      <AnimatePresence>
        {!isComplete ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-200 bg-white shadow-lg sm:h-24 sm:w-24">
                  <motion.span
                    key={unit.value}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="text-2xl font-bold text-pink-500 sm:text-3xl"
                  >
                    {unit.value}
                  </motion.span>
                </div>
                <span className="mt-2 text-sm font-medium text-pink-600 sm:text-base">{unit.label}</span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-col items-center justify-center py-10"
          >
            {/* Heart Explosion Animation */}
            <div className="relative h-60 w-60">
              {/* Big Red Heart that appears and then explodes */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={showHeartExplosion ? { scale: [0, 1.2, 0], opacity: [0, 1, 0] } : { scale: 1, opacity: 1 }}
                transition={showHeartExplosion ? { duration: 0.8, times: [0, 0.4, 1] } : { duration: 0.5 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <Heart className="h-40 w-40 text-red-600 fill-red-600" />
              </motion.div>

              {/* Heart Explosion Particles */}
              {showHeartExplosion && (
                <>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={`heart-particle-${i}`}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: (Math.random() - 0.5) * 400,
                        y: (Math.random() - 0.5) * 400,
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: Math.random() * 1.5 + 1,
                        ease: "easeOut",
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                    </motion.div>
                  ))}

                  {/* Confetti Poppers */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`popper-${i}`}
                      initial={{
                        x: 0,
                        y: 0,
                        scale: 0,
                        rotate: 0,
                        opacity: 0,
                      }}
                      animate={{
                        x: Math.cos((i * Math.PI) / 4) * 150,
                        y: Math.sin((i * Math.PI) / 4) * 150,
                        scale: 1,
                        rotate: Math.random() * 360,
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        ease: "easeOut",
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <div className="relative">
                        <div className="h-6 w-2 bg-yellow-500 rounded-sm"></div>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-full"></div>

                        {/* Popper Explosion */}
                        {Array.from({ length: 10 }).map((_, j) => (
                          <motion.div
                            key={`popper-particle-${j}`}
                            initial={{ y: 0, opacity: 0 }}
                            animate={{
                              y: -50 - Math.random() * 50,
                              x: (Math.random() - 0.5) * 30,
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1 + Math.random(),
                              delay: 0.1 + Math.random() * 0.3,
                            }}
                            className="absolute -top-2 left-1/2 -translate-x-1/2"
                          >
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: [
                                  "#FF6B6B",
                                  "#4ECDC4",
                                  "#FFD166",
                                  "#FF9F1C",
                                  "#E76F51",
                                  "#F4A261",
                                  "#F72585",
                                  "#7209B7",
                                ][Math.floor(Math.random() * 8)],
                              }}
                            ></div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
            {/* Celebration Balloons */}
            {showHeartExplosion && (
              <>
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={`celebration-balloon-${i}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                      y: -200 - Math.random() * 300,
                      x: (Math.random() - 0.5) * 300,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 3,
                      delay: 0.8 + i * 0.1,
                      ease: "easeOut",
                    }}
                    className="absolute left-1/2 bottom-0 -translate-x-1/2 z-0"
                  >
                    <div className="relative">
                      <svg
                        width={30 + Math.random() * 20}
                        height={40 + Math.random() * 30}
                        viewBox="0 0 50 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M25 0C11.2 0 0 11.2 0 25C0 38.8 11.2 50 25 50C38.8 50 50 38.8 50 25C50 11.2 38.8 0 25 0Z"
                          fill={
                            ["#FF6B6B", "#4ECDC4", "#FFD166", "#FF9F1C", "#E76F51", "#F4A261", "#F72585", "#7209B7"][
                              Math.floor(Math.random() * 8)
                            ]
                          }
                        />
                        <path d="M25 50L20 60H30L25 50Z" fill="#888888" />
                      </svg>
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-10 w-1 bg-gray-400"
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
