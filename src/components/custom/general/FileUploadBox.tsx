// assisted by v0
import React, { useCallback } from "react"

import { useState, useRef } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { validateJsonContent } from "@/utils/fileUtils"

export interface JsonValidationError {
  line?: number
  column?: number
  message: string
}

interface FileUploadBoxProps {
  onFileProcessed?: (data: any, fileName: string) => void
  maxSizeInMB?: number
  className?: string
  title?: string
  description?: string
}

export function FileUploadBox({
  onFileProcessed,
  maxSizeInMB = 10,
  className,
  title,
  description,
}: FileUploadBoxProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [parsedData, setParsedData] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<
    JsonValidationError[]
  >([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024

  const processFile = useCallback(
    async (selectedFile: File) => {
      setIsProcessing(true)
      setValidationErrors([])
      setUploadStatus("idle")

      try {
        // Validate file size
        if (selectedFile.size > maxSizeInBytes) {
          setValidationErrors([
            {
              message: `File size (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum allowed size of ${maxSizeInMB}MB`,
            },
          ])
          setUploadStatus("error")
          return
        }

        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => resolve(e.target?.result as string)
          reader.onerror = () => reject(new Error("Failed to read file"))
          reader.readAsText(selectedFile)
        })

        setFileContent(content)

        const { errors, outputContent } = validateJsonContent(content)
        setValidationErrors(errors)

        if (!errors.length) {
          setParsedData(outputContent)
          setUploadStatus("success")
          onFileProcessed?.(outputContent, selectedFile.name)
        } else {
          setUploadStatus("error")
        }
      } catch (error) {
        setValidationErrors([
          {
            message:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          },
        ])
        setUploadStatus("error")
      } finally {
        setIsProcessing(false)
      }
    },
    [maxSizeInBytes, maxSizeInMB, onFileProcessed, uploadStatus],
  )

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    processFile(selectedFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/json") {
      handleFileSelect(droppedFile)
    } else {
      setValidationErrors([{ message: "Please drop a valid JSON file" }])
      setUploadStatus("error")
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    setFileContent("")
    setParsedData(null)
    setValidationErrors([])
    setUploadStatus("idle")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = () => {
    switch (uploadStatus) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      default:
        return ""
    }
  }

  return (
    <Card className={cn("w-full ", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0 pt-0">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer text-foreground bg-background",
            isDragOver && "border-primary bg-primary/5",
            !file && "hover:border-primary/50 hover:bg-primary/5",
            file && getStatusColor(),
          )}
          onDrop={handleDrop}
          onDragOver={e => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              getStatusIcon()
            )}

            {file ? (
              <div className="space-y-1">
                {uploadStatus === "success" && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✓ JSON file validated successfully
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragOver
                    ? "Drop your JSON file here"
                    : "Choose a JSON file or drag it here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports .json files up to {maxSizeInMB}MB
                </p>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            )}
          </div>
        </div>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">JSON Validation Issues:</p>
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm">
                    {error.line && error.column ? (
                      <span className="font-mono">
                        Line {error.line}, Column {error.column}:{" "}
                        {error.message}
                      </span>
                    ) : (
                      <span>{error.message}</span>
                    )}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {file && uploadStatus === "success" && parsedData && (
          <Alert className="border-border">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">File processed successfully!</p>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>File:</strong> {file.name}
                  </p>
                  <p>
                    <strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {typeof parsedData === "object"
                      ? Array.isArray(parsedData)
                        ? `Array (${parsedData.length} items)`
                        : `Object (${Object.keys(parsedData).length} properties)`
                      : typeof parsedData}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {file && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearFile}
              className="flex-1 bg-transparent"
            >
              Clear File
            </Button>
            {uploadStatus === "error" && (
              <Button
                onClick={() => processFile(file)}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Revalidating..." : "Retry Validation"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
