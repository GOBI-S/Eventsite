import { connectDB } from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import Datapv from "@/lib/models/Datapv"
import cloudinary from "@/lib/cloudinary"

export async function GET() {

  try {

    await connectDB()

    const now = new Date()

    // 1️⃣ Find expired events (3 day expiry)
    const expiredEvents = await Event.find({
      expiresAt: { $lte: now }
    })

    let deletedMediaCount = 0

    for (const event of expiredEvents) {

      try {

        // 2️⃣ Find all paid media for this event
        const mediaList = await Datapv.find({
          eventId: event._id,
          paid: true
        })

        // 3️⃣ Delete media from Cloudinary
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

            deletedMediaCount++

          } catch (cloudErr) {
            console.error("Cloud delete failed:", media.publicId, cloudErr)
          }
        }

        // 4️⃣ Remove Datapv records
        await Datapv.deleteMany({
          eventId: event._id,
          paid: true
        })

        console.log("Media cleaned for event:", event._id)

      } catch (err) {
        console.error("Event cleanup failed:", event._id, err)
      }
    }

    return Response.json({
      success: true,
      mediaDeleted: deletedMediaCount
    })

  } catch (err) {

    console.error("Paid cleanup failed:", err)

    return Response.json({
      success: false
    }, { status: 500 })

  }
}