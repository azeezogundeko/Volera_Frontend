'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const errorMessages = {
  verification_failed: 'We could not verify your credit purchase. Please contact support for assistance.',
  verification_error: 'There was an error verifying your payment. Our team has been notified.',
  cancelled: 'The payment process was cancelled.',
  payment_error: 'There was an error processing your payment.',
  default: 'Something went wrong with your credit purchase.'
};

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams?.get('reason') || 'default';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="container relative flex items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <Card className="w-full max-w-md mx-auto bg-[#111111] border-white/5 hover:border-emerald-500/20 transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col items-center space-y-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Payment Failed
              </h1>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-400 text-sm sm:text-base">
              {errorMessages[reason as keyof typeof errorMessages]}
            </p>
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button 
                onClick={() => router.push('/credits')}
                className="w-full group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 text-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  Try Again
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/support')}
                className="w-full group bg-gradient-to-b from-white/[0.03] to-white/[0.07] hover:from-white/[0.05] hover:to-white/[0.1] border-white/10 text-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  Contact Support
                  <MessageCircle className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>
    </div>
  );
}