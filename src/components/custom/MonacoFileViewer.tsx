import { useEffect, useId } from "react"
import Editor from "@monaco-editor/react"
import React from "react"

export interface MonacoFileViewerProps {
  fileName: string
  fileContent: string
  fileType: string
}

export default function MonacoFileViewer({
  fileName,
  fileContent,
  fileType,
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
    />
  )
}
