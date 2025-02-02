'use client';

import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentProcessingPage() {
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="container relative flex items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <Card className="w-full max-w-md mx-auto bg-[#111111] border-white/5 transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 animate-pulse" />
              <Loader2 className="w-10 h-10 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Processing Payment
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Please wait while we verify your payment...
              </p>
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
