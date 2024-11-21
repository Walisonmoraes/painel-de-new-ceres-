"use client"

import { Card, Title, Text, LineChart } from "@tremor/react"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMemo } from "react"

export function RecentActivity() {
  const data = useMemo(() => {
    const result = []
    for (let i = 30; i >= 0; i--) {
      const date = subDays(new Date(), i)
      result.push({
        date: format(date, "dd/MM", { locale: ptBR }),
        "Tarefas Criadas": Math.floor(Math.random() * 30) + 10,
        "Tarefas Concluídas": Math.floor(Math.random() * 25) + 5,
      })
    }
    return result
  }, [])

  return (
    <Card>
      <Title>Atividade Recente</Title>
      <Text>Tarefas criadas vs. concluídas nos últimos 30 dias</Text>
      <LineChart
        className="mt-6 h-72"
        data={data}
        index="date"
        categories={["Tarefas Criadas", "Tarefas Concluídas"]}
        colors={["blue", "emerald"]}
        showLegend={true}
        showAnimation={true}
        curveType="natural"
        showGridLines={false}
        showYAxis={false}
        showXAxis={true}
        startEndOnly={true}
      />
    </Card>
  )
}
