"use client";
import { getAuth } from "firebase/auth";
import { auth } from "@/lib/firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Lock, Gift } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null)
  useEffect(() => {
  const id = localStorage.getItem("eventId")
  setEventId(id)
}, [])

  const handlePayment = async () => {
    if (!(window as any).Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh.");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/razorpay/order", { method: "POST" });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        name: "EventSite",
        description: "Birthday Event Website",
        order_id: order.id,

        handler: async function (response: any) {
          const user = auth.currentUser;

          if (!user) {
            alert("Login expired");
            return;
          }

          // verify payment
          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          // get draft (contains CLOUDINARY URLS)
          const draft = localStorage.getItem("birthdayDraft");
          if (!draft) {
            alert("No event data found");
            return;
          }

          const parsed = JSON.parse(draft);

          // save event
          const saveRes = await fetch("/api/events/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...parsed,
              ownerUid: user.uid,
              eventId: eventId,

              payment: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                status: "paid",
                amount: order.amount,
              },
            }),
          });
          const saved = await saveRes.json();
          console.log("Saved response:", saved);
          await fetch("/api/events/mark-paid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId: localStorage.getItem("eventId"),
              ownerUid: user.uid,
            }),
          });

          localStorage.removeItem("birthdayDraft");

          router.push("/success?slug=" + saved.event.slug);
        },
        theme: { color: "#ec4899" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 relative overflow-hidden">
      {/* Animated background balloons */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-70">🎈</div>
        <div className="absolute top-40 right-20 text-5xl animate-pulse opacity-60">🎉</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-bounce opacity-70" style={{ animationDelay: '0.5s' }}>🎂</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-pulse opacity-60" style={{ animationDelay: '1s' }}>🎁</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-bounce opacity-70" style={{ animationDelay: '1.5s' }}>💖</div>
      </div>

      {/* Header */}
      <div className="border-b border-pink-200 bg-gradient-to-r from-white to-pink-50/50 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/create/heartsfilled"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors mb-4 font-semibold"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Preview
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              Complete Your Purchase
            </h1>
            <span className="text-4xl animate-bounce">🎊</span>
          </div>
          <p className="text-gray-600 mt-2 text-lg">
            Secure checkout for your birthday surprise website ✨
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Payment Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-pink-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-white border-b border-pink-100">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-600" />
                <CardTitle className="text-pink-900">Payment Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-3 text-sm text-pink-700 bg-pink-50 p-4 rounded-lg border border-pink-200">
                <Lock className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span className="font-medium">
                  You will be redirected to Razorpay's secure payment gateway. 🔒
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-100 to-white rounded-lg border border-pink-200">
                  <span className="text-gray-700 font-medium">💰 What you get:</span>
                  <span className="text-sm text-gray-600">Unlimited customization</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-100 to-white rounded-lg border border-pink-200">
                  <span className="text-gray-700 font-medium">🎨 Design Templates:</span>
                  <span className="text-sm text-gray-600">10+ premium themes</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-100 to-white rounded-lg border border-pink-200">
                  <span className="text-gray-700 font-medium">📱 Mobile Ready:</span>
                  <span className="text-sm text-gray-600">Works perfectly on all devices</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                size="lg"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold text-lg py-6 rounded-lg transition-all hover:shadow-lg active:scale-95"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🎉 Pay ₹205 & Create My Birthday Website
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <Card className="border-pink-200 bg-white/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-900 flex items-center gap-2">
                <span className="text-2xl">✨</span> Why Our Birthday Websites?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="text-2xl mb-1">🎵</div>
                  <p className="text-sm font-semibold text-pink-900">Music & Sound</p>
                </div>
                {/* <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="text-2xl mb-1">🎬</div>
                  <p className="text-sm font-semibold text-pink-900">Video Support</p>
                </div> */}
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="text-2xl mb-1">💌</div>
                  <p className="text-sm font-semibold text-pink-900">Guest Messages</p>
                </div>
                {/* <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="text-2xl mb-1">🎁</div>
                  <p className="text-sm font-semibold text-pink-900">Gift Registry</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="">
          <Card className="sticky top-24 border-pink-200 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white border-b-0 bg-white">
              <CardTitle className="flex items-center gap-2">
                <span>🎯</span> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 bg-white">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">₹245.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Tax (2%)</span>
                <span className="font-medium">₹5.00</span>
              </div>
              <div className="flex justify-between text-sm text-pink-600 font-semibold bg-pink-50 p-2 rounded">
                <span>Discount 🎉</span>
                <span>- ₹45.00</span>
              </div>
              <div className="border-t-2 border-pink-200 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                    ₹205
                  </div>
                  <span className="text-xs text-gray-500">One-time payment</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="pt-4 border-t-2 border-pink-100 space-y-2">
                <p className="text-xs font-semibold text-gray-600 text-center">SECURE PAYMENT</p>
                <div className="flex justify-center gap-2 text-xl">
                  <span title="Secure">🔒</span>
                  <span title="Verified">✅</span>
                  <span title="Fast">⚡</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating confetti emojis */}
      <style>{`
        @keyframes float-down {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes float-side {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(20px) translateY(-10px);
          }
        }

        .confetti {
          position: fixed;
          pointer-events: none;
          animation: float-down 8s linear forwards;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
}
