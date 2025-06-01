export interface ConfigItem {
  value: string
  is_encrypted?: boolean
  doc?: string
  default?: string
  format?: string
  db_mirror?: boolean
  base?: boolean
  subGroups?: Array<ConfigItem>
  [key: string]: any
}

export interface ConfigList {
  [key: string]: ConfigItem
}

export type ConfigType = ConfigList & {
  [key: string]: { [key: string]: ConfigItem }
}
