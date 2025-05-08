import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { addMessage } from "@/lib/chat-service"
import { getMedicalProfile } from "@/lib/medical-profile-service"
import { encrypt } from "@/lib/encryption"

// System prompt for medical assistant
const SYSTEM_PROMPT = `You are an AI medical assistant designed to provide helpful, accurate, and ethical information on health-related topics.

Guidelines:
- Provide general medical information and educational content
- Explain medical concepts in clear, accessible language
- Suggest when someone should consult a healthcare professional
- NEVER provide definitive diagnoses
- NEVER prescribe specific medications or treatments
- ALWAYS include a disclaimer that you're not a replacement for professional medical advice
- Be compassionate and understanding when discussing health concerns
- Prioritize patient safety above all else

Remember that your purpose is to inform and educate, not to replace professional medical care.`

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to use the chat" }, { status: 401 })
    }

    const { messages, chatId } = await req.json()

    // Extract the conversation history
    const conversationHistory = messages.map((message: any) => ({
      role: message.role,
      content: message.content,
    }))

    // Add system prompt at the beginning
    const fullConversation = [{ role: "system", content: SYSTEM_PROMPT }, ...conversationHistory]

    // If user is logged in, add personalization
    if (user) {
      let personalizedPrompt = `\nYou are speaking with ${user.name}.`

      // Add medical profile information if available
      const medicalProfile = await getMedicalProfile()
      if (medicalProfile) {
        personalizedPrompt += ` This user has provided the following medical information (use this to provide more relevant advice, but don't explicitly mention you have this information unless asked):`

        if (medicalProfile.gender) {
          personalizedPrompt += `\n- Gender: ${medicalProfile.gender}`
        }

        if (medicalProfile.dateOfBirth) {
          const age = Math.floor((new Date().getTime() - new Date(medicalProfile.dateOfBirth).getTime()) / 31557600000)
          personalizedPrompt += `\n- Age: ${age} years`
        }

        if (medicalProfile.allergies) {
          personalizedPrompt += `\n- Allergies: ${medicalProfile.allergies}`
        }

        if (medicalProfile.medications) {
          personalizedPrompt += `\n- Current medications: ${medicalProfile.medications}`
        }

        if (medicalProfile.chronicConditions) {
          personalizedPrompt += `\n- Chronic conditions: ${medicalProfile.chronicConditions}`
        }
      }

      fullConversation[0].content += personalizedPrompt
    }

    // Generate response using Groq
    const response = await generateText({
      model: groq("llama3-70b-8192"),
      messages: fullConversation,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // If chatId is provided, save the messages to the database
    if (chatId) {
      // Save the user's last message
      const lastUserMessage = conversationHistory.filter((msg: any) => msg.role === "user").pop()
      if (lastUserMessage) {
        await addMessage(chatId, lastUserMessage.content, "user")
      }

      // Save the AI response
      await addMessage(chatId, response.text, "assistant")

      // Encrypt sensitive data before logging
      const encryptedResponse = encrypt(response.text)
      console.log(`Chat response saved for chat ${chatId} (encrypted)`)
    }

    return NextResponse.json({ role: "assistant", content: response.text })
  } catch (error) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
