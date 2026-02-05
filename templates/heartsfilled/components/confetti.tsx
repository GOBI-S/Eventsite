"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Confetti() {
  const [confetti, setConfetti] = useState<
    { id: number; x: number; y: number; color: string; size: number; rotation: number; type: string }[]
  >([])

  useEffect(() => {
    // Generate confetti pieces with different shapes
    const pieces = Array.from({ length: 300 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: [
        "#FF6B6B",
        "#4ECDC4",
        "#FFD166",
        "#FF9F1C",
        "#E76F51",
        "#F4A261",
        "#F72585",
        "#7209B7",
        "#3A0CA3",
        "#4CC9F0",
        "#FFD700",
        "#FF1493",
        "#00FFFF",
        "#FF00FF",
        "#ADFF2F",
      ][Math.floor(Math.random() * 15)],
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      type: ["square", "circle", "triangle", "star", "heart"][Math.floor(Math.random() * 5)],
    }))
    setConfetti(pieces)
  }, [])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: "-10vh",
            rotate: piece.rotation,
          }}
          animate={{
            y: "700vh",
            rotate: piece.rotation + 360 * 2,
          }}
          transition={{
            duration: Math.random() * 5 + 5+5,
            ease: "easeOut",
            delay: Math.random() * 3,
          }}
          style={{
            position: "absolute",
            width: `${piece.size}px`,
            height:
              piece.type === "circle"
                ? `${piece.size}px`
                : piece.type === "square"
                  ? `${piece.size}px`
                  : `${piece.size * 0.5}px`,
            backgroundColor:
              piece.type !== "star" && piece.type !== "triangle" && piece.type !== "heart"
                ? piece.color
                : "transparent",
            borderRadius: piece.type === "circle" ? "50%" : "2px",
            clipPath:
              piece.type === "triangle"
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : piece.type === "heart"
                  ? "path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z')"
                  : "none",
          }}
        >
          {piece.type === "star" && (
            <svg width={piece.size} height={piece.size} viewBox="0 0 24 24" fill={piece.color}>
              <path d="M12 0L15.09 8.91L24 9.82L17.46 16.18L19.09 24L12 19.77L4.91 24L6.54 16.18L0 9.82L8.91 8.91L12 0Z" />
            </svg>
          )}
          {piece.type === "heart" && (
            <svg width={piece.size} height={piece.size} viewBox="0 0 24 24" fill={piece.color}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}
