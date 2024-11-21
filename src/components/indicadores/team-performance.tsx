"use client"

import { Card, Title, BarChart, Text } from "@tremor/react"

const data = [
  {
    name: "Desenvolvimento",
    "Tarefas Concluídas": 456,
    "Em Andamento": 351,
  },
  {
    name: "Design",
    "Tarefas Concluídas": 271,
    "Em Andamento": 157,
  },
  {
    name: "Marketing",
    "Tarefas Concluídas": 191,
    "Em Andamento": 82,
  },
  {
    name: "Vendas",
    "Tarefas Concluídas": 91,
    "Em Andamento": 44,
  },
]

export function TeamPerformance() {
  return (
    <Card>
      <Title>Desempenho por Equipe</Title>
      <Text>Distribuição de tarefas por departamento</Text>
      <BarChart
        className="mt-6 h-72"
        data={data}
        index="name"
        categories={["Tarefas Concluídas", "Em Andamento"]}
        colors={["emerald", "yellow"]}
        showLegend={true}
        showAnimation={true}
        layout="vertical"
        stack={true}
      />
    </Card>
  )
}
