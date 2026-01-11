import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/buttonGroup"
import * as React from "react"
import { useCallback } from "react"

export interface TabButtonGroupProps {
  activeTab?: string
  tabList: string[]
  setActiveTab: (tab: string) => void
}

export default function TabButtonGroup({
  activeTab,
  setActiveTab,
  tabList,
}: TabButtonGroupProps) {
  const clickEvent = useCallback(
    (tab: string) => {
      return () => setActiveTab(tab)
    },
    [setActiveTab],
  )

  return (
    <ButtonGroup>
      {tabList.map((tab, index) => {
        return (
          <Button
            key={index}
            data-active={activeTab === tab}
            className="data-[active=true]:bg-orange-50 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-900 dark:data-[active=true]:text-orange-50"
            variant={"outline"}
            onClick={clickEvent(tab)}
          >
            {tab}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
