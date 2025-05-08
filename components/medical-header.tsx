import { Heart, Menu, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MedicalHeader() {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="text-xl font-bold text-blue-700">AI Doctor</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#" className="text-gray-600 hover:text-blue-700">
            Home
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700">
            About
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700">
            Services
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User account</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="#" className="text-gray-600 hover:text-blue-700">
                  Home
                </Link>
                <Link href="#" className="text-gray-600 hover:text-blue-700">
                  About
                </Link>
                <Link href="#" className="text-gray-600 hover:text-blue-700">
                  Services
                </Link>
                <Link href="#" className="text-gray-600 hover:text-blue-700">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
