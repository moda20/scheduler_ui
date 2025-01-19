import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import moment from "moment"
import { addDays, format, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

export interface DatePickerWithPresetsProps {
  onChange: (date: DateRange | undefined) => void
  defaultValue?: DateRange
}

export function DatePickerWithPresets(props: DatePickerWithPresetsProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    props.defaultValue ?? {
      from: subDays(new Date(), 7),
      to: new Date(),
    },
  )

  const selectDate = (date: DateRange | undefined) => {
    setDate(date)
    props.onChange(date)
  }

  const setPresetDates = (command: string) => {
    switch (command) {
      case "0":
        selectDate({
          from: subDays(new Date(), 1),
          to: new Date(),
        })
        break
      case "1":
        selectDate({
          from: subDays(new Date(), 2),
          to: new Date(),
        })
        break
      case "3":
        selectDate({
          from: subDays(new Date(), 7),
          to: new Date(),
        })
        break
      case "7":
        selectDate({
          from: subDays(new Date(), 30),
          to: new Date(),
        })
        break
      default:
        break
    }
  }
  const parseDateToPreset = () => {
    const currentDateCount = moment(date?.to).diff(moment(date?.from), "days")
    switch (currentDateCount) {
      case 1:
        return "0"
      case 2:
        return "1"
      case 7:
        return "3"
      case 30:
        return "7"
      default:
        return undefined
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-50 flex w-auto flex-col space-y-2 p-2 bg-background text-foreground pointer-events-auto"
      >
        <Select onValueChange={setPresetDates} value={parseDateToPreset()}>
          <SelectTrigger>
            <SelectValue
              className="bg-background text-foreground"
              placeholder="Select"
            />
          </SelectTrigger>
          <SelectContent
            className="bg-background text-foreground"
            position="popper"
          >
            <SelectItem value="0">Last day</SelectItem>
            <SelectItem value="1">Last 2 days</SelectItem>
            <SelectItem value="3">Last week</SelectItem>
            <SelectItem value="7">last month</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={selectDate}
            numberOfMonths={2}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
