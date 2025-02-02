'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Paystack from '@paystack/inline-js'
import { NotificationContainer } from '@/components/Notification'
import process from 'process'

interface User {
  first_name: string;
  last_name: string;
  email: string;
  // Add other properties as needed
}

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams?.get('plan') ?? ''
  const amount = searchParams?.get('amount') ?? '0'
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([])

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, 3300) // Slightly longer than the notification display time
  }

  const handlePayment = async () => {
    setLoading(true)
    
    // Get user email from localStorage
    const user = localStorage.getItem('user')
    const parsedUser = user ? JSON.parse(user) as User | null : null
    const userEmail = parsedUser?.email
    
    if (!userEmail) {
      setLoading(false)
      addNotification('Please log in to complete your payment', 'error')
      
      // Save current URL to redirect back after login
      const currentUrl = window.location.href
      localStorage.setItem('redirectAfterLogin', currentUrl)
      
      // Delay redirect slightly to ensure notification is visible
      setTimeout(() => {
        router.push('/login')
      }, 1000)
      return
    }

      const paymentData = {
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
          return
        }

        const { access_code, _ } = data
        
        const popup = new Paystack()
        
        popup.resumeTransaction(access_code, {
          onSuccess: async (transaction) => {
            router.push(`/payment/processing?plan=${plan}&reference=${transaction.reference}`)
            console.log('Payment successful:', transaction)
            try {
                const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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
                // Show success notification before redirect
                addNotification('Payment successful! Redirecting...', 'success');
                // Delay redirect to show notification
                setTimeout(() => {
                  router.push(`/payment/success?plan=${plan}&reference=${transaction.reference}`);
                }, 2000);
              } else {
                // If verification shows payment wasn't successful
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
          },
          onCancel: () => {
            addNotification('Payment was cancelled', 'error')
            setTimeout(() => {
              router.push(`/payment/failed?reason=cancelled`);
            }, 2000);
          },
          onError: (error) => {
            addNotification('Payment failed. Please try again.', 'error')
            setTimeout(() => {
              router.push(`/payment/failed?reason=payment_error`);
            }, 2000);
          }
        })
      } catch (error) {
        addNotification('An error occurred. Please try again.', 'error')
      } finally {
        setLoading(false)
      }
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
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl text-sm font-medium transition-all duration-300
              bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
