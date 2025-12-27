import type { OnChange } from "@monaco-editor/react"
import Editor from "@monaco-editor/react"
import React, { useMemo } from "react"

export interface MonacoFileViewerProps {
  fileName: string
  fileContent: string
  fileType: string
  onChange?: OnChange
  readOnly?: boolean
}

export default function MonacoFileViewer({
  fileName,
  fileContent,
  fileType,
  onChange,
  readOnly,
}: MonacoFileViewerProps) {
  const convertedFileContent = React.useMemo(() => {
    switch (fileType) {
      case "json":
        return JSON.stringify(fileContent, null, 4)
      default:
        return fileContent
    }
  }, [fileContent, fileType])

  const editorOptions = useMemo(
    () => ({
      readOnly: readOnly ?? false,
    }),
    [readOnly],
  )

  return (
    <Editor
      theme={"vs-dark"}
      height="100%"
      defaultLanguage={fileType}
      value={convertedFileContent}
      onChange={onChange}
      options={editorOptions}
    />
  )
}
