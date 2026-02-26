import { connectDB } from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import Datapv from "@/lib/models/Datapv"
import { notFound } from "next/navigation"
import HeartsFilledTemplate from "@/templates/heartsfilled/TemplateWrapper"

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  await connectDB()
  const { slug } = await params

  // 1️⃣ Get event using slug
  const event = await Event.findOne({ slug })

  if (!event) {
    notFound()
  }

  // 2️⃣ Expiry check
  if (new Date(event.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        This birthday surprise has expired 🎂
      </div>
    )
  }
  const photos = (event.photos || []).map((p: any) => String(p))
  const music = event.musicUrl ? String(event.musicUrl) : ""

//   // 3️⃣ Fetch paid media
//   const media = await Datapv.find({
//     eventId: event._id,
//     paid: true
//   })

//   const photos = media
//     .filter((m) => m.type === "image")
//     .map((m) => m.url)

//   const music = media.find((m) => m.type === "audio")?.url

  // 4️⃣ Build TemplateData
  const templateData = {
    birthdayPersonName: event.birthdayPersonName,
    birthdayDate: new Date(event.birthdayDate).toISOString(),
    fromName: event.fromName,
    message: event.message,
    photos: (event.photos || []).map((p: any) => p.url),
    musicUrl: music,
  }

  return <HeartsFilledTemplate data={templateData} />
}