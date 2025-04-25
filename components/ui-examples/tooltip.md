Tooltip
A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

Docs
API Reference
Preview
Code
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
 
export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
Copy
Installation
CLI
Manual
pnpm
npm
yarn
bun
npx shadcn@latest add tooltip
Copy
Usage
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
Copy
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover</TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
Copy
Toggle Group
