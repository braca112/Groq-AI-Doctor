"use client"

import { Heart, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "@/lib/auth"

interface DashboardHeaderProps {
  user: {
    id: string
    name: string
    email: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutUser()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="text-xl font-bold text-blue-700">AI Doctor</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/dashboard" className="text-blue-700 font-medium">
            Dashboard
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700">
            Medical Records
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700">
            Resources
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700">
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
