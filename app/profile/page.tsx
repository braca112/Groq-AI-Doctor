import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { getMedicalProfile } from "@/lib/medical-profile-service"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MedicalProfileForm } from "@/components/profile/medical-profile-form"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const medicalProfile = await getMedicalProfile()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardHeader user={user} />
      <main className="flex-1 container max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        <div className="space-y-8">
          <MedicalProfileForm profile={medicalProfile} />

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
            <p className="mb-4 text-gray-600">Your privacy is important to us. Here's how we handle your data:</p>

            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5 mb-4">
              <li>All medical data is encrypted at rest and in transit</li>
              <li>Your information is never shared with third parties</li>
              <li>You can request a copy of your data or delete it at any time</li>
              <li>We comply with HIPAA and GDPR regulations</li>
            </ul>

            <div className="flex gap-4 mt-6">
              <button className="text-sm text-blue-600 hover:underline">Download my data</button>
              <button className="text-sm text-red-600 hover:underline">Delete my account</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
