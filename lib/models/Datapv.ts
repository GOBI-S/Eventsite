import mongoose from "mongoose"

const DatapvSchema = new mongoose.Schema({
  ownerUid: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  type: { type: String, enum: ["image", "audio"], required: true },
  paid: { type: Boolean, default: false },
  eventId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Datapv || mongoose.model("Datapv", DatapvSchema)
