import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {  VerificationForm } from '@/components/VerificationForm';

export const metadata: Metadata = {
  title: 'Verify Your Account - Volera',
  description: 'Enter the verification code sent to your email to complete your registration.',
};

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We sent a verification code to your email. Please enter it below.
          </p>
        </div>

        <VerificationForm />

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
} 