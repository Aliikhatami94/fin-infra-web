"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Mail, Phone, MapPin, Calendar, Check, CheckCircle2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useWorkspace } from "@/components/workspace-provider"
import { useAuth } from "@/lib/auth/context"
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/sonner"

export default function ProfilePage() {
  const { activeMember } = useWorkspace()
  const { user, updateUser } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPhoneValid, setIsPhoneValid] = useState(true)
  const [showSavedMessage, setShowSavedMessage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "")
      setEmail(user.email)
      setPhone((user as any).phone_number || "")
      setBio((user as any).bio || "")
      setLocation((user as any).location || "")
    }
  }, [user])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    return phoneRegex.test(phone)
  }

  useEffect(() => {
    setIsEmailValid(validateEmail(email))
  }, [email])

  useEffect(() => {
    setIsPhoneValid(phone === "" || validatePhone(phone))
  }, [phone])

  const handleSave = async () => {
    if (!isEmailValid || !isPhoneValid) {
      toast.error("Invalid input", {
        description: "Please check your email and phone number format."
      })
      return
    }
    
    setIsSaving(true)
    try {
      await updateUser({
        full_name: fullName || undefined,
        email: email || undefined,
        phone_number: phone || undefined,
        bio: bio || undefined,
        location: location || undefined,
      })
      
      setShowSavedMessage(true)
      setTimeout(() => setShowSavedMessage(false), 3000)
      
      toast.success("Profile updated", {
        description: "Your changes have been saved successfully."
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Update failed", {
        description: "Could not save your changes. Please try again."
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <DashboardLayout>
      {/* Header: align with Settings page style */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto p-4 flex justify-between items-center max-w-[1200px] px-4 sm:px-6 lg:px-10 z-[99]">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your account information and preferences</p>
          </div>
          <Badge variant="outline" className="text-xs px-3">Account</Badge>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">

        <Card className="card-standard">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile picture</CardDescription>
              </div>
              <AnimatePresence>
                {showSavedMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Changes saved
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar and Change Photo button side by side */}
            <div className="flex gap-4 items-center">
              <Avatar className="h-20 w-20 shrink-0">
                <AvatarImage src={undefined} alt={activeMember.name} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
                  {activeMember.avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <Button variant="outline" size="sm" className="gap-2 h-8">
                  <Camera className="h-3.5 w-3.5" />
                  Change Photo
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB</p>
              </div>
            </div>

            {/* Name field */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs">Full Name</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="h-9" 
              />
            </div>

            {/* Email and Phone in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    className="pl-9 pr-9 h-9" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {isEmailValid && email && (
                    <Check className="absolute right-3 top-2.5 h-4 w-4 text-emerald-600" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    className="pl-9 pr-9 h-9" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {isPhoneValid && phone && (
                    <Check className="absolute right-3 top-2.5 h-4 w-4 text-emerald-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                rows={3}
                className="resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" disabled={isSaving}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your account information and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : "Recently joined"
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <div className="relative">
                    <Input 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New York, USA"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Account Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user?.is_verified ? "default" : "secondary"} className="text-xs">
                    {user?.is_verified ? "Verified" : "Unverified"}
                  </Badge>
                  {user?.onboarding_completed && (
                    <Badge variant="outline" className="text-xs">
                      Onboarding Complete
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
