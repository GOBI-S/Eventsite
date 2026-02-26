import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Datapv from "@/lib/models/Datapv"
import cloudinary from "@/lib/cloudinary"

export async function GET() {
  console.log("🧹 Cron started")

  await connectDB()

  const old = new Date(Date.now() - 30 * 60 * 1000)

  const items = await Datapv.find({
    paid: false,
    createdAt: { $lt: old },
  })

  for (const item of items) {
    try {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === "audio" ? "video" : "image",
      })
      console.log("Deleted:", item.publicId)
    } catch (e) {
      console.log("Delete failed but DB cleaned")
    }

    await item.deleteOne()
  }

  return NextResponse.json({ done: true })
}
