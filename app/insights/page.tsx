"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { InsightsFeed } from "@/components/insights-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

  <main id="main-content" className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Insights</h1>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Insights</TabsTrigger>
              <TabsTrigger value="spending">Spending Trends</TabsTrigger>
              <TabsTrigger value="investment">Investment Health</TabsTrigger>
              <TabsTrigger value="goals">Goals Forecast</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <InsightsFeed filter="all" />
            </TabsContent>
            <TabsContent value="spending" className="mt-6">
              <InsightsFeed filter="spending" />
            </TabsContent>
            <TabsContent value="investment" className="mt-6">
              <InsightsFeed filter="investment" />
            </TabsContent>
            <TabsContent value="goals" className="mt-6">
              <InsightsFeed filter="goals" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
