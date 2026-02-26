"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowRight, Camera, Music, Sparkles, Heart } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface CreatorData {
  birthdayPersonName: string;
  fromName: string;
  birthdayDate: string;
  message: string;
  slug: string;
  photos: { url: string; public_id: string }[];
  music: {
    url: string;
    public_id: string;
  } | null;
}

export default function CreatePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const createEvent = async () => {
      if (!user) return;

      const existing = localStorage.getItem("eventId");
      if (existing) return;

      const res = await fetch("/api/events/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerUid: user.uid }),
      });

      const data = await res.json();
      localStorage.setItem("eventId", data.eventId);
    };

    createEvent();
  }, [user]);

  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setUser(user);
    });
    return () => unsub();
  }, [router]);

  const [formData, setFormData] = useState<CreatorData>({
    birthdayPersonName: "",
    fromName: "",
    birthdayDate: "",
    message: "",
    slug: "",
    photos: [],
    music: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("birthdayDraft");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("birthdayDraft", JSON.stringify(formData));
  }, [formData]);
  //   const getEventId = () => {
  //   let id = localStorage.getItem("eventId");

  //   if (!id) {
  //     id = crypto.randomUUID();
  //     localStorage.setItem("eventId", id);
  //   }

  //   return id;
  // };
  const eid = localStorage.getItem("eventId");

  const cleanSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "birthdayPersonName" && { slug: cleanSlug(value) }),
    }));
  };

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (u) => {
  //     if (!u) router.push("/login");
  //     else setUser(u);
  //   });
  //   return () => unsub();
  // }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);

    if (!user) {
      alert("Login expired");
      return;
    }

    const remaining = 8 - formData.photos.length;
    if (remaining <= 0) {
      alert("Maximum 8 photos allowed");
      return;
    }

    const allowedFiles = files.slice(0, remaining);

    for (const file of allowedFiles) {
      console.log("EVENT ID SENDING:", eid);
      const body = new FormData();
      body.append("file", file);
      body.append("ownerUid", user.uid); // ⭐ REQUIRED
      body.append("eventId", eid || ""); // ⭐ REQUIRED
      body.append("type", "image"); // ⭐ REQUIRED

      try {
        const res = await fetch("/api/events/upload", {
          method: "POST",
          body,
        });

        const data = await res.json();

        if (data.url) {
          setFormData((prev) => ({
            ...prev,
            photos: [
              ...prev.photos,
              {
                url: data.url,
                public_id: data.publicId,
              },
            ],
          }));
        }
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }

    e.target.value = "";
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    if (!user) {
      alert("Login expired");
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("ownerUid", user.uid); // ⭐ REQUIRED
    body.append("eventId", eid || ""); // ⭐ REQUIRED
    body.append("type", "audio"); // ⭐ REQUIRED

    try {
      const res = await fetch("/api/events/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          music: {
            url: data.url,
            public_id: data.publicId,
          },
        }));
      }
    } catch (err) {
      console.error("Music upload failed", err);
    } finally {
      setIsUploading(false);
    }

    e.target.value = "";
  };

  const handleDeletePhoto = async (index: number) => {
    const photo = formData.photos[index];

    try {
      await fetch("/api/events/delete-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: photo.public_id,
          type: "image",
        }),
      });
    } catch (err) {
      console.error("Delete failed", err);
    }

    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteMusic = async () => {
    if (!formData.music) return;

    try {
      await fetch("/api/events/delete-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: formData.music.public_id,
          type: "audio",
        }),
      });
    } catch (err) {
      console.error("Delete music failed", err);
    }

    setFormData((prev) => ({
      ...prev,
      music: null,
    }));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const goToPreview = () => {
    router.push("/preview/heartsfilled");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
          <div className="animate-spin h-16 w-16 border-4 border-white border-t-transparent rounded-full mb-6" />
          <h2 className="text-white text-xl font-semibold">
            Uploading your memories...
          </h2>
          <p className="text-white/70 text-sm mt-2">
            Please don’t close this page
          </p>
        </div>
      )}
      {/* Animated confetti background - responsive positioning */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute text-2xl sm:text-3xl lg:text-4xl animate-bounce hidden sm:block"
          style={{ animationDelay: "0s", top: "2.5rem", left: "1.25rem" }}
        >
          🎉
        </div>
        <div
          className="absolute text-2xl sm:text-3xl animate-bounce hidden md:block"
          style={{ animationDelay: "0.2s", top: "8rem", right: "2rem" }}
        >
          🎂
        </div>
        <div
          className="absolute text-2xl sm:text-3xl lg:text-4xl animate-bounce hidden lg:block"
          style={{ animationDelay: "0.4s", bottom: "10rem", left: "2.5rem" }}
        >
          🎈
        </div>
        <div
          className="absolute text-2xl sm:text-3xl animate-bounce"
          style={{ animationDelay: "0.6s", top: "1.25rem", right: "1.25rem" }}
        >
          ✨
        </div>
        <div
          className="absolute text-2xl sm:text-3xl lg:text-4xl animate-bounce hidden lg:block"
          style={{ animationDelay: "0.8s", bottom: "8rem", right: "2.5rem" }}
        >
          🎊
        </div>
      </div>

      {/* Header - responsive */}
      <div className="border-b bg-gradient-to-r from-white/70 to-rose-50/70 backdrop-blur-xl sticky top-0 z-40 shadow-lg border-rose-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 relative">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-rose-600 mb-3 sm:mb-4 hover:text-rose-700 transition-colors font-semibold text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Templates
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 animate-pulse flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Birthday Surprise
            </h1>
          </div>
          {/* Profile Icon - responsive */}
          {user && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-6 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg cursor-pointer">
                {user.photoURL ? (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-sm sm:text-lg font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white border rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <div className="p-3 sm:p-4 border-b">
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-red-600 hover:bg-red-50 rounded-b-xl text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          <p className="text-purple-700 mt-2 font-medium text-sm sm:text-base">
            Make memories sparkle with personalized celebration ✨
          </p>
        </div>
      </div>

      {/* Main Content - responsive grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card className="border-2 border-rose-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow hover:border-rose-300">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-rose-700 text-lg sm:text-xl">
                <Heart className="w-5 h-5" />
                Birthday Person & You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 sm:pt-6 p-4 sm:p-6">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">
                  Their Name
                </label>
                <Input
                  name="birthdayPersonName"
                  placeholder="Who's the birthday star?"
                  value={formData.birthdayPersonName}
                  onChange={handleInputChange}
                  className="border-2 border-rose-200 focus:border-rose-500 h-10 sm:h-12 text-sm sm:text-lg hover:border-rose-300 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">
                  Your Name
                </label>
                <Input
                  name="fromName"
                  placeholder="Your name"
                  value={formData.fromName}
                  onChange={handleInputChange}
                  className="border-2 border-rose-200 focus:border-rose-500 h-10 sm:h-12 text-sm sm:text-lg hover:border-rose-300 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">
                  Birthday Date
                </label>
                <Input
                  type="date"
                  name="birthdayDate"
                  value={formData.birthdayDate}
                  onChange={handleInputChange}
                  className="border-2 border-rose-200 focus:border-rose-500 h-10 sm:h-12 hover:border-rose-300 transition-colors text-sm sm:text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card className="border-2 border-purple-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow hover:border-purple-300">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 sm:p-6">
              <CardTitle className="text-purple-700 text-lg sm:text-xl">
                💌 Your Special Message
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <Textarea
                name="message"
                placeholder="Write your heartfelt birthday message..."
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="border-2 border-purple-200 focus:border-purple-500 text-sm sm:text-lg resize-none hover:border-purple-300 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-2">
                {formData.message.length} characters
              </p>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-2 border-pink-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow hover:border-pink-300">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-pink-700 text-lg sm:text-xl">
                <Camera className="w-5 h-5" />
                Photo Memories (up to 8)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div
                onClick={() => photoInputRef.current?.click()}
                className="border-3 border-dashed border-pink-300 rounded-xl p-6 sm:p-12 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all group"
              >
                <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-pink-400 group-hover:text-pink-600 mx-auto mb-2 sm:mb-3 transition-colors" />
                <p className="font-semibold text-slate-700 mb-1 text-sm sm:text-base">
                  Drop your photos here
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  Click to upload memories
                </p>
                <input
                  ref={photoInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                    {formData.photos.length}/8 photos added ✓
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {formData.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden shadow-lg border-2 border-pink-200 hover:border-pink-500 transition-colors transform hover:scale-105 group"
                      >
                        <img
                          src={photo.url}
                          alt={`Memory ${idx + 1}`}
                          className="w-full h-20 sm:h-24 object-cover"
                        />

                        <button
                          onClick={() => handleDeletePhoto(idx)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <span className="text-white font-bold text-lg">
                            ✕
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Music */}
          <Card className="border-2 border-purple-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow hover:border-purple-300">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-purple-700 text-lg sm:text-xl">
                <Music className="w-5 h-5" />
                Birthday Soundtrack
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div
                onClick={() => musicInputRef.current?.click()}
                className="border-3 border-dashed border-purple-300 rounded-xl p-6 sm:p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <Music className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 group-hover:text-purple-600 mx-auto mb-2 sm:mb-3 transition-colors" />
                <p className="font-semibold text-slate-700 mb-1 text-sm sm:text-base">
                  Add a celebration song
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  One audio file to set the mood
                </p>
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="hidden"
                />
              </div>
              {formData.music && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-purple-50 rounded-lg border-2 border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <p className="text-xs sm:text-sm text-purple-900">
                    🎵 Your song is ready to go!
                  </p>
                  <button
                    onClick={handleDeleteMusic}
                    className="w-full sm:w-auto ml-0 sm:ml-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons - responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-3 sm:bottom-4">
            <Button
              variant="outline"
              className="flex-1 h-10 sm:h-12 text-xs sm:text-base border-2 border-rose-400 hover:border-rose-600 hover:bg-rose-50 text-rose-700 font-semibold bg-transparent"
              onClick={goToPreview}
            >
              👀 Preview Experience
            </Button>
            <Button
              className="flex-1 h-10 sm:h-12 text-xs sm:text-base bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-xl font-semibold transform hover:scale-105 transition-transform"
              asChild
            >
              <Link href="/payment">Proceed to Payment ✨</Link>
            </Button>
          </div>
        </div>

        {/* Progress Sidebar - responsive */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <Card className="border-2 border-rose-200 shadow-xl bg-gradient-to-br from-white to-rose-50 backdrop-blur-sm hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 sm:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                <Sparkles className="w-5 h-5 animate-spin" />
                Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors flex-shrink-0 ${formData.birthdayPersonName ? "bg-rose-500" : "bg-slate-300"}`}
                  >
                    {formData.birthdayPersonName ? "✓" : "1"}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors ${formData.birthdayPersonName ? "text-rose-700 font-semibold" : "text-slate-500"}`}
                  >
                    Birthday Person's Name
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors flex-shrink-0 ${formData.fromName ? "bg-rose-500" : "bg-slate-300"}`}
                  >
                    {formData.fromName ? "✓" : "2"}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors ${formData.fromName ? "text-rose-700 font-semibold" : "text-slate-500"}`}
                  >
                    Your Name
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors flex-shrink-0 ${formData.birthdayDate ? "bg-pink-500" : "bg-slate-300"}`}
                  >
                    {formData.birthdayDate ? "✓" : "3"}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors ${formData.birthdayDate ? "text-pink-700 font-semibold" : "text-slate-500"}`}
                  >
                    Birthday Date
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors flex-shrink-0 ${formData.message ? "bg-purple-500" : "bg-slate-300"}`}
                  >
                    {formData.message ? "✓" : "4"}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors ${formData.message ? "text-purple-700 font-semibold" : "text-slate-500"}`}
                  >
                    Birthday Message
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors flex-shrink-0 ${formData.photos.length > 0 ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                    {formData.photos.length > 0 ? "✓" : "5"}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors ${formData.photos.length > 0 ? "text-blue-700 font-semibold" : "text-slate-500"}`}
                  >
                    Add Photos (optional)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors flex-shrink-0 ${formData.music ? "bg-orange-500" : "bg-slate-300"}`}
                  >
                    {formData.music ? "✓" : "6"}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors ${formData.music ? "text-orange-700 font-semibold" : "text-slate-500"}`}
                  >
                    Add Music (optional)
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-rose-200">
                <p className="text-xs sm:text-sm text-slate-600 text-center font-medium">
                  {formData.birthdayPersonName &&
                  formData.fromName &&
                  formData.birthdayDate &&
                  formData.message
                    ? "✨ Ready to preview!"
                    : "Complete all required fields"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
