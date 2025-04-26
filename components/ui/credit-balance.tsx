"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from './button'

interface CreditBalanceProps {
  balance: number
  size?: 'sm' | 'md' | 'lg'
  showAdd?: boolean
  animate?: boolean
  onAddClick?: () => void
  className?: string
}

export function CreditBalance({
  balance,
  size = 'md',
  showAdd = false,
  animate = true,
  onAddClick,
  className = '',
}: CreditBalanceProps) {
  const [prevBalance, setPrevBalance] = useState(balance)
  const [isIncreasing, setIsIncreasing] = useState(false)
  const [isDecreasing, setIsDecreasing] = useState(false)

  useEffect(() => {
    if (balance > prevBalance) {
      setIsIncreasing(true)
      setIsDecreasing(false)
    } else if (balance < prevBalance) {
      setIsIncreasing(false)
      setIsDecreasing(true)
    }
    
    const timer = setTimeout(() => {
      setPrevBalance(balance)
      setIsIncreasing(false)
      setIsDecreasing(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [balance, prevBalance])
  
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-1.5 px-3',
    lg: 'text-lg py-2 px-4',
  }
  
  const baseClass = 'rounded-full font-medium flex items-center gap-1.5 bg-secondary text-secondary-foreground'
  const classes = `${baseClass} ${sizeClasses[size]} ${className}`
  
  return (
    <div className="flex items-center gap-2">
      {animate ? (
        <motion.div 
          className={classes}
          animate={{
            backgroundColor: isIncreasing 
              ? ['hsl(var(--secondary))', 'hsl(var(--success))', 'hsl(var(--secondary))'] 
              : isDecreasing 
                ? ['hsl(var(--secondary))', 'hsl(var(--destructive))', 'hsl(var(--secondary))']
                : 'hsl(var(--secondary))'
          }}
          transition={{ duration: 0.8 }}
        >
          <span className="credit-icon">💎</span>
          <motion.span
            key={balance}
            initial={{ opacity: 0, y: isIncreasing ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {balance.toLocaleString()}
          </motion.span>
        </motion.div>
      ) : (
        <div className={classes}>
          <span className="credit-icon">💎</span>
          <span>{balance.toLocaleString()}</span>
        </div>
      )}
      
      {showAdd && (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 