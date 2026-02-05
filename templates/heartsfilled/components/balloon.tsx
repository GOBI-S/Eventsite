"use client"

import { motion } from "framer-motion"

interface BalloonProps {
  x: number
  color: string
  size: number
  delay: number
}

export default function Balloon({ x, color, size, delay }: BalloonProps) {
  return (
    <motion.div
      initial={{ y: "110vh" }}
      animate={{ y: "-20vh" }}
      transition={{
        duration: Math.random() * 10 + 15,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      }}
      className="absolute z-0"
      style={{ left: `${x}%` }}
    >
      <motion.div
        animate={{
          x: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <svg width={size} height={size * 1.2} viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25 0C11.2 0 0 11.2 0 25C0 38.8 11.2 50 25 50C38.8 50 50 38.8 50 25C50 11.2 38.8 0 25 0Z"
            fill={color}
          />
          <path d="M25 50L20 60H30L25 50Z" fill="#888888" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
