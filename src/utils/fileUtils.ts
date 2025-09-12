import { JsonValidationError } from "@/components/custom/general/FileUploadBox"

export const validateJsonContent = (
  content?: string,
): { errors: JsonValidationError[]; outputContent?: any } => {
  const errors: JsonValidationError[] = []
  let outputContent: any = {}
  if (!content?.trim()) {
    errors.push({ message: "File is empty" })
    return {
      errors,
    }
  }

  try {
    outputContent = JSON.parse(content)
  } catch (error) {
    // ?????????
    if (error instanceof SyntaxError) {
      // Try to extract line and column information from the error message
      const match = error.message.match(/at position (\d+)/)
      if (match) {
        const position = Number.parseInt(match[1])
        const lines = content.substring(0, position).split("\n")
        const line = lines.length
        const column = lines[lines.length - 1].length + 1

        errors.push({
          line,
          column,
          message: `JSON syntax error: ${error.message}`,
        })
      } else {
        errors.push({ message: `JSON syntax error: ${error.message}` })
      }
    } else {
      errors.push({ message: "Unknown parsing error occurred" })
    }
  }

  return {
    errors,
    outputContent,
  }
}
