import { connectDB } from "@/lib/mongodb"
import Datapv from "@/lib/models/Datapv"
import cloudinary from "@/lib/cloudinary"

export async function GET() {

  try {

    await connectDB()

    // 24 hour cutoff
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Find unpaid media older than 24h
    const expiredMedia = await Datapv.find({
      paid: false,
      createdAt: { $lte: cutoff }
    })

    let deletedCount = 0

    for (const media of expiredMedia) {

      try {

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(
          media.publicId,
          {
            resource_type:
              media.type === "audio"
                ? "video"
                : "image"
          }
        )

        // Delete from DB
        await Datapv.deleteOne({ _id: media._id })

        deletedCount++

        console.log("Deleted temp media:", media.publicId)

      } catch (cloudErr) {

        console.error("Cloudinary delete failed:", media.publicId, cloudErr)

      }
    }

    return Response.json({
      success: true,
      deleted: deletedCount
    })

  } catch (err) {

    console.error("Temp cleanup failed:", err)

    return Response.json({
      success: false,
      error: "Cleanup failed"
    }, { status: 500 })

  }
}