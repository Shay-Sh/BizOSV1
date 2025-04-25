import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import { useAuth } from '../utils/auth';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(email, password, name);
      if (result.error) {
        throw new Error(result.error.message || 'Failed to sign up');
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-40 w-80 h-80 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
      </div>

      <GlassCard className="w-full max-w-md" variant="elevated" withReflection>
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">BizOS</h1>
            <p className="text-white/70">Create your account</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-100 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none
                             text-white placeholder-white/40"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none
                             text-white placeholder-white/40"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none
                             text-white placeholder-white/40"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm
                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none
                             text-white placeholder-white/40"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="pt-2">
                <GlassButton
                  type="submit"
                  variant="primary"
                  className="w-full py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </GlassButton>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default SignupPage; 