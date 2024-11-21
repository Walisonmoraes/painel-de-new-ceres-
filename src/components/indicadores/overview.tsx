"use client"

import { Card } from "@tremor/react"
import {
  AreaChart,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
} from "@tremor/react"

const data = [
  {
    date: "Jan 23",
    Produtividade: 167,
    Eficiência: 145,
  },
  {
    date: "Fev 23",
    Produtividade: 125,
    Eficiência: 110,
  },
  {
    date: "Mar 23",
    Produtividade: 156,
    Eficiência: 149,
  },
  {
    date: "Abr 23",
    Produtividade: 165,
    Eficiência: 112,
  },
  {
    date: "Mai 23",
    Produtividade: 153,
    Eficiência: 138,
  },
  {
    date: "Jun 23",
    Produtividade: 124,
    Eficiência: 145,
  },
  {
    date: "Jul 23",
    Produtividade: 198,
    Eficiência: 167,
  },
  {
    date: "Ago 23",
    Produtividade: 192,
    Eficiência: 170,
  },
  {
    date: "Set 23",
    Produtividade: 182,
    Eficiência: 163,
  },
  {
    date: "Out 23",
    Produtividade: 172,
    Eficiência: 155,
  },
  {
    date: "Nov 23",
    Produtividade: 189,
    Eficiência: 171,
  },
  {
    date: "Dez 23",
    Produtividade: 195,
    Eficiência: 185,
  },
]

export function Overview() {
  return (
    <Card>
      <Title>Desempenho Anual</Title>
      <Text>Análise de produtividade e eficiência ao longo do ano</Text>
      <TabGroup>
        <TabList className="mt-8">
          <Tab>Produtividade</Tab>
          <Tab>Eficiência</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AreaChart
              className="mt-8 h-72"
              data={data}
              index="date"
              categories={["Produtividade"]}
              colors={["blue"]}
              showLegend={false}
              showAnimation={true}
              showGridLines={false}
              curveType="natural"
            />
          </TabPanel>
          <TabPanel>
            <AreaChart
              className="mt-8 h-72"
              data={data}
              index="date"
              categories={["Eficiência"]}
              colors={["green"]}
              showLegend={false}
              showAnimation={true}
              showGridLines={false}
              curveType="natural"
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  )
}
