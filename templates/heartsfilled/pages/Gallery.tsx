"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Balloon from "@/templates/heartsfilled/components/balloon"

type GalleryProps = {
  data: {
    photos: string[]
    birthdayPersonName: string
  }
  next: () => void
}

export default function Gallery({ data, next }: GalleryProps) {
  const [balloons, setBalloons] = useState<
    { id: number; x: number; color: string; size: number; delay: number }[]
  >([])

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

  // Duplicate photos for smooth scrolling animation
  const scrollingPhotos = [...data.photos, ...data.photos]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-purple-50">
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
        <h1 className="mb-6 text-center text-4xl font-bold text-pink-600">
          Beautiful Memories with {data.birthdayPersonName} 📸
        </h1>

        <p className="mb-10 text-center text-lg text-purple-700">
          Every picture tells a story…
        </p>

        {/* Horizontal scrolling photos */}
        <div className="relative overflow-hidden py-8">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 30,
              ease: "linear",
            }}
            className="flex gap-6 whitespace-nowrap"
          >
            {scrollingPhotos.map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -10 }}
                className="inline-block overflow-hidden rounded-xl shadow-xl min-w-[200px]"
              >
                <Image
                  src={src}
                  alt={`Memory ${index + 1}`}
                  width={300}
                  height={200}
                  className="h-[250px] w-[300px] object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Grid gallery */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {data.photos.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-xl bg-white p-3 shadow-lg"
            >
              <Image
                src={src}
                alt={`Memory ${index + 1}`}
                width={400}
                height={300}
                className="h-[350px] w-full rounded-lg object-cover"
              />
              <p className="mt-2 text-center font-medium text-pink-600">
                Memory #{index + 1}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final Button */}
        <div className="mt-12 text-center">
          <button
            onClick={next}
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-10 py-3 text-white shadow-lg hover:from-pink-600 hover:to-purple-600"
          >
            Final Surprise 🎁
          </button>
        </div>
      </div>
    </div>
  )
}
