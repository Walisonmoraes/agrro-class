import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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

export const description = "Gráfico de pizza interativo - Distribuição"

const productData = [
  { product: "soja", volume: 4500, fill: "url(#gradientSoja)" },
  { product: "milho", volume: 3200, fill: "url(#gradientMilho)" },
  { product: "trigo", volume: 2100, fill: "url(#gradientTrigo)" },
  { product: "arroz", volume: 1800, fill: "url(#gradientArroz)" },
  { product: "feijao", volume: 1200, fill: "url(#gradientFeijao)" },
]

const chartConfig = {
  volume: {
    label: "Volume",
  },
  soja: {
    label: "Soja",
    color: "#10b981",
  },
  milho: {
    label: "Milho",
    color: "#3b82f6",
  },
  trigo: {
    label: "Trigo",
    color: "#f59e0b",
  },
  arroz: {
    label: "Arroz",
    color: "#8b5cf6",
  },
  feijao: {
    label: "Feijão",
    color: "#ef4444",
  },
} satisfies ChartConfig

export function DistributionPieChart() {
  const id = "pie-interactive"

  return (
    <Card data-chart={id}>
      <CardHeader>
        <div className="flex flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1 flex-1">
            <CardTitle>Distribuição</CardTitle>
            <CardDescription>Volume por produto este mês</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 justify-center pb-0">
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <defs>
                <linearGradient id="gradientSoja" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#34d399" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="gradientMilho" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="gradientTrigo" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#fde047" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="gradientArroz" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="gradientFeijao" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#f87171" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={productData}
                dataKey="volume"
                nameKey="product"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const totalVolume = productData.reduce((sum, item) => sum + item.volume, 0)
                      
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVolume.toLocaleString('pt-BR')}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            TON
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
