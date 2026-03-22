import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/ui/chart"

export const description = "Gráfico de barras - Volume por Produto"

const chartData = [
  { month: "Jan", soja: 4500, milho: 3200 },
  { month: "Fev", soja: 3800, milho: 4100 },
  { month: "Mar", soja: 5200, milho: 3800 },
  { month: "Abr", soja: 4900, milho: 4500 },
  { month: "Mai", soja: 5800, milho: 5200 },
  { month: "Jun", soja: 6200, milho: 4800 },
]

const chartConfig = {
  soja: {
    label: "Soja",
    color: "#10b981",
  },
  milho: {
    label: "Milho",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function VolumeBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume por Produto</CardTitle>
        <CardDescription>Volume por produto este mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientSoja" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="gradientMilho" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `${value}TON`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString('pt-BR')} TON`,
                    name === 'soja' ? 'Soja' : 'Milho'
                  ]}
                />
              }
            />
            <Bar dataKey="milho" fill="url(#gradientMilho)" radius={[8, 8, 8, 8]} />
            <Bar dataKey="soja" fill="url(#gradientSoja)" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-emerald-600">
          Tendência de alta de 8.3% este mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando volume total por produto nos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  )
}
