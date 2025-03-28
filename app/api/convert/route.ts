import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import connectMongoDB from "@/lib/mongodb"
import User from "@/modals/user"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const email = formData.get("email") as string
    const upiId = formData.get("upiId") as string

    // Log received data
    console.log("Received data:", {
      hasImage: !!image,
      email,
      upiId,
      imageType: image?.type,
      imageSize: image?.size
    })

    if (!image || !email || !upiId) {
      return NextResponse.json({
        error: "Missing required fields",
        details: {
          hasImage: !!image,
          hasEmail: !!email,
          hasUpiId: !!upiId
        }
      }, { status: 400 })
    }

    // Convert File to buffer
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ghibli-converter",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    // Connect to MongoDB
    await connectMongoDB()

    // Create new user record
    const user = await User.create({
      upiId,
      img: (uploadResponse as any).secure_url,
      emailAddress: email,
      status: 'Pending'
    })

    // Return the public URL and user id
    return NextResponse.json({
      url: (uploadResponse as any).secure_url,
      userId: user._id
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}