import type { ComboBoxItem, ComboBoxProps } from "@/components/ui/combo-box"
import { ComboBox } from "@/components/ui/combo-box"
import { useJobs } from "@/hooks/useJobs"

interface JobsListingDropdownProps {
  itemList?: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  selectedItemValue: string | Array<string> | undefined
  multiSelect?: boolean
  onChange: (value?: string | Array<string>) => void
  comboBoxProps?: Omit<ComboBoxProps, "itemList" | "onChange">
}
export function JobsListingDropdown({
  comboBoxProps,
  selectedItemValue,
  multiSelect,
  onChange,
}: JobsListingDropdownProps) {
  const { jobsItems } = useJobs({
    limit: 99999,
    offset: 0,
    sorting: [{ id: "name", desc: false }],
  })
  return (
    <ComboBox
      selectedItemValue={selectedItemValue}
      itemList={jobsItems}
      noFieldsFoundText={"No Jobs found"}
      searchFieldPlaceholder={"Search Jobs..."}
      inputFieldsText={"Filter jobs"}
      className="w-full"
      triggerClassName={"w-full"}
      onChange={onChange}
      multiSelect={multiSelect}
      {...comboBoxProps}
    />
  )
}
