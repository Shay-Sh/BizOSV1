Sheet
Extends the Dialog component to display content that complements the main content of the screen.

Docs
API Reference
Preview
Code

Style:
New York
Open in
Copy
Open
Installation
CLI
Manual
pnpm
npm
yarn
bun
npx shadcn@latest add sheet
Copy
Usage
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
Copy
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
Copy
Examples
Side
Use the side property to <SheetContent /> to indicate the edge of the screen where the component will appear. The values can be top, right, bottom or left.

Preview
Code
"use client"
 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
 
const SHEET_SIDES = ["top", "right", "bottom", "left"] as const
 
type SheetSide = (typeof SHEET_SIDES)[number]
 
export function SheetSide() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
Copy
Size
You can adjust the size of the sheet using CSS classes:

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>