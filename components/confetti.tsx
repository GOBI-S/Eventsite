'use client';

import { useEffect, useState } from 'react';

interface Confetti {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
}

export function Confetti() {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    const colors = ['#7c3aed', '#06b6d4', '#ec4899', '#fbbf24', '#34d399', '#f87171'];
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setConfetti(newConfetti);

    const timer = setTimeout(() => setConfetti([]), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {confetti.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none animate-confetti"
          style={{
            left: `${item.left}%`,
            top: '-10px',
            width: `${item.size}px`,
            height: `${item.size}px`,
            backgroundColor: item.color,
            borderRadius: '50%',
            animationDelay: `${item.delay}s`,
          }}
        />
      ))}
    </>
  );
}
