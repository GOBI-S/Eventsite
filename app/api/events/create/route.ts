import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import crypto from "crypto"

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  // 🎯 generate unique slug
  const random = crypto.randomBytes(3).toString("hex")
  const slug =
    body.birthdayPersonName.toLowerCase().replace(/\s+/g, "-") +
    "-" +
    random

  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

  const event = await Event.create({
    ...body,
    slug,
    expiresAt,
  })

  return NextResponse.json({ success: true, event })
}
