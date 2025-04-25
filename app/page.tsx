import Link from 'next/link'
import { Metadata } from 'next'
import { Header } from './components/Header'

export const metadata: Metadata = {
  title: 'BizOS - Business AI Operating System',
  description: 'Create, customize, and deploy AI agents for workflows without coding knowledge',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
              <span className="block text-primary">BizOS</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-2">Business AI Operating System</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Create, customize, and deploy AI agents for various workflows without coding knowledge.
              Our platform offers drag-and-drop workflow building, credential management, human-in-the-loop capabilities, and more.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/sign-up"
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-blue-600 transition shadow-md"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 rounded-lg bg-white text-primary font-medium border border-primary hover:bg-gray-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div id="features" className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">Platform Features</h2>
              <p className="mt-4 text-lg text-gray-600">Everything you need to create powerful AI agents</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-3 text-primary">Visual Workflow Builder</h3>
                <p className="text-gray-600">Design complex workflows with our intuitive drag-and-drop interface.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-3 text-primary">AI-Powered Agents</h3>
                <p className="text-gray-600">Create agents that leverage advanced AI to complete tasks automatically.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-3 text-primary">Team Collaboration</h3>
                <p className="text-gray-600">Share agents and workflows with your team for seamless collaboration.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">BizOS</span>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              © {new Date().getFullYear()} BizOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 