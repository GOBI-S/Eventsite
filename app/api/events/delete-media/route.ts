import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { public_id, type } = await req.json();

    if (!public_id) {
      return NextResponse.json({ error: "public_id missing" }, { status: 400 });
    }

    await cloudinary.uploader.destroy(public_id, {
      resource_type: type === "audio" ? "video" : "image",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
