import { Metadata } from 'next';
import SignUpForm from '@/app/components/auth/SignUpForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign Up | BizOS',
  description: 'Create your BizOS account',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <h2 className="text-center text-3xl font-bold text-gray-900">BizOS</h2>
        </Link>
        <p className="mt-2 text-center text-sm text-gray-600">
          Business AI Operating System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
} 