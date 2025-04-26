"use client"

import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from './button'

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  perThousand: number
  popular?: boolean
  features: string[]
}

interface CreditPurchaseCardProps {
  packages: CreditPackage[]
  onPurchase: (pkg: CreditPackage) => void
  onCancel?: () => void
}

export function CreditPurchaseCard({ 
  packages,
  onPurchase,
  onCancel
}: CreditPurchaseCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`relative rounded-lg border p-5 ${
              pkg.popular 
              ? "border-primary ring-1 ring-primary" 
              : "border-border"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className="font-semibold text-lg">{pkg.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${pkg.price}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ${pkg.perThousand.toFixed(2)} per 1,000 credits
              </div>
            </div>
            
            <div className="text-center my-4">
              <span className="font-medium text-lg">{pkg.credits.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground"> credits</span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full"
              variant={pkg.popular ? "default" : "outline"}
              onClick={() => onPurchase(pkg)}
            >
              Purchase
            </Button>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mr-2 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Credit Information</p>
              <p className="text-muted-foreground">
                Credits are used to access all features of the BizOS platform. 
                Once purchased, credits remain in your account until used. 
                You can view your credit usage in the settings page.
              </p>
            </div>
          </div>
        </div>
        
        {onCancel && (
          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 