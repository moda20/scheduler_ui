export interface LogFileMetadata {
  name: string
  hash?: string
  date?: number
  deletionDate?: string
  fileStats?: {
    size?: number
    createdAt?: Date
    lastModified?: Date
  }
}

export interface FileItemModel {
  index: number
  blockId?: string
  createAt?: string
  fileType?: string
  fileId: string
  fileName: string
  fileSize?: string
  originName?: string
  deletionDate?: string
}

export interface LogsStructure {
  data: {
    lines: string[]
    nextOffset: number
  }
  nextPage?: () => Promise<LogsStructure>
}
