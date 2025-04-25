import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
          BizOS
        </h1>
        <p className="text-xl text-gray-600">
          Business AI Operating System
        </p>
      </header>
      
      <div className="max-w-3xl mb-10">
        <p className="text-lg text-gray-700 mb-6">
          Create, customize, and deploy AI agents for various workflows without coding knowledge.
          Our platform offers drag-and-drop workflow building, credential management, human-in-the-loop capabilities, and more.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Visual Workflow Builder</h3>
            <p className="text-gray-600">Design complex workflows with our intuitive drag-and-drop interface.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">AI-Powered Agents</h3>
            <p className="text-gray-600">Create agents that leverage advanced AI to complete tasks automatically.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Share agents and workflows with your team for seamless collaboration.</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
        <Link
          href="/about"
          className="px-6 py-3 rounded-lg bg-white text-primary font-medium border border-primary hover:bg-gray-50 transition"
        >
          Learn More
        </Link>
      </div>
    </div>
  )
} 