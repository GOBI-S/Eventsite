import { NextResponse } from "next/server"
import crypto from "crypto"
import Razorpay from "razorpay"
import { connectDB } from "@/lib/mongodb"
import Event from "@/lib/models/Event"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    // 🔐 verify signature
    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex")

    if (generated !== razorpay_signature) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    // 🧠 get stored draft
    const draft = JSON.parse(
      body.draft || "{}"
    )

    if (!draft.ownerUid) {
      return NextResponse.json({ error: "No owner" }, { status: 400 })
    }

    // 🎯 create event
    const event = await Event.create({
      ...draft,
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "paid",
      },
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    })

    return NextResponse.json({
      success: true,
      slug: event.slug,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}
