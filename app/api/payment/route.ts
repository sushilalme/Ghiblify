import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
// In a real app, you would use an environment variable
const stripe = new Stripe("sk_test_your_stripe_key", {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const { amount = 100 } = await request.json() // Amount in cents (100 = $1.00)

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

