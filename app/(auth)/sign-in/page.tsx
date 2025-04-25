import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In | BizOS',
  description: 'Sign in to your BizOS account',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">BizOS</h1>
            <p className="mt-1 text-gray-600">Business AI Operating System</p>
          </Link>
        </div>
        <div className="w-full max-w-md shadow-lg rounded-lg overflow-hidden bg-white">
          <div className="p-5 bg-primary">
            <h2 className="text-xl font-bold text-white text-center">Welcome Back</h2>
          </div>
          <div className="p-6">
            <SignIn />
          </div>
        </div>
        <div className="mt-6 text-center text-gray-600">
          Don't have an account? <Link href="/sign-up" className="text-primary font-medium hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
} 