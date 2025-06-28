import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { password } = await request.json()

    // Verify password
    if (password !== "1485") {
      return NextResponse.json({ error: "Unauthorized: Invalid password" }, { status: 401 })
    }

    // Log the reset action
    console.log("Vote reset requested at:", new Date().toISOString())

    // Here you would typically reset your database
    // For example:
    // await db.votes.deleteMany({})
    // await db.playerStats.deleteMany({})

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("All votes have been reset successfully")

    return NextResponse.json({
      success: true,
      message: "All votes have been reset successfully",
      resetAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error resetting votes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Reset API endpoint",
    method: "POST",
    description: "Reset all voting data with admin password",
  })
}
