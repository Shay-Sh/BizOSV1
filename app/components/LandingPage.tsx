'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [isLoading]);

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-white text-2xl font-bold">BizOS</span>
        </div>
        <div className="space-x-4">
          {user ? (
            <Link href="/app">
              <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="space-x-4">
              <Link href="/sign-in">
                <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-white text-indigo-900 hover:bg-white/90">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          The Business AI Operating System
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/80">
          Create, customize, and deploy AI agents to automate your workflows without any coding knowledge.
        </p>
        {!user && (
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-white/90 px-8 py-6 text-lg">
              Get Started for Free
            </Button>
          </Link>
        )}
      </section>

      {/* Feature Highlights */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Custom AI Agents",
              description: "Build agents for specific tasks without writing a single line of code.",
              icon: "🤖"
            },
            {
              title: "Workflow Automation",
              description: "Connect agents to create complex workflows that run automatically.",
              icon: "⚙️"
            },
            {
              title: "Knowledge Integration",
              description: "Feed your company data and documents to make agents smarter.",
              icon: "📚"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Choose or Create an Agent",
              description: "Select from our marketplace or build a custom agent for your specific needs."
            },
            {
              step: "2",
              title: "Connect Your Data",
              description: "Upload documents, connect APIs, or integrate with your existing tools."
            },
            {
              step: "3",
              title: "Deploy and Automate",
              description: "Set your agent to work and monitor its performance from your dashboard."
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-2 text-white">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-10 border border-white/20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 text-white/80">Start using BizOS today and experience the power of AI automation.</p>
          {!user ? (
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-white/90 px-8 py-6 text-lg">
                Sign Up Free
              </Button>
            </Link>
          ) : (
            <Link href="/app">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-white/90 px-8 py-6 text-lg">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 text-center text-white/60">
        <p>© 2023 BizOS. All rights reserved.</p>
      </footer>
    </div>
  );
} 