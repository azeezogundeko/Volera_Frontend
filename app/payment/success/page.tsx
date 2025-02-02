'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams?.get('plan');
  const reference = searchParams?.get('reference');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="container relative flex items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <Card className="w-full max-w-md mx-auto bg-[#111111] border-white/5 hover:border-emerald-500/20 transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col items-center space-y-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Payment Successful!
              </h1>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-400 text-sm sm:text-base">
              Thank you for purchasing the <span className="text-emerald-400 font-medium">{plan}</span>. Your credits have been added successfully.
            </p>
            <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-xl">
              <p className="text-xs sm:text-sm text-gray-400">Transaction Reference: <span className="text-gray-300 font-medium">{reference}</span></p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full max-w-xs group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 text-sm"
            >
              <span className="flex items-center justify-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </CardFooter>
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