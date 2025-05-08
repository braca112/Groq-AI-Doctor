"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Pill, Stethoscope, Thermometer } from "lucide-react"

interface QuickStartOption {
  icon: React.ReactNode
  title: string
  prompt: string
}

const quickStartOptions: QuickStartOption[] = [
  {
    icon: <Thermometer className="h-5 w-5" />,
    title: "Symptom Check",
    prompt: "I have a fever, headache, and sore throat. What could it be?",
  },
  {
    icon: <Pill className="h-5 w-5" />,
    title: "Medication Info",
    prompt: "Can you explain how antibiotics work?",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Mental Health",
    prompt: "What are some techniques to manage anxiety?",
  },
  {
    icon: <Stethoscope className="h-5 w-5" />,
    title: "General Advice",
    prompt: "How can I improve my sleep quality?",
  },
]

interface QuickStartOptionsProps {
  onSelectPrompt?: (prompt: string) => void
}

export function QuickStartOptions({ onSelectPrompt }: QuickStartOptionsProps = {}) {
  const handleSelectPrompt = (prompt: string) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt)
    } else {
      // Dispatch a custom event that the chat component can listen for
      const event = new CustomEvent("quickstart", { detail: { prompt } })
      document.dispatchEvent(event)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Start</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {quickStartOptions.map((option) => (
          <Button
            key={option.title}
            variant="outline"
            className="justify-start h-auto py-3 px-4"
            onClick={() => handleSelectPrompt(option.prompt)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700">{option.icon}</div>
              <span>{option.title}</span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
