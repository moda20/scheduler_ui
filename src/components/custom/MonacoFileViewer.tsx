import type { OnChange } from "@monaco-editor/react"
import Editor from "@monaco-editor/react"
import React from "react"

export interface MonacoFileViewerProps {
  fileName: string
  fileContent: string
  fileType: string
  onChange?: OnChange
}

export default function MonacoFileViewer({
  fileName,
  fileContent,
  fileType,
  onChange,
}: MonacoFileViewerProps) {
  const convertedFileContent = React.useMemo(() => {
    switch (fileType) {
      case "json":
        return JSON.stringify(fileContent, null, 4)
      default:
        return fileContent
    }
  }, [fileContent, fileType])

  return (
    <Editor
      theme={"vs-dark"}
      height="100%"
      defaultLanguage={fileType}
      value={convertedFileContent}
      onChange={onChange}
    />
  )
}
