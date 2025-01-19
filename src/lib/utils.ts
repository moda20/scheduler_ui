import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import cronstrue from "cronstrue"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStringFromCronExpression(cronSetting: string) {
  try {
    return cronstrue.toString(cronSetting).toString()
  } catch (err) {
    console.log(err)
    return null
  }
}

export function parseCron(inputCronString: string) {
  try {
    return cronstrue.toString(inputCronString)
  } catch (err) {
    return ""
  }
}
