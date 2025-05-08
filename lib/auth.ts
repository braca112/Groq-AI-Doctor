"use server"

import { cookies } from "next/headers"

// In a real app, you would use a proper authentication system
// This is a simplified mock implementation for demonstration purposes

type User = {
  id: string
  name: string
  email: string
}

// Mock user database
const USERS: Record<string, User & { password: string }> = {
  user1: {
    id: "user1",
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  },
}

export async function loginUser(email: string, password: string): Promise<User> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user by email
  const user = Object.values(USERS).find((u) => u.email === email)

  if (!user || user.password !== password) {
    throw new Error("Invalid credentials")
  }

  // Set session cookie
  const session = { userId: user.id, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  cookies().set("session", JSON.stringify(session), {
    httpOnly: true,
    expires: new Date(session.expires),
  })

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if email already exists
  if (Object.values(USERS).some((u) => u.email === email)) {
    throw new Error("Email already in use")
  }

  // Create new user
  const id = `user${Object.keys(USERS).length + 1}`
  const newUser = { id, name, email, password }
  USERS[id] = newUser

  // Set session cookie
  const session = { userId: id, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  cookies().set("session", JSON.stringify(session), {
    httpOnly: true,
    expires: new Date(session.expires),
  })

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    if (session.expires < Date.now()) {
      cookies().delete("session")
      return null
    }

    const user = USERS[session.userId]
    if (!user) {
      return null
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch {
    return null
  }
}

export async function logoutUser(): Promise<void> {
  cookies().delete("session")
}
