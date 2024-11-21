"use client"

import { redirect } from "next/navigation"
import { Card, Title, BarChart, DonutChart } from "@tremor/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [visitData, setVisitData] = useState([])
  const [userData, setUserData] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    redirect("/programacao")
  }, [])

  useEffect(() => {
    async function fetchData() {
      // Buscar dados de visitas
      const { data: visits } = await supabase
        .from('visita_comercial')
        .select('rota, created_at')
      
      // Agrupar visitas por rota
      const routeData = visits?.reduce((acc, visit) => {
        const route = visit.rota
        acc[route] = (acc[route] || 0) + 1
        return acc
      }, {})

      const formattedVisitData = Object.entries(routeData || {}).map(([name, value]) => ({
        name,
        "Quantidade de Visitas": value,
      }))

      // Buscar dados de usuários
      const { data: users } = await supabase
        .from('usuarios')
        .select('role')

      const roleData = users?.reduce((acc, user) => {
        const role = user.role
        acc[role] = (acc[role] || 0) + 1
        return acc
      }, {})

      const formattedUserData = Object.entries(roleData || {}).map(([name, value]) => ({
        name,
        "Quantidade": value,
      }))

      setVisitData(formattedVisitData)
      setUserData(formattedUserData)
    }

    fetchData()
  }, [supabase])

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Title>Visitas por Rota</Title>
          <BarChart
            data={visitData}
            index="name"
            categories={["Quantidade de Visitas"]}
            colors={["blue"]}
            className="mt-6"
          />
        </Card>

        <Card>
          <Title>Distribuição de Colaboradores</Title>
          <DonutChart
            data={userData}
            index="name"
            category="Quantidade"
            colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
            className="mt-6"
          />
        </Card>
      </div>
    </div>
  )
}