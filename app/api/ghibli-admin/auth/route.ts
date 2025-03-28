import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PWD

    if (!adminPassword) {
      console.error("ADMIN_PWD environment variable is not set")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    if (password === adminPassword) {
      return NextResponse.json(
        { success: true, message: "Authentication successful" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}