"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { GoalsGrid } from "@/components/goals-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Goals</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>

          <GoalsGrid />
        </div>
      </main>
    </div>
  )
}
