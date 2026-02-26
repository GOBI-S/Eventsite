import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Datapv from "@/lib/models/Datapv"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { eventId, ownerUid } = await req.json()

    if (!eventId || !ownerUid) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    await Datapv.updateMany(
      { eventId, ownerUid, paid: false },
      { $set: { paid: true } }
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
