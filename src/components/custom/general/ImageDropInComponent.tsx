import { cn } from "@/lib/utils"
import { ImageIcon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useRef, useState } from "react"
import { InputProps } from "@/components/ui/input"
import BImage from "@/components/custom/general/PublicBackendImage"

export interface ImageDropInComponentProps extends InputProps {
  image: { image: File; fileName: string; url: string }
  onfileUpload: (file: { image: File; fileName: string; url: string }) => void
}

export default function ImageDropInComponent({
  onChange,
  value,
  className,
  image,
  onfileUpload,
  ...props
}: ImageDropInComponentProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [imageUrl, setImageUrl] = useState<any>("")
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: File[] = Array.from(files).filter((file: any) =>
      file.type.startsWith("image/"),
    )
    setFiles(prev => [...prev, ...newFiles])
    const fileName = URL.createObjectURL(newFiles[0])
    setImageUrl(fileName)
    onfileUpload({
      image: newFiles[0],
      url: fileName,
      fileName: newFiles[0].name,
    })
  }, [])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files)
    }
  }, [])

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  useEffect(() => {
    console.log(image)
    if (!image) return
    if (image?.url) {
      setImageUrl(image?.url)
    } else {
      setFiles(prev => [...prev, image?.image])
      setImageUrl(URL.createObjectURL(image?.image))
    }
  }, [image])
  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-4 transition-colors",
        dragActive
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-gray-400",
        files.length > 0 && "border-primary/50",
        className,
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        {...props}
      />

      <div className="flex flex-col items-center justify-center text-center h-full">
        {!imageUrl ? (
          <div className="flex flex-col mb-4 items-center justify-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors border border-border",
                dragActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground",
              )}
            >
              <UploadIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your images here
            </p>
            <p className="text-xs text-gray-500 mb-4">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "w-auto h-auto max-h-28 max-w-28 aspect-square items-center justify-center mb-4 transition-colors flex flex-col overflow-clip",
              dragActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground",
            )}
          >
            <BImage src={imageUrl} alt={files[0]?.name} />
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onButtonClick}
          className="gap-2 bg-transparent"
        >
          <ImageIcon className="w-4 h-4" />
          Browse Files
        </Button>
      </div>
    </div>
  )
}
