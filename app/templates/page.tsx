'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const TEMPLATE = {
  id: 'heartsfilled',
  name: 'Birthday Special',
  style: 'Romantic',
  color: 'from-pink-400 to-rose-300',
  description: 'Floating hearts, soft pink tones, and a magical birthday story experience.',
  price: '₹250'
};

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-4">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Choose Your Template</h1>
          <p className="text-muted-foreground mt-2">
            Start with our beautifully crafted romantic birthday experience template.
          </p>
        </div>
      </div>

      {/* Template Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <Card
            className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
              selectedTemplate === TEMPLATE.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTemplate(TEMPLATE.id)}
          >
            <div className={`w-full h-72 bg-gradient-to-br ${TEMPLATE.color} relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-24 h-24 text-white/30" />
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-foreground text-2xl">{TEMPLATE.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{TEMPLATE.description}</p>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {TEMPLATE.style}
                  </span>
                  <span className="text-lg font-bold text-primary">{TEMPLATE.price}</span>
                </div>

                <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/create/heartsfilled">
                    Customize
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to create magic?</h2>
          <p className="text-muted-foreground mb-8">
            Start customizing your romantic birthday surprise website now.
          </p>

          <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
            <Link href="/create/heartsfilled">
              Start Creating
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
