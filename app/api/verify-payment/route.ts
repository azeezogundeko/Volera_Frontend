import { NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Paystack secret key not configured' },
      { status: 500 }
    );
  }

  try {
    const { reference, plan, email } = await req.json();

    // 1. Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyData.status) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // 2. Validate payment amount matches plan
    const expectedAmounts = {
      'monthly': 5000 * 100, // ₦5,000 in kobo
      'yearly': 50000 * 100, // ₦50,000 in kobo
    };

    const expectedAmount = expectedAmounts[plan.toLowerCase() as keyof typeof expectedAmounts];
    if (verifyData.data.amount !== expectedAmount) {
      return NextResponse.json(
        { success: false, error: 'Payment amount mismatch' },
        { status: 400 }
      );
    }

    // 3. Save subscription to database
    // TODO: Replace with your actual database call
    const subscriptionData = {
      email,
      plan,
      reference,
      amount: verifyData.data.amount,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
    };

    try {
      // Make API call to your backend to save subscription
      const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save subscription');
      }

      return NextResponse.json({ success: true, data: subscriptionData });
    } catch (error) {
      console.error('Error saving subscription:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save subscription' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
