"use client";

import HeartsFilledTemplate from "@/templates/heartsfilled/TemplateWrapper";

export default function PreviewPage() {
  // 🎂 Fake demo data (STATIC PREVIEW)
  const demoData = {
    birthdayPersonName: "Aarav",
    birthdayDate: "2025-11-25",
    fromName: "Priya",
    message:
      "Happy Birthday Aarav! 🎉\n\nYou are the reason so many people smile every day. May this year bring you endless happiness, success, and unforgettable memories. Never stop being the amazing person you are! ❤️",
    photos: [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176",

]
,
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  return <HeartsFilledTemplate data={demoData} />;
}
