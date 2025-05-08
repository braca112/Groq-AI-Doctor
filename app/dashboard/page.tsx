import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { getChats, createChat } from "@/lib/chat-service"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickStartOptions } from "@/components/dashboard/quick-start-options"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const chats = await getChats()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardHeader user={user} />
      <main className="flex-1 container max-w-6xl mx-auto p-4 grid md:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <form
              action={async () => {
                "use server"
                const result = await createChat("New Consultation")
                if (result.chatId) {
                  redirect(`/chat/${result.chatId}`)
                }
              }}
            >
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            </form>

            <QuickStartOptions />
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-3">Recent Consultations</h2>
            {chats.length > 0 ? (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="block w-full text-left p-2 rounded hover:bg-blue-50 text-sm"
                  >
                    <p className="font-medium">{chat.title}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(chat.updatedAt).toLocaleDateString()} at {new Date(chat.updatedAt).toLocaleTimeString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No consultations yet. Start a new one!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Welcome to AI Doctor</h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get personalized health information and advice from our AI medical assistant.
            </p>
            <form
              action={async () => {
                "use server"
                const result = await createChat("New Consultation")
                if (result.chatId) {
                  redirect(`/chat/${result.chatId}`)
                }
              }}
            >
              <Button type="submit" size="lg">
                Start New Consultation
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
