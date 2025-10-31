"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Mail, Phone, MapPin, Calendar, Check, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useWorkspace } from "@/components/workspace-provider"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { activeMember } = useWorkspace()
  const [email, setEmail] = useState(activeMember.email)
  const [phone, setPhone] = useState("+1 (555) 123-4567")
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPhoneValid, setIsPhoneValid] = useState(true)
  const [showSavedMessage, setShowSavedMessage] = useState(false)

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
    setIsPhoneValid(validatePhone(phone))
  }, [phone])

  const handleSave = () => {
    setShowSavedMessage(true)
    setTimeout(() => setShowSavedMessage(false), 3000)
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
              <Input id="fullName" defaultValue={activeMember.name} className="h-9" />
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
                defaultValue="Passionate trader with 5 years of experience in stock markets."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm" onClick={handleSave}>Save Changes</Button>
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
                  <p className="text-sm text-muted-foreground">January 15, 2023</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">New York, USA</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground">Premium Trader</p>
              </div>
              <Button variant="outline" size="sm">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
