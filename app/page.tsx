'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, Music, ImageIcon, Share2, Calendar, Sparkles, Gift, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Confetti } from '@/components/confetti';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [stars, setStars] = useState<{ cx: number; cy: number; r: number; opacity: number; delay: number }[]>([]);
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/create/heartsfilled');

    // Generate stars on client only (prevents hydration mismatch)
    const generatedStars = Array.from({ length: 100 }).map(() => ({
      cx: Math.random() * 1000,
      cy: Math.random() * 1000,
      r: Math.random() * 1.5,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 2,
    }));
    setStars(generatedStars);
  }, [router]);

  const triggerCelebration = () => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(timer);
  };

  const templates = [
    {
      id: 'heartsfilled',
      name: 'Birthday Special',
      style: 'Romantic',
      price: '₹250',
      image: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    },
    {
      id: 'coming-soon-1',
      name: 'coming-soon-1t',
      style: 'Elegant',
      price: '₹250',
      image: 'linear-gradient(135deg, #5b21b6 0%, #1e1b4b 100%)',
    },
    {
      id: 'coming-soon-2',
      name: 'coming-soon-2',
      style: 'Magical',
      price: '₹250',
      image: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg className="w-full h-full opacity-30" viewBox="0 0 1000 1000">
          {stars.map((star, i) => (
            <circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              opacity={star.opacity}
              className="animate-twinkle"
              style={{ animationDelay: `${star.delay}s` }}
            />
          ))}
        </svg>
      </div>

      {showConfetti && <Confetti />}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">
            <span className="inline-block mr-2">◆</span>
            Onyx Technologies
          </div>
          <div className="flex items-center gap-4">
            <div className="space-x-4">
              {/* <Button variant="ghost" asChild><a href="#how-it-works">How It Works</a></Button> */}
              <Button variant="ghost" asChild><a href="#templates">Templates</a></Button>
              <Button variant="ghost" asChild><a href="#pricing">Pricing</a></Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6 animate-slide-in-up">
            <span className="text-sm animate-pulse-glow">✨</span>
            <span className="text-sm font-medium text-primary">Under the stars, creating magic</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            Create a <span className="text-primary animate-pulse-glow">Surprise Birthday</span> Website in Minutes
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Turn memories, music, and love into a magical birthday surprise. Design a personalized website with photos, animations, and a heartfelt message powered by Onyx Technologies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
              <Link href="/templates" onClick={triggerCelebration}>
                <Gift className="w-5 h-5 mr-2 animate-bounce-happy" />
                Create a Birthday Surprise
              </Link>
            </Button>
            {/* <Button size="lg" variant="outline" onClick={triggerCelebration} className="hover:scale-105 transition-transform duration-300 bg-transparent">
              <Sparkles className="w-5 h-5 mr-2 animate-pulse-glow" />
              See How It Works
            </Button> */}
          </div>
        </div>
      </section>

      {/* Templates Section
      <section id="templates" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Templates</h2>
          <p className="text-lg text-muted-foreground">Choose from our most loved designs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {templates.map((template, idx) => (
            <Card key={template.name} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in-up hover:border-primary/50" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="w-full h-48 bg-gradient-to-br" style={{ backgroundImage: template.image }} />
              <CardHeader>
                <CardTitle className="text-foreground">{template.name}</CardTitle>
                <CardDescription>{template.style} Style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary animate-pulse-glow">{template.price}</span>
                  <Button size="sm" asChild>
                    <Link href={`/create/${template.id}`}>Customize</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* Pricing CTA */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/30 shadow-xl">
            <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Birthday Website
              </CardTitle>
              <CardDescription>3-Day Access | No Hidden Fees | By Onyx Technologies</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-5xl font-bold text-primary mb-6">₹250</div>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild onClick={triggerCelebration}>
                <Link href="/create/heartsfilled">
                  <Gift className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border bg-background/50 py-12 text-center text-sm text-muted-foreground">
        Made with love for unforgettable moments. © {new Date().getFullYear()} Onyx Technologies.
      </footer>
    </div>
  );
}
