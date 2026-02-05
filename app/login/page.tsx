"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useRouter } from "next/navigation"


export default function LoginPage() {
    const router = useRouter()

  const googleProvider = new GoogleAuthProvider();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    extra: "",
    email: "",
  });
  const [sent, setSent] = useState(false);

  const actionCodeSettings = {
    url: "http://localhost:3000/finish-signin",
    handleCodeInApp: true,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendLink = async () => {
    if (!form.email || !form.name) {
      alert("Name and Email are required");
      return;
    }

    // 🧠 Store data temporarily BEFORE verification
    localStorage.setItem("temp_name", form.name);
    localStorage.setItem("temp_gender", form.gender);
    localStorage.setItem("temp_extra", form.extra);
    localStorage.setItem("emailForSignIn", form.email);

    await sendSignInLinkToEmail(auth, form.email, actionCodeSettings);
    setSent(true);
  };
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google user:", user);

    //   await fetch("/api/users/save", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       uid: user.uid,
    //       name: user.displayName,
    //       gender: null,
    //       extra: null,
    //       email: user.email,
    //     }),
    //   });

      router.push("/create/heartsfilled");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-20 text-4xl opacity-30">🎉</div>
      <div className="absolute bottom-20 right-32 text-3xl opacity-30">🎂</div>
      <div className="absolute top-1/3 right-20 text-4xl opacity-30">🎈</div>

      <div className="p-8 bg-white/95 backdrop-blur rounded-2xl shadow-2xl w-96 border-2 border-rose-100 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Join the Celebration
          </h1>
          <p className="text-slate-600">Create your birthday magic today</p>
        </div>

        {sent ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
            <p className="text-center text-green-700 font-semibold">
              ✅ Verification link sent!
            </p>
            <p className="text-center text-green-600 text-sm mt-2">
              Check your email to complete your account setup.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full border-2 border-rose-200 hover:border-rose-300 focus:border-rose-500 p-3 rounded-lg mb-3 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200 text-slate-900 placeholder-slate-400"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Gender
              </label>
              <select
                name="gender"
                className="w-full border-2 border-rose-200 hover:border-rose-300 focus:border-rose-500 p-3 rounded-lg mb-3 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200 text-slate-900"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="" className="text-slate-500">
                  Select Gender
                </option>
                <option className="text-slate-900">Male</option>
                <option className="text-slate-900">Female</option>
                <option className="text-slate-900">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Extra Info (optional)
              </label>
              <input
                type="text"
                name="extra"
                placeholder="Age, relationship, or any fun fact"
                className="w-full border-2 border-rose-200 hover:border-rose-300 focus:border-rose-500 p-3 rounded-lg mb-3 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200 text-slate-900 placeholder-slate-400"
                value={form.extra}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full border-2 border-rose-200 hover:border-rose-300 focus:border-rose-500 p-3 rounded-lg mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200 text-slate-900 placeholder-slate-400"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <button
              onClick={signInWithGoogle}
              className="w-full mt-3 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold shadow flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <button
              onClick={sendLink}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Verify Email & Continue ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
