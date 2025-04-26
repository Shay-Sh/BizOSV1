"use client"

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

export interface CreditUsageDataPoint {
  date: string
  usage: number
  category?: string
}

interface CreditUsageChartProps {
  data: CreditUsageDataPoint[]
  title?: string
  description?: string
  showGrid?: boolean
  height?: number
  className?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md border border-border text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-primary">Usage: {payload[0].value} credits</p>
        {payload[0].payload.category && (
          <p className="text-muted-foreground">Category: {payload[0].payload.category}</p>
        )}
      </div>
    )
  }

  return null
}

export function CreditUsageChart({
  data,
  title = "Credit Usage",
  description = "Your credit usage over time",
  showGrid = true,
  height = 300,
  className = "",
}: CreditUsageChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis 
              dataKey="date"
              className="text-xs font-medium text-muted-foreground" 
            />
            <YAxis 
              className="text-xs font-medium text-muted-foreground"
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="usage"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 