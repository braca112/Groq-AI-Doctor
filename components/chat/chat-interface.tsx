"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
import { addMessage, updateMessage, deleteMessage, deleteChat } from "@/lib/chat-service"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
}

interface ChatInterfaceProps {
  chat: Chat
}

export function ChatInterface({ chat }: ChatInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(chat.messages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput("")
    setIsLoading(true)
    setError(null)

    // Optimistically update UI
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      content: userMessage,
      role: "user",
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, tempUserMessage])

    try {
      // Add message to database
      const result = await addMessage(chat.id, userMessage, "user")

      if (result.error) {
        setError(result.error)
        // Remove temp message
        setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id))
        return
      }

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, tempUserMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          chatId: chat.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Refresh messages from server
      router.refresh()

      // Update messages with server data
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== tempUserMessage.id),
        {
          ...tempUserMessage,
          id: result.messageId || tempUserMessage.id,
        },
        {
          id: `assistant-${Date.now()}`,
          content: data.content,
          role: "assistant",
          createdAt: new Date(),
        },
      ])
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
      // Remove temp message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditMessage = (id: string, content: string) => {
    setEditingMessage({ id, content })
    setEditValue(content)
  }

  const handleSaveEdit = async () => {
    if (!editingMessage) return

    try {
      const result = await updateMessage(editingMessage.id, editValue)

      if (result.error) {
        setError(result.error)
        return
      }

      // Update local state
      setMessages((prev) => prev.map((msg) => (msg.id === editingMessage.id ? { ...msg, content: editValue } : msg)))

      setEditingMessage(null)
    } catch (err) {
      console.error("Error updating message:", err)
      setError("Failed to update message. Please try again.")
    }
  }

  const handleCancelEdit = () => {
    setEditingMessage(null)
  }

  const handleDeleteMessage = (id: string) => {
    setMessageToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return

    try {
      const result = await deleteMessage(messageToDelete)

      if (result.error) {
        setError(result.error)
        return
      }

      // Update local state
      setMessages((prev) => prev.filter((msg) => msg.id !== messageToDelete))
    } catch (err) {
      console.error("Error deleting message:", err)
      setError("Failed to delete message. Please try again.")
    } finally {
      setIsDeleteDialogOpen(false)
      setMessageToDelete(null)
    }
  }

  const handleDeleteChat = () => {
    setIsDeleteChatDialogOpen(true)
  }

  const confirmDeleteChat = async () => {
    try {
      const result = await deleteChat(chat.id)

      if (result.error) {
        setError(result.error)
        return
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Error deleting chat:", err)
      setError("Failed to delete chat. Please try again.")
    } finally {
      setIsDeleteChatDialogOpen(false)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="flex flex-col h-[calc(100vh-180px)]">
      <CardHeader className="px-6 py-4 border-b flex flex-row justify-between items-center">
        <CardTitle>{chat.title}</CardTitle>
        <Button variant="outline" size="sm" onClick={handleDeleteChat}>
          Delete Consultation
        </Button>
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
                    {message.role === "user" && (
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
                Error: {error || "Something went wrong. Please try again."}
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              placeholder="Describe your symptoms or ask a medical question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[60px] flex-1 resize-none"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
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

      <AlertDialog open={isDeleteChatDialogOpen} onOpenChange={setIsDeleteChatDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete consultation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entire consultation? This action cannot be undone and will remove all
              messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteChat} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
