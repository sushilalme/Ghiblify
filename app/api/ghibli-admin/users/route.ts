import { NextResponse } from "next/server"
import connectMongoDB from "@/lib/mongodb"
import User from "@/modals/user"

export async function GET() {
  try {
    await connectMongoDB()
    const users = await User.find().sort({ createdAt: -1 })
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, status } = await request.json()
    await connectMongoDB()
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true })
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}