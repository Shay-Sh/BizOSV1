"use client"

import React, { useState } from 'react'
import { CreditPurchaseCard } from '@/components/ui/credit-purchase-card'
import { CreditSummaryCard } from '@/components/ui/credit-summary-card'
import { Bot, MessageSquare, RefreshCcw, Sparkles } from 'lucide-react'

export default function CreditSystemPage() {
  const [credits, setCredits] = useState(750)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  
  // Sample credit usage data
  const recentUsage = [
    { feature: "Agent Executions", amount: 125, icon: <Bot className="h-4 w-4 mr-2 text-muted-foreground" /> },
    { feature: "Chat Conversations", amount: 75, icon: <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" /> },
    { feature: "Knowledge Base Queries", amount: 50, icon: <Sparkles className="h-4 w-4 mr-2 text-muted-foreground" /> },
  ]
  
  // Credit packages
  const packages = [
    {
      id: 'basic',
      name: 'Basic',
      credits: 1000,
      price: 25,
      perThousand: 25,
      features: [
        '1,000 credits',
        'Basic support',
        'Credits never expire'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      credits: 5000,
      price: 100,
      perThousand: 20,
      popular: true,
      features: [
        '5,000 credits',
        'Priority support',
        'Credits never expire',
        'Usage analytics'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 15000,
      price: 250,
      perThousand: 16.67,
      features: [
        '15,000 credits',
        'Dedicated support',
        'Credits never expire',
        'Advanced analytics',
        'Custom integrations'
      ]
    }
  ]

  const handlePurchase = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId)
    if (selectedPackage) {
      setCredits(current => current + selectedPackage.credits)
      setShowPurchaseForm(false)
      // In a real app, you would handle payment processing here
      alert(`Successfully purchased ${selectedPackage.credits.toLocaleString()} credits for $${selectedPackage.price}`)
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Credit System Example</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CreditSummaryCard 
            balance={credits}
            lastUpdated="10 minutes ago"
            recentUsage={recentUsage}
            onViewDetails={() => alert("Navigate to detailed usage dashboard")}
            onPurchase={() => setShowPurchaseForm(true)}
          />
          
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">How Credits Work</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Credits are used to access all features of the BizOS platform. Different actions consume different amounts of credits based on complexity and resource usage.
            </p>
            
            <h3 className="text-md font-medium mb-2">Credit Usage Examples:</h3>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between">
                <span>Simple Agent Execution</span>
                <span className="font-medium">5 credits</span>
              </li>
              <li className="flex justify-between">
                <span>Complex Agent Workflow</span>
                <span className="font-medium">15-25 credits</span>
              </li>
              <li className="flex justify-between">
                <span>Knowledge Base Query</span>
                <span className="font-medium">2 credits</span>
              </li>
              <li className="flex justify-between">
                <span>Chat Message (AI Response)</span>
                <span className="font-medium">3 credits</span>
              </li>
            </ul>
            
            <div className="mt-6 text-sm flex items-center text-muted-foreground">
              <RefreshCcw className="h-4 w-4 mr-2" />
              <span>Credits are automatically deducted as you use the platform.</span>
            </div>
          </div>
        </div>
        
        {showPurchaseForm ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Purchase More Credits</h2>
            <CreditPurchaseCard 
              packages={packages}
              onPurchase={handlePurchase}
              onCancel={() => setShowPurchaseForm(false)}
            />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-8 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-3">Credits System</h2>
            <p className="text-center text-muted-foreground mb-6">
              This example demonstrates how the credit system components work together. Try clicking "Purchase Credits" on the summary card to see the purchase flow.
            </p>
            <div className="text-sm text-muted-foreground space-y-2 w-full max-w-md">
              <div className="flex justify-between p-2 bg-background/80 rounded">
                <span>Current Balance:</span>
                <span className="font-medium">{credits.toLocaleString()} credits</span>
              </div>
              <div className="flex justify-between p-2 bg-background/80 rounded">
                <span>Total Used:</span>
                <span className="font-medium">250 credits</span>
              </div>
              <div className="flex justify-between p-2 bg-background/80 rounded">
                <span>Available Components:</span>
                <span className="font-medium">CreditSummaryCard, CreditPurchaseCard</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 