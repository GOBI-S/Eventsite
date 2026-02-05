"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
  if (!(window as any).Razorpay) {
    alert("Razorpay SDK not loaded. Please refresh.")
    return
  }

  const res = await fetch("/api/razorpay/order", { method: "POST" })
  const order = await res.json()

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: order.amount,
    currency: "INR",
    name: "EventSite",
    description: "Birthday Event Website",
    order_id: order.id,

    handler: async function (response: any) {
      await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      })

      router.push("/success")
    },

    theme: { color: "#ec4899" },
  }

  const rzp = new (window as any).Razorpay(options)
  rzp.open()
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-pink-50">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/create/heartsfilled"
            className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Preview
          </Link>
          <h1 className="text-4xl font-bold">Complete Your Purchase</h1>
          <p className="text-muted-foreground mt-2">
            Secure checkout for your birthday surprise website
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        {/* Payment Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg">
                <Lock className="w-4 h-4 text-primary" />
                You will be redirected to Razorpay’s secure payment gateway.
              </div>

              <Button
                onClick={handlePayment}
                size="lg"
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing
                  ? "Processing..."
                  : "Pay ₹250 & Create My Birthday Website"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹250.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">₹250.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
