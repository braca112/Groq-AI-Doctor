"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createChat(title: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return { error: "You must be logged in to create a chat" }
    }

    const chat = await db.chat.create({
      data: {
        title,
        userId: user.id,
        messages: {
          create: {
            content: "Hello! I'm your AI medical assistant. How can I help you today?",
            role: "assistant",
          },
        },
      },
    })

    revalidatePath("/dashboard")
    return { success: "Chat created successfully", chatId: chat.id }
  } catch (error) {
    console.error("Error creating chat:", error)
    return { error: "Failed to create chat" }
  }
}

export async function getChats() {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return []
    }

    const chats = await db.chat.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    return chats
  } catch (error) {
    console.error("Error fetching chats:", error)
    return []
  }
}

export async function getChat(chatId: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return null
    }

    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    return chat
  } catch (error) {
    console.error("Error fetching chat:", error)
    return null
  }
}

export async function addMessage(chatId: string, content: string, role: "user" | "assistant") {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return { error: "You must be logged in to add a message" }
    }

    // Verify the chat belongs to the user
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
    })

    if (!chat) {
      return { error: "Chat not found" }
    }

    const message = await db.message.create({
      data: {
        content,
        role,
        chatId,
      },
    })

    // Update the chat's updatedAt timestamp
    await db.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    revalidatePath(`/chat/${chatId}`)
    return { success: "Message added successfully", messageId: message.id }
  } catch (error) {
    console.error("Error adding message:", error)
    return { error: "Failed to add message" }
  }
}

export async function updateMessage(messageId: string, content: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return { error: "You must be logged in to update a message" }
    }

    // Verify the message belongs to the user
    const message = await db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        chat: true,
      },
    })

    if (!message || message.chat.userId !== user.id) {
      return { error: "Message not found" }
    }

    // Only allow editing user messages
    if (message.role !== "user") {
      return { error: "You can only edit your own messages" }
    }

    await db.message.update({
      where: { id: messageId },
      data: { content },
    })

    revalidatePath(`/chat/${message.chatId}`)
    return { success: "Message updated successfully" }
  } catch (error) {
    console.error("Error updating message:", error)
    return { error: "Failed to update message" }
  }
}

export async function deleteMessage(messageId: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return { error: "You must be logged in to delete a message" }
    }

    // Verify the message belongs to the user
    const message = await db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        chat: true,
      },
    })

    if (!message || message.chat.userId !== user.id) {
      return { error: "Message not found" }
    }

    // Only allow deleting user messages
    if (message.role !== "user") {
      return { error: "You can only delete your own messages" }
    }

    await db.message.delete({
      where: { id: messageId },
    })

    revalidatePath(`/chat/${message.chatId}`)
    return { success: "Message deleted successfully" }
  } catch (error) {
    console.error("Error deleting message:", error)
    return { error: "Failed to delete message" }
  }
}

export async function deleteChat(chatId: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return { error: "You must be logged in to delete a chat" }
    }

    // Verify the chat belongs to the user
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
    })

    if (!chat) {
      return { error: "Chat not found" }
    }

    await db.chat.delete({
      where: { id: chatId },
    })

    revalidatePath("/dashboard")
    return { success: "Chat deleted successfully" }
  } catch (error) {
    console.error("Error deleting chat:", error)
    return { error: "Failed to delete chat" }
  }
}
