"use client"

import { useEffect } from "react"
import { auth } from "@/lib/firebase"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function FinishSignIn() {
  const router = useRouter()

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        if (!isSignInWithEmailLink(auth, window.location.href)) return

        let email = localStorage.getItem("emailForSignIn")
        if (!email) {
          email = window.prompt("Confirm your email") || ""
        }

        // ✅ Finish Firebase login
        const result = await signInWithEmailLink(auth, email, window.location.href)
        localStorage.removeItem("emailForSignIn")

        const user = result.user
        if (!user) return

        console.log("🔥 UID:", user.uid)

        // 🧠 Get the extra data user filled BEFORE verification
        const name = localStorage.getItem("temp_name")
        const gender = localStorage.getItem("temp_gender")
        const extra = localStorage.getItem("temp_extra")
        console.log("🔥", name, gender, extra)

        // 📦 Send everything to backend
        await fetch("/api/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            name,
            gender,
            extra,
          }),
        })

        // 🧹 Clean temporary storage
        localStorage.removeItem("temp_name")
        localStorage.removeItem("temp_gender")
        localStorage.removeItem("temp_extra")

        // 🚀 Now go to your app
        router.push("/create/heartsfilled")

      } catch (err) {
        console.error("Sign-in error:", err)
      }
    }

    completeSignIn()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-20 text-5xl opacity-40">🎉</div>
      <div className="absolute bottom-20 right-32 text-4xl opacity-40">🎂</div>
      <div className="absolute top-1/3 right-20 text-5xl opacity-40">🎈</div>
      <div className="absolute bottom-32 left-1/4 text-4xl opacity-40">✨</div>

      <div className="relative z-10 text-center px-4">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-12 border-2 border-rose-100 max-w-md">
          {/* Animated loading indicator */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Almost There!
          </h1>

          <p className="text-slate-600 text-lg mb-2">
            Signing you in and saving your data...
          </p>

          <p className="text-sm text-slate-500">
            Get ready to create some birthday magic!
          </p>
        </div>
      </div>
    </div>
  )
}
