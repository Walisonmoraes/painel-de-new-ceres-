'use client'

import { Overview } from "@/components/indicadores/overview"
import { TeamPerformance } from "@/components/indicadores/team-performance"
import { ProjectMetrics } from "@/components/indicadores/project-metrics"
import { RecentActivity } from "@/components/indicadores/recent-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function IndicadoresPage() {
  const [activeTab, setActiveTab] = useState("geral")

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Indicadores</h2>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="equipes">Equipes</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <Overview />
            </div>
            <div className="col-span-3">
              <RecentActivity />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="equipes" className="space-y-4 mt-6">
          <TeamPerformance />
        </TabsContent>
        <TabsContent value="projetos" className="space-y-4 mt-6">
          <ProjectMetrics />
        </TabsContent>
      </Tabs>
    </>
  )
}
