import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

export const description = "Gráfico de área interativo para volume mensal"

const chartData = [
  { month: "Jan", soja: 4500, milho: 3200 },
  { month: "Fev", soja: 3800, milho: 4100 },
  { month: "Mar", soja: 5200, milho: 3800 },
  { month: "Abr", soja: 4900, milho: 4500 },
  { month: "Mai", soja: 5800, milho: 5200 },
  { month: "Jun", soja: 6200, milho: 4800 },
  { month: "Jul", soja: 5500, milho: 5500 },
  { month: "Ago", soja: 6800, milho: 5900 },
  { month: "Set", soja: 7200, milho: 6200 },
  { month: "Out", soja: 6500, milho: 5800 },
  { month: "Nov", soja: 5900, milho: 5400 },
  { month: "Dez", soja: 7100, milho: 6500 },
]

const chartConfig = {
  volume: {
    label: "Volume (TON)",
  },
  soja: {
    label: "Soja",
    color: "#10b981",
  },
  milho: {
    label: "Milho",
    color: "#3b82f6",
  },
} satisfies ChartConfig

interface VolumeAreaChartProps {
  className?: string
}

export function VolumeAreaChart({ className }: VolumeAreaChartProps) {
  const [timeRange, setTimeRange] = React.useState("12m")

  const filteredData = chartData.filter((item) => {
    if (timeRange === "12m") return true
    if (timeRange === "6m") return ["Jul", "Ago", "Set", "Out", "Nov", "Dez"].includes(item.month)
    if (timeRange === "3m") return ["Out", "Nov", "Dez"].includes(item.month)
    return true
  })

  return (
    <div className="pt-0">
      <div className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <h3 className="font-heading text-base leading-snug font-medium">Volume Mensal de Produção</h3>
          <p className="text-sm text-muted-foreground">
            Mostrando volume total por produto durante o ano
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Último ano" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              Último ano
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Últimos 6 meses
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSoja" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#10b981"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#10b981"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMilho" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#3b82f6"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#3b82f6"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#64748b', fontSize: 11 }}
              width={60}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Mês: ${label}`}
                  indicator="dot"
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString('pt-BR')} TON`,
                    name === 'soja' ? 'Soja' : 'Milho'
                  ]}
                />
              }
            />
            <Area
              dataKey="milho"
              type="natural"
              fill="url(#fillMilho)"
              stroke="#3b82f6"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="soja"
              type="natural"
              fill="url(#fillSoja)"
              stroke="#10b981"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
