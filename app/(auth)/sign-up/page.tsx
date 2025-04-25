import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | BizOS',
  description: 'Create your BizOS account',
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">BizOS</h1>
        <p className="mt-2 text-gray-600">Business AI Operating System</p>
      </div>
      <div className="w-full max-w-md">
        <SignUp redirectUrl="/dashboard" />
      </div>
    </div>
  );
} 