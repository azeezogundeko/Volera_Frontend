'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { NotificationContainer } from '@/components/Notification'
import type { PaystackPaymentProps } from '@/components/PaystackPayment'

// Dynamically import Paystack to ensure it's only loaded client-side
const PaystackPayment = dynamic<PaystackPaymentProps>(
  () => import('@/components/PaystackPayment'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-emerald-400">Loading payment system...</div>
      </div>
    )
  }
);

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface PaymentData {
  email: string;
  amount: number;
  plan: string;
}

const CheckoutContent = () => {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams?.get('plan') ?? ''
  const amount = searchParams?.get('amount') ?? '0'
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([])
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Handle client-side initialization
  useEffect(() => {
    setIsMounted(true)
    loadUserData()
  }, [])

  // Safely load user data from localStorage
  const loadUserData = () => {
    try {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user')
        const parsedUser = user ? JSON.parse(user) as User | null : null
        setUserEmail(parsedUser?.email ?? null)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, 3300)
  }

  const handlePaymentSuccess = async (transaction: { reference: string; transaction: string }) => {
    router.push(`/payment/processing?plan=${plan}&reference=${transaction.reference}`)
    
    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          transaction_id: transaction.transaction,
          plan_name: plan.toLowerCase(),
          email: userEmail
        })
      });

      if (!verifyResponse.ok) {
        throw new Error('Payment verification failed');
      }

      const verificationData = await verifyResponse.json();
      
      if (verificationData.status) {
        addNotification('Payment successful! Redirecting...', 'success');
        setTimeout(() => {
          router.push(`/payment/success?plan=${plan}&reference=${transaction.reference}`);
        }, 2000);
      } else {
        addNotification('Payment verification failed. Please contact support.', 'error');
        setTimeout(() => {
          router.push(`/payment/failed?reason=verification_failed`);
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      addNotification('Error verifying payment. Please contact support.', 'error');
      setTimeout(() => {
        router.push(`/payment/failed?reason=verification_error`);
      }, 2000);
    }
  }

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error)
    addNotification('Payment failed. Please try again.', 'error')
    setTimeout(() => {
      router.push(`/payment/failed?reason=payment_error`);
    }, 2000);
  }

  const handlePaymentCancel = () => {
    addNotification('Payment was cancelled', 'error')
    setTimeout(() => {
      router.push(`/payment/failed?reason=cancelled`);
    }, 2000);
  }

  const handlePayment = async () => {
    setLoading(true)
    
    if (!userEmail) {
      setLoading(false)
      addNotification('Please log in to complete your payment', 'error')
      
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('redirectAfterLogin', window.location.href)
        }
      } catch (error) {
        console.error('Error saving redirect URL:', error)
      }
      
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      return
    }

    const paymentData: PaymentData = {
      email: userEmail,
      amount: parseInt(amount || '0') * 100, // Convert to kobo
      plan: plan
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/initialize-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Payment initialization failed:', data.error)
        addNotification('Payment initialization failed. Please try again.', 'error')
        return
      }

      return data.access_code
    } catch (error) {
      console.error('Payment error:', error)
      addNotification('An error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state before client-side hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-emerald-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <NotificationContainer notifications={notifications} />
      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.07] border border-white/10">
        <h1 className="text-3xl font-bold text-center">Complete Your Payment</h1>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg">Selected Plan: <span className="font-semibold">{plan}</span></p>
            <p className="text-2xl font-bold">₦{amount}</p>
          </div>
          <PaystackPayment
            onInitialize={handlePayment}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

const CheckoutPage = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="text-emerald-400">Loading...</div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}

export default CheckoutPage
