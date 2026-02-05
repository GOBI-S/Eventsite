'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Copy, Check, Eye, RotateCcw, Mail, Heart } from 'lucide-react';

export default function SuccessPage() {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const privateLink = 'yourdomain.com/sarah-birthday?key=abc123def456';
  const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyLink = () => {
    navigator.clipboard.writeText(privateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-pink-50 overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            >
              {'🎉🎂🎁❤️💝✨'[Math.floor(Math.random() * 6)]}
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
      `}</style>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <Heart className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            Your Birthday Surprise Website is Live! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            The magic is ready to be shared. Copy your private link and send it to the birthday person.
          </p>
        </div>

        {/* Private Link Card */}
        <Card className="mb-8 border-2 border-primary/20 shadow-xl">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="text-foreground">Your Private Link</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div>
              <Label className="text-foreground font-semibold mb-3 block">Share this link with the birthday person:</Label>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted/50 rounded-lg p-4 border border-border flex items-center">
                  <code className="text-sm text-foreground break-all font-mono">{privateLink}</code>
                </div>
                <Button
                  onClick={copyLink}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {copied ? 'Link copied to clipboard!' : 'Click to copy the link'}
              </p>
            </div>

            {/* Expiry Information */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-2">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⏰</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Active Until</p>
                  <p className="text-sm text-muted-foreground">{expiryDate}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                After this time, the link will no longer be accessible. You can extend access at any time.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.share({ url: privateLink, title: 'Birthday Surprise' })}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full bg-transparent"
              >
                <Link href={`https://${privateLink}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  view
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full bg-transparent"
              >
                {/* <Link href="/create">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Edit
                </Link> */}
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Next Steps */}
        <Card>
          <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/5 to-accent/5">
            <CardTitle className="text-foreground">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Copy & Share Your Link</p>
                  <p className="text-sm text-muted-foreground">Send the private link via message, email, or however you prefer.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Watch Their Reaction</p>
                  <p className="text-sm text-muted-foreground">Sit back and enjoy their surprise and happiness when they open it.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Extend If Needed</p>
                  <p className="text-sm text-muted-foreground">Keep the site active for more than 3 days with a simple extension.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button size="lg" asChild className="flex-1 bg-primary hover:bg-primary/90">
            <Link href="/templates">Create Another</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="flex-1 bg-transparent">
            <a href="https://yourdomain.com">Visit Home</a>
          </Button>
        </div>

        {/* Footer Message */}
        <div className="mt-12 p-6 rounded-lg bg-secondary/5 border border-secondary/20 text-center">
          <p className="text-muted-foreground">
            Have questions? Our support team is here to help at <span className="text-primary font-medium">support@surprise.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
