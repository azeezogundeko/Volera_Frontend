import { useEffect } from 'react'
import Paystack from '@paystack/inline-js'

export interface PaystackPaymentProps {
  onInitialize: () => Promise<string | undefined>
  onSuccess: (transaction: { reference: string; transaction: string }) => void
  onError: (error: Error) => void
  onCancel: () => void
  loading: boolean
}

const PaystackPayment = ({
  onInitialize,
  onSuccess,
  onError,
  onCancel,
  loading
}: PaystackPaymentProps) => {
  const handlePayment = async () => {
    try {
      const accessCode = await onInitialize()
      if (!accessCode) return

      const popup = new Paystack()
      popup.resumeTransaction(accessCode, {
        onSuccess,
        onCancel,
        onError: (error: Error) => {
          console.error('Paystack error:', error)
          onError(error)
        }
      })
    } catch (error) {
      console.error('Failed to initialize Paystack:', error)
      onError(error as Error)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-4 px-6 rounded-xl text-sm font-medium transition-all duration-300
        bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}

export default PaystackPayment 