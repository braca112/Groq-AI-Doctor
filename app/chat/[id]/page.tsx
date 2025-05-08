import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { getChat } from "@/lib/chat-service"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Footer } from "@/components/footer"

interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const chat = await getChat(params.id)

  if (!chat) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardHeader user={user} />
      <main className="flex-1 container max-w-4xl mx-auto p-4">
        <ChatInterface chat={chat} />
      </main>
      <Footer />
    </div>
  )
}
