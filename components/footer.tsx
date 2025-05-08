import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-lg font-bold text-blue-700">AI Doctor</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
            <Link href="/" className="text-gray-600 hover:text-blue-700 text-sm">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-700 text-sm">
              About
            </Link>
            <Link href="/legal" className="text-gray-600 hover:text-blue-700 text-sm">
              Terms of Service
            </Link>
            <Link href="/legal" className="text-gray-600 hover:text-blue-700 text-sm">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-700 text-sm">
              Contact
            </Link>
          </nav>

          <div className="text-sm text-gray-500">&copy; {new Date().getFullYear()} AI Doctor. All rights reserved.</div>
        </div>

        <div className="mt-6 text-xs text-center text-gray-500">
          <p>
            AI Doctor provides general health information and is not a substitute for professional medical advice.
            Always consult with a qualified healthcare provider for medical concerns.
          </p>
          <p className="mt-2">HIPAA and GDPR compliant. All medical data is encrypted and secure.</p>
        </div>
      </div>
    </footer>
  )
}
