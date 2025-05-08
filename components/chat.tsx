"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState } from "react"
import { Bot, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Chat() {
  const [inputValue, setInputValue] = useState("")
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content:
          "Hello, I'm your AI medical assistant. Please describe your symptoms or ask any health-related questions. Remember, I'm here to provide information, but I'm not a replacement for professional medical advice.",
      },
    ],
    onFinish: () => {
      setInputValue("")
    },
  })

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    handleInputChange(e)
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 rounded-lg p-3",
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
                <div className="font-medium mb-1">{message.role === "user" ? "You" : "AI Doctor"}</div>
                <div className="prose prose-sm max-w-none">
                  <p>{message.content}</p>
                </div>
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
                <div className="animate-pulse">Thinking...</div>
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
        <form onSubmit={handleSubmit} className="flex gap-2">
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
      </div>
    </div>
  )
}
