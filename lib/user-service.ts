"use server"

import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function registerUser(formData: FormData) {
  try {
    const validatedFields = userSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    })

    const { name, email, password } = validatedFields

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: "User registered successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    return { error: "Something went wrong. Please try again." }
  }
}
