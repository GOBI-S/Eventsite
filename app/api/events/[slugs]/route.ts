import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Event from "@/lib/models/Event"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB()

  const event = await Event.findOne({ slug: params.slug })

  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(event)
}
