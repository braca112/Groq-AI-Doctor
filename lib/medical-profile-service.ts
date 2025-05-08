"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const medicalProfileSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  chronicConditions: z.string().optional(),
  familyHistory: z.string().optional(),
})

export async function getMedicalProfile() {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return null
    }

    const profile = await db.medicalProfile.findUnique({
      where: {
        userId: user.id,
      },
    })

    return profile
  } catch (error) {
    console.error("Error fetching medical profile:", error)
    return null
  }
}

export async function updateMedicalProfile(formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return { error: "You must be logged in to update your medical profile" }
    }

    const validatedFields = medicalProfileSchema.parse({
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      height: formData.get("height"),
      weight: formData.get("weight"),
      allergies: formData.get("allergies"),
      medications: formData.get("medications"),
      chronicConditions: formData.get("chronicConditions"),
      familyHistory: formData.get("familyHistory"),
    })

    const { dateOfBirth, gender, height, weight, allergies, medications, chronicConditions, familyHistory } =
      validatedFields

    // Convert string values to appropriate types
    const parsedHeight = height ? Number.parseFloat(height) : null
    const parsedWeight = weight ? Number.parseFloat(weight) : null
    const parsedDateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null

    // Check if profile exists
    const existingProfile = await db.medicalProfile.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (existingProfile) {
      // Update existing profile
      await db.medicalProfile.update({
        where: {
          userId: user.id,
        },
        data: {
          dateOfBirth: parsedDateOfBirth,
          gender,
          height: parsedHeight,
          weight: parsedWeight,
          allergies,
          medications,
          chronicConditions,
          familyHistory,
        },
      })
    } else {
      // Create new profile
      await db.medicalProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: parsedDateOfBirth,
          gender,
          height: parsedHeight,
          weight: parsedWeight,
          allergies,
          medications,
          chronicConditions,
          familyHistory,
        },
      })
    }

    revalidatePath("/profile")
    return { success: "Medical profile updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    console.error("Error updating medical profile:", error)
    return { error: "Failed to update medical profile" }
  }
}
