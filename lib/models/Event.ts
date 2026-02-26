import mongoose from "mongoose"

const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
})

const EventSchema = new mongoose.Schema({
  ownerUid: { type: String, required: true },

  slug: { type: String, required: true, unique: true },

  birthdayPersonName: String,
  fromName: String,
  birthdayDate: Date,
  message: String,
  Eventid: String,

  photos: [MediaSchema],   // ⭐⭐⭐ changed
  music: MediaSchema,  

  payment: {
    orderId: String,
    paymentId: String,
    signature: String,
    amount: Number,
    status: String,
  },

  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
})

export default mongoose.models.Event || mongoose.model("Event", EventSchema)
