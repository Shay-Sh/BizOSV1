Progress
Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

Docs
API Reference
Preview
Code
"use client"
 
import * as React from "react"
 
import { Progress } from "@/components/ui/progress"
 
export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)
 
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
 
  return <Progress value={progress} className="w-[60%]" />
}
Copy
Installation
CLI
Manual
pnpm
npm
yarn
bun
npx shadcn@latest add progress
Copy
Usage
import { Progress } from "@/components/ui/progress"
Copy
<Progress value={33} />