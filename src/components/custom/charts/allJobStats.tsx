import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import jobsService from "@/services/JobsService"
import { useEffect, useState } from "react"
import {
  DatePickerWithPresets,
  defaultDateRange,
} from "@/components/ui/date-picker-presets"
import type { DateRange } from "react-day-picker"
const chartConfig = {
  average_duration: {
    label: "Average duration",
    color: "hsl(var(--chart-1))",
  },
  total_runtime: {
    label: "Runtime duration",
    color: "hsl(var(--chart-2))",
  },
  total_runs: {
    label: "Number of runs",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export interface AllJobsStatsProps {
  dateRange?: DateRange | undefined
  stats?: Array<any>
}

export function AllJobsStats(props: AllJobsStatsProps) {
  const [stats, setStats] = React.useState(props.stats ?? [])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultDateRange.from,
    to: defaultDateRange.to,
  })

  const getStats = () => {
    jobsService.jobStats([], dateRange).then(data => {
      setStats(data as Array<any>)
    })
  }

  useEffect(() => {
    getStats()
  }, [dateRange])

  const updatePeriod = (period: DateRange | undefined) => {
    setDateRange(period)
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 px-4 sm:flex-row text-foreground bg-background border-border rounded-t-xl">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>All Jobs</CardTitle>
          <CardDescription>
            Showing the daily stats for all jobs
          </CardDescription>
        </div>
        <DatePickerWithPresets
          onChange={updatePeriod}
          defaultValue={dateRange}
        />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={stats}>
            <defs>
              <linearGradient
                id="fillAverageDuration"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-average_duration)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-average_duration)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="FillAverageRuntime"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-total_runtime)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total_runtime)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="FillTotalRuns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="95%" stopColor="transparent" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              allowDataOverflow={true}
            />
            <YAxis
              yAxisId="total_runs"
              domain={["dataMin", "auto"]}
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              amplitude={200}
              allowDataOverflow={true}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  ItemLabelClassName="gap-4"
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="average_duration"
              type="natural"
              fill="url(#FillAverageRuntime)"
              stroke="var(--color-total_runtime)"
              stackId="a"
            />
            <Area
              dataKey="total_runtime"
              type="natural"
              fill="url(#fillAverageDuration)"
              stroke="var(--color-average_duration)"
              stackId="a"
            />
            <Area
              dataKey="total_runs"
              type="natural"
              stroke="var(--color-total_runs)"
              fill="url(#FillTotalRuns)"
              stackId="b"
              yAxisId="total_runs"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
