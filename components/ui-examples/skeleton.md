Skeleton
Use to show a placeholder while content is loading.

Preview
Code
import { Skeleton } from "@/components/ui/skeleton"
 
export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
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
npx shadcn@latest add skeleton
Copy
Usage
import { Skeleton } from "@/components/ui/skeleton"
Copy
<Skeleton className="w-[100px] h-[20px] rounded-full" />
Copy
Examples
Card
Preview
Code
import { Skeleton } from "@/components/ui/skeleton"
 
export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}