import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export const description = "Gráfico de área - Tendência de Volume"

const chartData = [
  { day: "Seg", volume: 120 },
  { day: "Ter", volume: 180 },
  { day: "Qua", volume: 90 },
  { day: "Qui", volume: 250 },
  { day: "Sex", volume: 140 },
  { day: "Sáb", volume: 220 },
  { day: "Dom", volume: 190 },
]

const chartConfig = {
  volume: {
    label: "Volume",
    color: "#10b981",
  },
} satisfies ChartConfig

export function TrendAreaChart() {
  return (
    <div>
      <div>
        <h3 className="font-heading text-base leading-snug font-medium">Tendência de Volume</h3>
        <p className="text-sm text-muted-foreground">
          Últimos 7 dias de operações
        </p>
      </div>
      <div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="gradientVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `${value}TON`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  indicator="line"
                  formatter={(value: number) => [
                    `${value} TON`,
                    "Volume"
                  ]}
                />
              }
            />
            <Area
              dataKey="volume"
              type="natural"
              fill="url(#gradientVolume)"
              fillOpacity={0.4}
              stroke="#10b981"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
      <div className="flex w-full items-start gap-2 text-sm mt-4 pt-4 border-t">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 leading-none font-medium text-emerald-600">
            Tendência de alta de 12.5% esta semana <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            Média diária: 175 TON
          </div>
        </div>
      </div>
    </div>
  )
}
