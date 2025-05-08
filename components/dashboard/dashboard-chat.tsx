"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useChat } from "ai/react"
import { Bot, Edit, Send, Trash, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardChat() {
  const [inputValue, setInputValue] = useState("")
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content:
          "Hello! I'm your AI medical assistant. How can I help you today? You can ask me about symptoms, general health information, or select one of the quick start options.",
      },
    ],
    onFinish: () => {
      setInputValue("")
      // Save chat to local storage for history
      localStorage.setItem(
        "chatHistory",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          title: "Medical Consultation",
          messages: messages,
        }),
      )
    },
  })

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    handleInputChange(e)
  }

  const handleEditMessage = (id: string, content: string) => {
    setEditingMessage({ id, content })
    setEditValue(content)
  }

  const handleSaveEdit = () => {
    if (!editingMessage) return

    setMessages(
      messages.map((message) => (message.id === editingMessage.id ? { ...message, content: editValue } : message)),
    )
    setEditingMessage(null)
  }

  const handleCancelEdit = () => {
    setEditingMessage(null)
  }

  const handleDeleteMessage = (id: string) => {
    setMessageToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      setMessages(messages.filter((message) => message.id !== messageToDelete))
    }
    setIsDeleteDialogOpen(false)
    setMessageToDelete(null)
  }

  // Listen for quickstart events
  useEffect(() => {
    const handleQuickStart = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt: string }>
      setInputValue(customEvent.detail.prompt)

      // Submit the form programmatically
      const form = document.getElementById("chat-form") as HTMLFormElement
      if (form) {
        const formData = new FormData(form)
        formData.set("message", customEvent.detail.prompt)
        const submitEvent = new SubmitEvent("submit", { cancelable: true })
        form.requestSubmit()
      }
    }

    document.addEventListener("quickstart", handleQuickStart as EventListener)
    return () => {
      document.removeEventListener("quickstart", handleQuickStart as EventListener)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle>Medical Consultation</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
          <div className="space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3 group",
                  message.role === "user" ? "bg-blue-50" : "bg-gray-50",
                )}
              >
                <Avatar className={message.role === "user" ? "bg-blue-600" : "bg-green-600"}>
                  <AvatarFallback>
                    {message.role === "user" ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>{message.role === "user" ? "You" : "AI Doctor"}</span>
                    {message.role === "user" && message.id !== "welcome-message" && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleEditMessage(message.id, message.content)}
                        >
                          <Edit className="h-3 w-3" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash className="h-3 w-3" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  {editingMessage?.id === message.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <p>{message.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 rounded-lg p-3 bg-gray-50">
                <Avatar className="bg-green-600">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium mb-1">AI Doctor</div>
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-500">
                Error: {error.message || "Something went wrong. Please try again."}
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form id="chat-form" onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              placeholder="Describe your symptoms or ask a medical question..."
              value={inputValue}
              onChange={handleTextareaChange}
              className="min-h-[60px] flex-1 resize-none"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
          <p className="text-xs text-center mt-2 text-gray-500">
            Your conversations are saved for your reference. This AI provides general information only and is not a
            substitute for professional medical advice.
          </p>
        </div>
      </CardContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
