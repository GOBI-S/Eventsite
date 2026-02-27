"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star, Cake, Gift, RotateCw } from "lucide-react";
import type { Variants } from "framer-motion";

// Spinning Loader Component
function SpinningLoader() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" as const }}
      className="inline-block"
    >
      <RotateCw className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
    </motion.div>
  );
}

// Enhanced Balloon Component with more movement
function Balloon({
  x,
  color,
  size,
  delay,
}: {
  x: number;
  color: string;
  size: number;
  delay: number;
}) {
  const randomSway = Math.random() * 100 - 50;
  const randomDuration = 8 + Math.random() * 4;

  return (
    <motion.div
      className="fixed pointer-events-none"
      initial={{ y: "100vh", x: `${x}%`, opacity: 0, rotate: 0 }}
      animate={{
        y: "-100vh",
        opacity: [0, 1, 1, 0],
        x: `${x + randomSway}%`,
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: randomDuration,
        delay: delay,
        ease: "easeIn",
        rotate: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      style={{
        width: size,
        height: size + 10,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-full w-full h-4/5"
        style={{ backgroundColor: color, boxShadow: `0 4px 15px ${color}80` }}
      />
      <div className="w-0.5 h-1/4 bg-gradient-to-b from-gray-300 to-gray-400 mx-auto" />
    </motion.div>
  );
}

// Confetti Component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-2 h-2 rounded-full"
          style={{
            backgroundColor: [
              "#FF6B6B",
              "#4ECDC4",
              "#FFD166",
              "#FF9F1C",
              "#E76F51",
            ][Math.floor(Math.random() * 5)],
            left: Math.random() * 100 + "%",
            top: -10,
          }}
          animate={{
            y: window.innerHeight + 10,
            x: (Math.random() - 0.5) * 200,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

type TemplateData = {
  birthdayPersonName: string;
  fromName: string;
  message: string;
};

type Props = {
  data: TemplateData;
  next: () => void;
};

export default function Home({ data, next }: Props) {
  const [balloons, setBalloons] = useState<
    { id: number; x: number; color: string; size: number; delay: number }[]
  >([]);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const newBalloons = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#FF6B6B", "#4ECDC4", "#FFD166", "#FF9F1C", "#E76F51", "#F4A261"][
        Math.floor(Math.random() * 6)
      ],
      size: Math.random() * 20 + 30,
      delay: Math.random() * 5,
    }));
    setBalloons(newBalloons);
  }, []);

  const handleOpenCard = () => {
    if (!isCardOpen) {
      setIsCardOpen(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      setIsCardOpen(false);
    }
  };

  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.02 },
    }),
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: { duration: 1.5, repeat: Infinity, ease: "linear" as const },
    },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Birthday Card View
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-100">
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

      <div className="container relative z-10 mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Decorative Spinning Icons */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <motion.div variants={spinnerVariants} animate="animate">
              <Cake className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
            </motion.div>
            <motion.div
              variants={spinnerVariants}
              animate="animate"
              style={{ animationDelay: "0.3s" }}
            >
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            </motion.div>
            <motion.div
              variants={spinnerVariants}
              animate="animate"
              style={{ animationDelay: "0.6s" }}
            >
              <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
            </motion.div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2 sm:mb-4 px-2">
            Happy Birthday {data.birthdayPersonName}!
          </h1>

          {/* From Name */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-2"
          >
            A Special Message from {data.fromName}
          </motion.h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 px-2 max-w-2xl mx-auto">
            Click the card below to reveal your special birthday message
          </p>
        </div>

        {/* Card Section */}
        <div className="mx-auto max-w-2xl px-2 sm:px-4">
          <div className="relative flex justify-center min-h-80 sm:min-h-96">
            {/* Closed Card */}
            {!isCardOpen && (
              <motion.div
                initial={false}
                animate={{
                  rotateY: 0,
                  scale: 1,
                }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 70 }}
                className="relative w-full cursor-pointer rounded-3xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 p-6 sm:p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                onClick={handleOpenCard}
                style={{ perspective: "1000px" }}
              >
                <div className="flex h-full flex-col items-center justify-center text-white py-12 sm:py-16">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 360, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="mb-4 sm:mb-6 h-16 w-16 sm:h-20 sm:w-20 drop-shadow-lg" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
                    Click to Open Your Card
                  </h2>
                  <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-white/90">
                    Tap or click to reveal your special surprise!
                  </p>

                  {/* Loading spinner indicator */}
                  <div className="mt-6 sm:mt-8">
                    <SpinningLoader />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Opened Card Message */}
            {isCardOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute inset-0 rounded-3xl bg-white p-6 sm:p-8 lg:p-10 shadow-2xl border-4 sm:border-6 border-rose-100 overflow-y-auto max-h-96 sm:max-h-full"
              >
                {/* Decorative Top Border */}
                <div className="mb-4 sm:mb-6 flex justify-center gap-2 sm:gap-3">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                </div>

                {/* Message Box */}
                <div className="mb-6 sm:mb-8 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-4 sm:p-6 lg:p-8 border-2 sm:border-3 border-rose-200">
                  <p className="text-center text-base sm:text-lg md:text-xl text-slate-800 leading-relaxed font-medium">
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
                </div>

                {/* Decorative Bottom Border */}
                <div className="mb-6 sm:mb-8 flex justify-center gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCard();
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg hover:from-rose-600 hover:to-pink-700 transform hover:scale-110 transition-all duration-200 text-sm sm:text-base"
                  >
                    Close Card
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      next();
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-200 text-sm sm:text-base"
                  >
                    View Memories
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Decoration with Floating Animation */}
        <div className="mt-12 sm:mt-16 flex justify-center gap-3 sm:gap-4 opacity-60">
          <motion.div variants={floatingVariants} animate="animate">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
          </motion.div>
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "0.5s" }}
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </motion.div>
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "1s" }}
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

//   // Memories View
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-rose-100 flex items-center justify-center p-4">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
//           Memories & Photos Coming Soon!
//         </h1>
//         <p className="text-lg sm:text-xl text-slate-700 mb-8">
//           Your special photo gallery will be displayed here to celebrate this amazing day!
//         </p>
//         <button
//           onClick={() => setShowMemories(false)}
//           className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg hover:from-rose-600 hover:to-pink-700 transform hover:scale-110 transition-all duration-200 text-sm sm:text-base"
//         >
//           Back to Birthday Card
//         </button>
//       </div>
//     </main>
//   )
