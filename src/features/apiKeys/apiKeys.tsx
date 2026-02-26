import BasicPage from "@/components/custom/BasicPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GenericTable } from "@/components/custom/GenericTable"
import apiKeyTableInterfaces from "@/features/apiKeys/interfaces"
import { useEffect, useState } from "react"
import type { ApiKeyTableData } from "@/models/apiKeys"
import apiKeysService from "@/services/apiKeysService"
import type { SortingState } from "@tanstack/react-table"
import { Row } from "@tanstack/react-table"
import { ApiKeyCreateDialog } from "@/components/custom/system/ApiKeyCreateDialog"
import { toast } from "@/hooks/use-toast"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/custom/LoadingOverlay"
import { ConfirmationDialogActionType } from "@/components/confirmationDialogAction"

export const apiKeysDefaultSortingState = [{ id: "created_at", desc: true }]

export default function ApiKeys() {
  const [tableData, setTableData] = useState<ApiKeyTableData[]>([])
  const [sorting, setSorting] = useState<SortingState>(
    apiKeysDefaultSortingState,
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllApiKeys()
  }, [])

  const getAllApiKeys = async () => {
    apiKeysService
      .getAllApiKeys()
      .then(data => {
        setTableData(data)
      })
      .catch(err => {
        console.error(err)
        toast({
          title: "Failed to fetch API keys",
          variant: "destructive",
          duration: 1000,
        })
      })
  }

  const onPageChange = ({ sorting }: { sorting: SortingState }) => {
    setSorting(sorting)
  }

  const handleDeleteApiKey = async (
    acton: ConfirmationDialogActionType,
    keyId: string,
  ) => {
    if (acton === ConfirmationDialogActionType.CANCEL) return
    setLoading(true)
    apiKeysService
      .deleteApikey(keyId)
      .then(() => {
        toast({
          title: "API key deleted",
          duration: 2000,
        })
      })
      .catch(err => {
        toast({
          title: "Failed to delete API key",
          variant: "destructive",
          duration: 2000,
        })
      })
      .finally(() => {
        setLoading(false)
        getAllApiKeys()
      })
  }

  const handleCreateApiKey = async (name: string) => {
    setLoading(true)
    return apiKeysService
      .createApiKey(name)
      .then(response => {
        toast({
          title: "API key created",
          duration: 2000,
        })
        return response
      })
      .catch(err => {
        toast({
          title: "Failed to create API key",
          variant: "destructive",
          duration: 1000,
        })
      })
      .finally(() => {
        setLoading(false)
        getAllApiKeys()
      })
  }

  const columns = apiKeyTableInterfaces({
    onDelete: handleDeleteApiKey,
  })

  return (
    <BasicPage title={"API Keys"} description={"Manage your API keys"}>
      <Card className="border-none p-0">
        <CardContent className="p-0">
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-row gap-2"}>
              <ApiKeyCreateDialog onChange={handleCreateApiKey}>
                <Button variant="outline" className={"border-border"}>
                  <PlusIcon /> Add Key
                </Button>
              </ApiKeyCreateDialog>
            </div>
            <Spinner isLoading={loading}>
              <GenericTable<ApiKeyTableData>
                columns={columns}
                data={tableData}
                filters={{ sorting }}
                events={{
                  onPageChange: onPageChange,
                  actionConfirmed: () => {},
                }}
              />
            </Spinner>
          </div>
        </CardContent>
      </Card>
    </BasicPage>
  )
}
