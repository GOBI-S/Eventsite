import { connectDB } from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import Datapv from "@/lib/models/Datapv"
import cloudinary from "@/lib/cloudinary"

export async function GET() {

  try {

    await connectDB()

    const now = new Date()

    let tempDeleted = 0
    let paidDeleted = 0

    // ==========================
    // 1️⃣ TEMP MEDIA CLEANUP (24h unpaid)
    // ==========================

    const tempCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const expiredTempMedia = await Datapv.find({
      paid: false,
      createdAt: { $lte: tempCutoff }
    })

    for (const media of expiredTempMedia) {

      try {

        await cloudinary.uploader.destroy(
          media.publicId,
          {
            resource_type:
              media.type === "audio"
                ? "video"
                : "image"
          }
        )

        await Datapv.deleteOne({ _id: media._id })

        tempDeleted++

      } catch (err) {
        console.error("Temp media delete failed:", media.publicId, err)
      }
    }


    // ==========================
    // 2️⃣ PAID EVENT CLEANUP (3 day expiry)
    // ==========================

    const expiredEvents = await Event.find({
      expiresAt: { $lte: now }
    })

    for (const event of expiredEvents) {

      try {

        const mediaList = await Datapv.find({
          eventId: event._id,
          paid: true
        })

        for (const media of mediaList) {

          try {

            await cloudinary.uploader.destroy(
              media.publicId,
              {
                resource_type:
                  media.type === "audio"
                    ? "video"
                    : "image"
              }
            )

            paidDeleted++

          } catch (cloudErr) {
            console.error("Paid media delete failed:", media.publicId, cloudErr)
          }
        }

        await Datapv.deleteMany({
          eventId: event._id,
          paid: true
        })

        console.log("Cleaned paid media for event:", event._id)

      } catch (err) {
        console.error("Paid cleanup failed for event:", event._id, err)
      }
    }

    return Response.json({
      success: true,
      tempDeleted,
      paidDeleted
    })

  } catch (err) {

    console.error("Daily cleanup failed:", err)

    return Response.json({
      success: false
    }, { status: 500 })
  }
}