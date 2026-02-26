import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Event from "@/lib/models/Event"

export async function POST(req: Request) {
  await connectDB()

  const { ownerUid } = await req.json()

  if (!ownerUid) {
    return NextResponse.json({ error: "No user" }, { status: 400 })
  }

  const event = await Event.create({
    ownerUid,
    paid: false,
  })

  return NextResponse.json({ eventId: event._id })
}
