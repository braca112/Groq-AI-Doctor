"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateMedicalProfile } from "@/lib/medical-profile-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MedicalProfileFormProps {
  profile?: {
    dateOfBirth: Date | null
    gender: string | null
    height: number | null
    weight: number | null
    allergies: string | null
    medications: string | null
    chronicConditions: string | null
    familyHistory: string | null
  } | null
}

export function MedicalProfileForm({ profile }: MedicalProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)

    try {
      const result = await updateMedicalProfile(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Medical profile updated successfully")
      }
    } catch (err) {
      setError("An error occurred while updating your medical profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Profile</CardTitle>
        <CardDescription>
          This information helps our AI provide more personalized health advice. Your data is encrypted and secure.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={
                  profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : undefined
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" defaultValue={profile?.gender || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                defaultValue={profile?.height?.toString() || ""}
                placeholder="Height in centimeters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                defaultValue={profile?.weight?.toString() || ""}
                placeholder="Weight in kilograms"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              name="allergies"
              placeholder="List any allergies you have"
              defaultValue={profile?.allergies || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              name="medications"
              placeholder="List any medications you are currently taking"
              defaultValue={profile?.medications || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chronicConditions">Chronic Conditions</Label>
            <Textarea
              id="chronicConditions"
              name="chronicConditions"
              placeholder="List any chronic conditions you have"
              defaultValue={profile?.chronicConditions || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyHistory">Family Medical History</Label>
            <Textarea
              id="familyHistory"
              name="familyHistory"
              placeholder="Relevant family medical history"
              defaultValue={profile?.familyHistory || ""}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
            <p className="font-medium">Privacy Notice</p>
            <p>
              Your medical information is encrypted and stored securely. It is only used to provide personalized health
              advice and is never shared with third parties. You can delete your data at any time.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="ml-auto">
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
