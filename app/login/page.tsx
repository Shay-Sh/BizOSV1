'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { GlassPanel } from '@/components/GlassPanel';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      router.push('/app');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        ...errors,
        password: 'Invalid email or password'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <GlassPanel className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 bg-blue-900/30 border ${
                errors.email ? 'border-red-500' : 'border-blue-700'
              } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 bg-blue-900/30 border ${
                  errors.password ? 'border-red-500' : 'border-blue-700'
                } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-blue-400" />
                ) : (
                  <Eye className="h-5 w-5 text-blue-400" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-700 rounded bg-blue-900/30"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <LogIn className="mr-2 h-5 w-5" />
                Sign in
              </span>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
              Sign up
            </a>
          </p>
        </div>
      </GlassPanel>
    </div>
  );
} 