'use client';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Copy, Check, Eye, RotateCcw, Mail, Heart } from 'lucide-react';

export default function SuccessClient() {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const searchParams = useSearchParams()
  const slug = searchParams.get("slug")

  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  if (!slug) {
    return <div className="p-10 text-center">Invalid payment session</div>
  }

  const privateLink = `${origin}/event/${slug}`
  const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const copyLink = () => {
    navigator.clipboard.writeText(privateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 overflow-hidden relative">
      {/* Animated Background Balloons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={`balloon-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${40 + (i % 5) * 20}px`,
              height: `${40 + (i % 5) * 20}px`,
              backgroundColor: i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#f472b6' : '#fbcfe8',
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
              animation: `float ${8 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute font-bold animate-bounce"
              style={{
                fontSize: `${20 + Math.random() * 20}px`,
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animation: `fall ${3 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            >
              {'🎉🎂🎁🎈💝✨🎊🥳🍰💖🎀🌟'[Math.floor(Math.random() * 12)]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(236, 72, 153, 0.6);
          }
        }
        @keyframes bounce-spin {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .bounce-spin {
          animation: bounce-spin 1s ease-in-out infinite;
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 mb-6 pulse-glow">
            <span className="text-5xl bounce-spin">🎂</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent mb-4 text-balance">
            Party Time! 🎉
          </h1>
          <p className="text-2xl text-pink-600 font-semibold mb-3">
            Your Birthday Surprise Website is LIVE! ✨
          </p>
          <p className="text-lg text-gray-600">
            Get ready for an amazing surprise! Copy your magical link and send it to the birthday star. 🌟
          </p>
        </div>

        {/* Private Link Card */}
        <Card className="mb-8 border-2 border-pink-300 shadow-2xl bg-white/90 backdrop-blur">
          <CardHeader className="border-b-2 border-pink-200 bg-gradient-to-r from-pink-100 to-pink-50">
            <CardTitle className="text-2xl text-pink-700 flex items-center gap-2">
              <span>🎁</span> Your Private Link <span>🎈</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div>
              <Label className="text-lg text-pink-600 font-bold mb-3 block flex items-center gap-2">
                <span>💌</span> Share this magical link with the birthday person:
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gradient-to-r from-pink-50 to-white rounded-lg p-4 border-2 border-pink-200 flex items-center">
                  <code className="text-sm text-gray-700 break-all font-mono font-semibold">{privateLink}</code>
                </div>
                <Button
                  onClick={copyLink}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex-shrink-0 font-bold"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-pink-500 mt-2 font-semibold">
                {copied ? '✅ Link copied to clipboard!' : '📋 Click to copy the link'}
              </p>
            </div>

            {/* Expiry Information */}
            <div className="bg-gradient-to-r from-pink-100 to-pink-50 border-2 border-pink-300 rounded-xl p-6 space-y-2">
              <div className="flex items-start gap-3">
                <div className="text-3xl">⏰</div>
                <div className="flex-1">
                  <p className="font-bold text-pink-700 text-lg">Active Until</p>
                  <p className="text-pink-600 font-semibold text-lg">{expiryDate}</p>
                </div>
              </div>
              <p className="text-sm text-pink-600 font-medium">
                🎊 After this time, the link will no longer be accessible. Keep the party going by extending access anytime!
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigator.share({ url: privateLink, title: 'Birthday Surprise' })}
                className="w-full bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-bold text-base"
              >
                <Mail className="w-5 h-5 mr-2" />
                Share Now 📧
              </Button>
              <Button
                size="lg"
                asChild
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-base"
              >
                <Link href={privateLink}>
                  <Eye className="w-5 h-5 mr-2" />
                  Preview 👀
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 border-2 border-pink-300 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="border-b-2 border-pink-200 bg-gradient-to-r from-pink-100 to-pink-50">
            <CardTitle className="text-2xl text-pink-700 flex items-center gap-2">
              <span>🚀</span> What's Next? <span>🎯</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-white border border-pink-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1️⃣
                </div>
                <div>
                  <p className="font-bold text-pink-700 text-lg">Copy & Share Your Link 🔗</p>
                  <p className="text-gray-600 text-sm">Send the private link via text, email, or however you prefer. Watch them get surprised!</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-white border border-pink-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2️⃣
                </div>
                <div>
                  <p className="font-bold text-pink-700 text-lg">Sit Back & Enjoy 💖</p>
                  <p className="text-gray-600 text-sm">Watch their reaction and happiness when they open the surprise. Capture those special moments!</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-white border border-pink-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3️⃣
                </div>
                <div>
                  <p className="font-bold text-pink-700 text-lg">Keep the Celebration Going 🎊</p>
                  <p className="text-gray-600 text-sm">Need more time? Extend the link anytime with just one click. The party continues!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun Facts Card */}
        <Card className="mb-8 border-2 border-pink-300 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="border-b-2 border-pink-200 bg-gradient-to-r from-pink-100 to-pink-50">
            <CardTitle className="text-2xl text-pink-700 flex items-center gap-2">
              <span>✨</span> Birthday Magic Tips <span>🎪</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🎨</span>
                <p className="text-gray-700"><span className="font-bold text-pink-600">Customize Everything:</span> Add photos, videos, and personal messages to make it extra special!</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">📱</span>
                <p className="text-gray-700"><span className="font-bold text-pink-600">Mobile Friendly:</span> Works perfectly on phones, tablets, and computers!</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🔐</span>
                <p className="text-gray-700"><span className="font-bold text-pink-600">Private & Secure:</span> Only those with the link can see your surprise!</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🎯</span>
                <p className="text-gray-700"><span className="font-bold text-pink-600">Time It Right:</span> Send the link at exactly the right moment for maximum surprise effect!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button size="lg" asChild className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-base">
            <Link href="/templates">Create Another 🎁</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="flex-1 border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-bold text-base">
            <a href="/">Back Home 🏠</a>
          </Button>
        </div>

        {/* Footer Message */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-pink-100 to-pink-50 border-2 border-pink-300 text-center shadow-lg">
          <p className="text-pink-700 font-bold text-lg mb-2">
            🎉 Happy Birthday! 🥳
          </p>
          <p className="text-gray-700">
            Have questions? Our support team is here to help at <span className="text-pink-600 font-bold">founder@onyxtechnologies.tech</span> 💌
          </p>
          <p className="text-sm text-pink-600 mt-3">Made with 💖 to celebrate your special day!</p>
        </div>
      </div>
    </div>
  );
}
