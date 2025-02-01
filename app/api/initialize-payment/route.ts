import { NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(req: Request) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Paystack secret key not configured' },
      { status: 500 }
    )
  }

  try {
    const { email, amount, plan } = await req.json()

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro?status=success`,
        metadata: {
          plan,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    return NextResponse.json(data.data)
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
