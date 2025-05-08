import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"
import { Heart } from "lucide-react"
import Link from "next/link"

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold text-blue-700">AI Doctor</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to AI Doctor</h1>
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
