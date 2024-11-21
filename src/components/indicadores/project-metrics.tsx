"use client"

import { Card, Title, DonutChart, Text, Legend } from "@tremor/react"

const projects = [
  {
    name: "Em Dia",
    value: 65,
  },
  {
    name: "Atrasado",
    value: 20,
  },
  {
    name: "Crítico",
    value: 15,
  },
]

const valueFormatter = (number: number) => `${number}%`

export function ProjectMetrics() {
  return (
    <Card>
      <Title>Status dos Projetos</Title>
      <Text>Distribuição dos projetos por status</Text>
      <div className="mt-6">
        <DonutChart
          className="h-52 mt-6"
          data={projects}
          category="value"
          index="name"
          valueFormatter={valueFormatter}
          colors={["emerald", "yellow", "rose"]}
          showAnimation={true}
          showTooltip={true}
        />
        <Legend
          className="mt-6"
          categories={["Em Dia", "Atrasado", "Crítico"]}
          colors={["emerald", "yellow", "rose"]}
        />
      </div>
    </Card>
  )
}
