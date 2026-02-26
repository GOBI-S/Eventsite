import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Datapv from "@/lib/models/Datapv"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: Request) {
  await connectDB()

  const formData = await req.formData()
  const file = formData.get("file") as File
  const ownerUid = formData.get("ownerUid") as string
  const type = formData.get("type") as string

  const eventId = formData.get("eventId") as string

if (!file || !ownerUid || !eventId) {
  return NextResponse.json({ error: "Missing data" }, { status: 400 })
}


  const buffer = Buffer.from(await file.arrayBuffer())

  const upload: any = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "eventsites", resource_type: "auto" },
      (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })

  // 💾 SAVE TEMP
  await Datapv.create({
    ownerUid,
    url: upload.secure_url,
    publicId: upload.public_id,
    eventId,
    type,
    paid: false,
  })

  return NextResponse.json({
    url: upload.secure_url,
    publicId: upload.public_id,
  })
}
